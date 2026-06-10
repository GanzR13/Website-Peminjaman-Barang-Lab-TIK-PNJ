"use strict";

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const {
	Peminjaman,
	DetailPeminjaman,
	Barang,
	User,
	Mahasiswa,
	Pegawai,
	ref_Prodi,
	ref_Kelas,
} = require("../models");

const safeText = (value, fallback = "-") => {
	if (value === null || value === undefined || value === "") return fallback;
	return String(value);
};

const parseDate = (value) => {
	if (!value) return null;

	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}

	const raw = String(value);
	const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

	if (dateOnly) {
		const [, year, month, day] = dateOnly;
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	const parsed = new Date(raw);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTanggalIndonesia = (value, fallback = "-") => {
	const date = parseDate(value);
	if (!date) return fallback;

	return date.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const ensureDir = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
};

const safeFileName = (value) => {
	return String(value || "surat-peminjaman")
		.replace(/[^a-zA-Z0-9-_]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};

const getBottomLimit = (doc) => {
	return doc.page.height - doc.page.margins.bottom;
};

const ensureSpace = (doc, currentY, neededHeight, newPageY = 60) => {
	const bottomLimit = getBottomLimit(doc);

	if (currentY + neededHeight > bottomLimit) {
		doc.addPage();
		return newPageY;
	}

	return currentY;
};

const normalizeCloudinaryImageUrl = (url) => {
	if (!url || !String(url).startsWith("http")) return null;

	const rawUrl = String(url);

	if (
		rawUrl.includes("res.cloudinary.com") &&
		rawUrl.includes("/image/upload/") &&
		!rawUrl.includes("/f_png")
	) {
		return rawUrl.replace("/image/upload/", "/image/upload/f_png,q_auto/");
	}

	return rawUrl;
};

const fetchImageBuffer = async (url) => {
	try {
		const imageUrl = normalizeCloudinaryImageUrl(url);
		if (!imageUrl) return null;

		const response = await fetch(imageUrl);

		if (!response.ok) {
			console.warn("[SURAT] Gagal mengambil gambar. Status:", response.status);
			return null;
		}

		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.warn("[SURAT] Gagal mengambil gambar:", error.message);
		return null;
	}
};

const getPlain = (instance) => {
	return instance && instance.get ? instance.get({ plain: true }) : instance;
};

const getNamaPeminjam = (data) => {
	const peminjam = data?.peminjam || {};

	return (
		peminjam.mahasiswa?.nama_mahasiswa ||
		peminjam.pegawai?.nama_lengkap ||
		peminjam.email ||
		"User Terhapus"
	);
};

const getPemohonData = (data) => {
	const peminjam = data?.peminjam || {};
	const mahasiswa = peminjam?.mahasiswa || null;
	const pegawai = peminjam?.pegawai || null;

	if (mahasiswa) {
		return {
			nama:
				mahasiswa?.nama_mahasiswa ||
				peminjam?.email ||
				"User Terhapus",
			labelIdentitas: "NIM",
			identitas: mahasiswa?.nim || "-",
			email: peminjam?.email || "-",
			prodi: mahasiswa?.prodi?.nama_prodi || "-",
			kelas: mahasiswa?.kelas?.nama_kelas || "-",
			angkatan: mahasiswa?.angkatan || "-",
			isDosen: false,
			ttdDigital: peminjam?.ttd_digital || null,
		};
	}

	if (pegawai) {
		return {
			nama:
				pegawai?.nama_lengkap ||
				peminjam?.email ||
				"User Terhapus",
			labelIdentitas: "NIP",
			identitas: pegawai?.nip || "-",
			email: peminjam?.email || "-",
			prodi: "-",
			kelas: "-",
			angkatan: "-",
			isDosen: true,
			ttdDigital: peminjam?.ttd_digital || null,
		};
	}

	return {
		nama: peminjam?.email || "User Terhapus",
		labelIdentitas: "ID",
		identitas: peminjam?.id || "-",
		email: peminjam?.email || "-",
		prodi: "-",
		kelas: "-",
		angkatan: "-",
		isDosen: false,
		ttdDigital: peminjam?.ttd_digital || null,
	};
};

const getNamaKegiatan = (data) => {
	const kategori = String(data.kategori_kebutuhan || "").toLowerCase();
	const jenis = String(data.jenis_khusus || "").toLowerCase();

	if (kategori !== "khusus") return "Praktikum Reguler / Harian";
	if (jenis === "pbl") return "Project Based Learning (PBL)";
	if (jenis === "skripsi" || jenis === "tugas akhir") return "Tugas Akhir / Skripsi";
	if (jenis === "organisasi") return data.nama_acara || "Kegiatan Organisasi";
	if (jenis === "pribadi") return "Peminjaman Pribadi";

	return data.jenis_khusus || "Peminjaman Khusus";
};

const getUserPegawai = async (userId) => {
	if (!userId) return null;

	const user = await User.findByPk(userId, {
		attributes: ["id", "email", "ttd_digital"],
		include: [
			{
				model: Pegawai,
				as: "pegawai",
				attributes: ["id", "nama_lengkap", "nip"],
				required: false,
			},
		],
	});

	return user ? user.get({ plain: true }) : null;
};

const drawTextCenter = (doc, text, x, y, width, options = {}) => {
	doc.text(text, x, y, {
		width,
		align: "center",
		...options,
	});
};

const drawInfoRow = (
	doc,
	label,
	value,
	x,
	y,
	labelWidth = 135,
	valueWidth = 330,
) => {
	doc.font("Times-Roman").fontSize(11);

	const labelHeight = doc.heightOfString(label, {
		width: labelWidth,
	});

	doc.text(label, x, y, {
		width: labelWidth,
	});

	doc.font("Times-Roman").fontSize(11);

	const valueText = `: ${safeText(value)}`;
	const valueHeight = doc.heightOfString(valueText, {
		width: valueWidth,
	});

	doc.text(valueText, x + labelWidth, y, {
		width: valueWidth,
	});

	return y + Math.max(labelHeight, valueHeight, 14) + 4;
};

const drawSignature = async ({
	doc,
	x,
	y,
	width,
	title,
	name,
	identityLabel = "NIP",
	identityValue,
	ttdUrl,
}) => {
	doc.font("Times-Roman").fontSize(10.5);
	drawTextCenter(doc, title, x, y, width, { lineGap: 2 });

	const buffer = await fetchImageBuffer(ttdUrl);

	if (buffer) {
		try {
			doc.image(buffer, x + width / 2 - 45, y + 34, {
				fit: [90, 48],
				align: "center",
				valign: "center",
			});
		} catch (error) {
			console.warn("[SURAT] Gagal render TTD:", error.message);
		}
	}

	const nameText = safeText(name, "................................");
	const nameY = y + 90;

	doc.font("Times-Bold").fontSize(9.5);

	const nameHeight = doc.heightOfString(nameText, {
		width,
		align: "center",
	});

	doc.text(nameText, x, nameY, {
		width,
		align: "center",
		underline: true,
	});

	const identityY = nameY + Math.max(nameHeight, 12) + 3;

	doc
		.font("Times-Roman")
		.fontSize(9)
		.text(
			`${identityLabel}. ${safeText(identityValue, "................")}`,
			x,
			identityY,
			{
				width,
				align: "center",
			},
		);

	return identityY + 16;
};

const loadPeminjaman = async (peminjamanId) => {
	return Peminjaman.findByPk(peminjamanId, {
		include: [
			{
				model: User,
				as: "peminjam",
				attributes: ["id", "email", "ttd_digital"],
				required: false,
				include: [
					{
						model: Mahasiswa,
						as: "mahasiswa",
						attributes: ["id", "nama_mahasiswa", "nim", "angkatan"],
						required: false,
						include: [
							{
								model: ref_Prodi,
								as: "prodi",
								attributes: ["id", "nama_prodi"],
								required: false,
							},
							{
								model: ref_Kelas,
								as: "kelas",
								attributes: ["id", "nama_kelas"],
								required: false,
							},
						],
					},
					{
						model: Pegawai,
						as: "pegawai",
						attributes: ["id", "nama_lengkap", "nip"],
						required: false,
					},
				],
			},
			{
				model: DetailPeminjaman,
				as: "detail_barang",
				include: [
					{
						model: Barang,
						as: "barang",
						attributes: ["id", "nama_barang"],
						required: false,
					},
				],
			},
		],
	});
};

const generateSuratPeminjamanPDF = async ({
	peminjaman_id,
	kode_peminjaman,
}) => {
	const peminjaman = await loadPeminjaman(peminjaman_id);

	if (!peminjaman) {
		throw new Error("Data peminjaman tidak ditemukan untuk generate surat.");
	}

	const data = getPlain(peminjaman);

	const kodePeminjaman =
		kode_peminjaman || data.kode_peminjaman || `REQ-${data.id}`;

	const pemohon = getPemohonData(data);

	const detailBarang = Array.isArray(data.detail_barang)
		? data.detail_barang
		: [];

	const kalab = await getUserPegawai(data.kalab_approved_by);
	const dosenPJ = await getUserPegawai(data.dosen_pj_user_id);

	const outputDir = path.join(__dirname, "../temp/surat");
	ensureDir(outputDir);

	const pdfPath = path.join(outputDir, `${safeFileName(kodePeminjaman)}.pdf`);

	await new Promise((resolve, reject) => {
		const doc = new PDFDocument({
			size: "A4",
			margin: 45,
			bufferPages: true,
		});

		const stream = fs.createWriteStream(pdfPath);
		doc.pipe(stream);

		stream.on("finish", resolve);
		stream.on("error", reject);
		doc.on("error", reject);

		const buildPdf = async () => {
			try {
				// =========================
				// KOP SURAT
				// =========================
				const logoPath = path.join(__dirname, "../assets/logo_pnj.png");

				if (fs.existsSync(logoPath)) {
					try {
						doc.image(logoPath, 55, 43, { width: 62 });
					} catch (error) {
						console.warn("[SURAT] Logo gagal dirender:", error.message);
					}
				} else {
					console.warn("[SURAT] Logo PNJ tidak ditemukan:", logoPath);
				}

				doc.font("Times-Bold").fontSize(12);
				drawTextCenter(
					doc,
					"KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI",
					125,
					45,
					420,
				);

				doc.fontSize(13);
				drawTextCenter(doc, "POLITEKNIK NEGERI JAKARTA", 125, 62, 420);

				doc.fontSize(12);
				drawTextCenter(
					doc,
					"JURUSAN TEKNIK INFORMATIKA DAN KOMPUTER",
					125,
					80,
					420,
				);

				doc.font("Times-Roman").fontSize(9.5);
				drawTextCenter(
					doc,
					"Jl. Prof. Dr. G.A. Siwabessy, Kampus UI Depok 16425",
					125,
					98,
					420,
				);
				drawTextCenter(
					doc,
					"Telepon: (021) 7270036, Fax: (021) 7270034",
					125,
					111,
					420,
				);

				doc.moveTo(50, 130).lineTo(545, 130).lineWidth(1.5).stroke();
				doc.moveTo(50, 133).lineTo(545, 133).lineWidth(0.5).stroke();

				// =========================
				// JUDUL
				// =========================
				doc.font("Times-Bold").fontSize(13);
				drawTextCenter(
					doc,
					"SURAT PEMINJAMAN BARANG LABORATORIUM",
					50,
					155,
					495,
					{ underline: true },
				);

				doc.font("Times-Roman").fontSize(11);
				drawTextCenter(
					doc,
					`Kode Peminjaman: ${safeText(kodePeminjaman)}`,
					50,
					175,
					495,
				);

				const pembuka =
					"Yang bertanda tangan di bawah ini mengajukan permohonan peminjaman barang Laboratorium PLP TIK Jurusan Teknik Informatika dan Komputer Politeknik Negeri Jakarta untuk keperluan berikut:";

				doc
					.font("Times-Roman")
					.fontSize(11)
					.text(pembuka, 70, 208, {
						width: 460,
						align: "justify",
						lineGap: 3,
					});

				let y = 260;

				const writeInfo = (label, value) => {
					y = ensureSpace(doc, y, 28, 60);
					y = drawInfoRow(doc, label, value, 70, y);
				};

				writeInfo("Nama Lengkap", pemohon.nama);
				writeInfo(pemohon.labelIdentitas, pemohon.identitas);

				if (!pemohon.isDosen) {
					writeInfo("Program Studi", pemohon.prodi);
					writeInfo(
						"Kelas / Angkatan",
						`${pemohon.kelas} / ${pemohon.angkatan}`,
					);
				}

				writeInfo("Email", pemohon.email);
				writeInfo("Kategori Kebutuhan", data.kategori_kebutuhan || "-");
				writeInfo("Jenis Kegiatan", getNamaKegiatan(data));
				writeInfo("Tujuan Peminjaman", data.tujuan_peminjaman || "-");
				writeInfo("Tanggal Pinjam", formatTanggalIndonesia(data.tanggal_pinjam));
				writeInfo("Tanggal Kembali", formatTanggalIndonesia(data.tanggal_kembali));

				y += 24;

				// =========================
				// TABEL BARANG
				// =========================
				y = ensureSpace(doc, y, 80, 60);

				doc
					.font("Times-Roman")
					.fontSize(11)
					.text("Adapun barang yang dipinjam adalah sebagai berikut:", 70, y);

				y += 22;

				const tableX = 70;
				const colNo = 35;
				const colBarang = 330;
				const colJumlah = 95;
				const headerHeight = 24;
				const minRowHeight = 24;
				const tableWidth = colNo + colBarang + colJumlah;

				const drawTableHeader = () => {
					doc.font("Times-Bold").fontSize(10);

					doc.rect(tableX, y, colNo, headerHeight).stroke();
					doc.rect(tableX + colNo, y, colBarang, headerHeight).stroke();
					doc
						.rect(tableX + colNo + colBarang, y, colJumlah, headerHeight)
						.stroke();

					doc.text("No", tableX, y + 7, {
						width: colNo,
						align: "center",
					});

					doc.text("Nama Barang", tableX + colNo, y + 7, {
						width: colBarang,
						align: "center",
					});

					doc.text("Jumlah", tableX + colNo + colBarang, y + 7, {
						width: colJumlah,
						align: "center",
					});

					y += headerHeight;
					doc.font("Times-Roman").fontSize(10);
				};

				drawTableHeader();

				if (detailBarang.length === 0) {
					y = ensureSpace(doc, y, minRowHeight, 60);

					doc.rect(tableX, y, tableWidth, minRowHeight).stroke();
					doc.text("Tidak ada data barang", tableX, y + 7, {
						width: tableWidth,
						align: "center",
					});

					y += minRowHeight;
				} else {
					for (const [index, item] of detailBarang.entries()) {
						const namaBarang = item.barang?.nama_barang || "Barang Dihapus";
						const jumlah = Number(item.jumlah_pinjam || item.jumlah || 0);

						doc.font("Times-Roman").fontSize(10);

						const textHeight = doc.heightOfString(namaBarang, {
							width: colBarang - 12,
							align: "left",
						});

						const rowHeight = Math.max(minRowHeight, textHeight + 14);

						if (y + rowHeight > getBottomLimit(doc)) {
							doc.addPage();
							y = 60;
							drawTableHeader();
						}

						doc.rect(tableX, y, colNo, rowHeight).stroke();
						doc.rect(tableX + colNo, y, colBarang, rowHeight).stroke();
						doc
							.rect(tableX + colNo + colBarang, y, colJumlah, rowHeight)
							.stroke();

						doc.text(String(index + 1), tableX, y + 7, {
							width: colNo,
							align: "center",
						});

						doc.text(namaBarang, tableX + colNo + 6, y + 7, {
							width: colBarang - 12,
							align: "left",
						});

						doc.text(`${jumlah} Unit`, tableX + colNo + colBarang, y + 7, {
							width: colJumlah,
							align: "center",
						});

						y += rowHeight;
					}
				}

				y += 22;

				// =========================
				// PENUTUP
				// =========================
				const penutup =
					"Demikian surat peminjaman ini dibuat dengan sebenar-benarnya. Pemohon bertanggung jawab atas penggunaan dan pengembalian barang sesuai dengan waktu yang telah ditentukan.";

				doc.font("Times-Roman").fontSize(11);

				const penutupHeight = doc.heightOfString(penutup, {
					width: 460,
					align: "justify",
					lineGap: 3,
				});

				y = ensureSpace(doc, y, penutupHeight + 20, 60);

				doc.text(penutup, 70, y, {
					width: 460,
					align: "justify",
					lineGap: 3,
				});

				y += penutupHeight + 35;

				// =========================
				// TANDA TANGAN
				// =========================
				const hasDosenPJ = Boolean(
					data.dosen_pj_user_id ||
					data.dosen_penanggung_jawab ||
					data.nip_dosen_pj,
				);

				const signatureBlockHeight = 138;
				const signatureRowGap = 22;

				const neededSignatureHeight = hasDosenPJ
					? 32 + signatureBlockHeight * 2 + signatureRowGap
					: 32 + signatureBlockHeight;

				y = ensureSpace(doc, y, neededSignatureHeight, 70);

				doc
					.font("Times-Roman")
					.fontSize(11)
					.text(`Depok, ${formatTanggalIndonesia(new Date())}`, 370, y, {
						width: 160,
						align: "center",
					});

				const signY = y + 32;

				if (hasDosenPJ) {
					const signWidth = 190;
					const pemohonX = 65;
					const dosenX = 340;

					await drawSignature({
						doc,
						x: pemohonX,
						y: signY,
						width: signWidth,
						title: "Hormat Kami,\nPemohon",
						name: pemohon.nama,
						identityLabel: pemohon.labelIdentitas,
						identityValue: pemohon.identitas,
						ttdUrl: pemohon.ttdDigital,
					});

					await drawSignature({
						doc,
						x: dosenX,
						y: signY,
						width: signWidth,
						title: "Mengetahui,\nDosen Penanggung Jawab",
						name:
							dosenPJ?.pegawai?.nama_lengkap ||
							data.dosen_penanggung_jawab ||
							"................................",
						identityLabel: "NIP",
						identityValue:
							dosenPJ?.pegawai?.nip ||
							data.nip_dosen_pj ||
							"................",
						ttdUrl: dosenPJ?.ttd_digital,
					});

					const kalabY = signY + signatureBlockHeight + signatureRowGap;

					await drawSignature({
						doc,
						x: 202,
						y: kalabY,
						width: 190,
						title: "Menyetujui,\nKepala Laboratorium",
						name:
							kalab?.pegawai?.nama_lengkap ||
							"................................",
						identityLabel: "NIP",
						identityValue:
							kalab?.pegawai?.nip ||
							"................",
						ttdUrl: kalab?.ttd_digital,
					});
				} else {
					const signWidth = 190;
					const pemohonX = 70;
					const kalabX = 335;

					await drawSignature({
						doc,
						x: pemohonX,
						y: signY,
						width: signWidth,
						title: "Hormat Kami,\nPemohon",
						name: pemohon.nama,
						identityLabel: pemohon.labelIdentitas,
						identityValue: pemohon.identitas,
						ttdUrl: pemohon.ttdDigital,
					});

					await drawSignature({
						doc,
						x: kalabX,
						y: signY,
						width: signWidth,
						title: "Menyetujui,\nKepala Laboratorium",
						name:
							kalab?.pegawai?.nama_lengkap ||
							"................................",
						identityLabel: "NIP",
						identityValue:
							kalab?.pegawai?.nip ||
							"................",
						ttdUrl: kalab?.ttd_digital,
					});
				}

				doc.end();
			} catch (error) {
				reject(error);
			}
		};

		buildPdf();
	});

	return pdfPath;
};

module.exports = {
	generateSuratPeminjamanPDF,
};