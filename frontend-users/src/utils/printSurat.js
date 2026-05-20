import logoPnj from "../assets/logo_pnj.png";

const safeText = (value, fallback = "-") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
};

const getLocalStorageUser = () => {
	try {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : {};
	} catch (error) {
		console.error("Gagal membaca data user dari localStorage:", error);
		return {};
	}
};

const parseLocalDate = (dateValue) => {
	if (!dateValue) return null;

	if (dateValue instanceof Date) {
		return Number.isNaN(dateValue.getTime()) ? null : dateValue;
	}

	const dateString = String(dateValue);
	const dateOnlyMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

	if (dateOnlyMatch) {
		const [, year, month, day] = dateOnlyMatch;
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	const parsed = new Date(dateString);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTanggalIndonesia = (dateValue, fallback = ".......") => {
	const date = parseLocalDate(dateValue);

	if (!date) return fallback;

	return date.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const buildTableRows = (detailBarang = []) => {
	if (!Array.isArray(detailBarang) || detailBarang.length === 0) {
		return `
			<tr>
				<td colspan="4" style="text-align: center;">Tidak ada data barang</td>
			</tr>
		`;
	}

	return detailBarang
		.map((item, index) => {
			const namaBarang = safeText(item?.barang?.nama_barang, "Barang Dihapus");
			const jumlahPinjam = safeText(item?.jumlah_pinjam, "0");

			return `
				<tr>
					<td style="text-align: center;">${index + 1}</td>
					<td>${namaBarang}</td>
					<td style="text-align: center;">${jumlahPinjam} Unit</td>
					<td></td>
				</tr>
			`;
		})
		.join("");
};

const getAcaraLabel = (transaksi) => {
	const kategori = String(transaksi?.kategori_kebutuhan || "")
		.trim()
		.toLowerCase();

	const jenisKhusus = String(transaksi?.jenis_khusus || "")
		.trim()
		.toLowerCase();

	if (kategori !== "khusus") {
		return "Praktikum Reguler (Harian)";
	}

	if (jenisKhusus === "pbl") {
		return "Project Based Learning (PBL)";
	}

	if (jenisKhusus === "skripsi" || jenisKhusus === "tugas akhir") {
		return "Tugas Akhir / Skripsi";
	}

	if (jenisKhusus === "organisasi") {
		return transaksi?.nama_acara || "Kegiatan Organisasi / Lomba";
	}

	return transaksi?.jenis_khusus || "Kegiatan Khusus";
};

export const generateSuratPDF = (transaksi = {}, showAlert) => {
	const printWindow = window.open("", "_blank", "width=1000,height=1000");

	if (!printWindow) {
		if (showAlert) {
			showAlert(
				"Browser Anda memblokir pop-up. Izinkan pop-up untuk melihat preview surat.",
				"warning",
			);
		}
		return;
	}

	printWindow.document.write(`
		<!DOCTYPE html>
		<html lang="id">
		<head>
			<meta charset="UTF-8">
			<title>Menyiapkan Preview Surat...</title>
			<style>
				body {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100vh;
					margin: 0;
					font-family: Arial, sans-serif;
					background: #fff;
				}

				.spinner {
					width: 40px;
					height: 40px;
					border: 4px solid #f3f3f3;
					border-top: 4px solid #2563eb;
					border-radius: 50%;
					animation: spin 0.8s linear infinite;
					margin: 0 auto 16px;
				}

				@keyframes spin {
					to {
						transform: rotate(360deg);
					}
				}
			</style>
		</head>
		<body>
			<div style="text-align: center; color: #333;">
				<div class="spinner"></div>
				<p>Menyiapkan preview surat A4...</p>
			</div>
		</body>
		</html>
	`);

	const absoluteLogoUrl = new URL(logoPnj, window.location.origin).href;
	const currentUser = getLocalStorageUser();

	const namaMahasiswa =
		currentUser.nama ||
		currentUser.nama_lengkap ||
		currentUser.username ||
		transaksi.nama_peminjam ||
		"Peminjam";

	const nimMahasiswa =
		currentUser.identitas ||
		currentUser.nim ||
		currentUser.nomor_induk ||
		currentUser.nip ||
		transaksi.nim_peminjam ||
		"-";

	const prodiMahasiswa =
		currentUser.prodi ||
		currentUser.program_studi ||
		transaksi.prodi_mahasiswa ||
		"-";

	const kelasMahasiswa =
		currentUser.kelas ||
		transaksi.kelas_mahasiswa ||
		"-";

	const emailMahasiswa =
		currentUser.email ||
		transaksi.email_peminjam ||
		"-";

	const teleponMahasiswa =
		currentUser.telepon ||
		currentUser.no_telepon ||
		transaksi.telepon_peminjam ||
		"-";

	const acara = getAcaraLabel(transaksi);

	const dosenPJ =
		transaksi.dosen_penanggung_jawab ||
		"...........................................";

	const dosenPJNip =
		transaksi.nip_dosen_pj ||
		"........................";

	const penyelenggara =
		transaksi.organisasi_penyelenggara ||
		"";

	const today = formatTanggalIndonesia(new Date());
	const tglPinjam = formatTanggalIndonesia(transaksi.tanggal_pinjam);
	const tglKembali = formatTanggalIndonesia(transaksi.tanggal_kembali);

	const noSurat =
		transaksi.nomor_surat ||
		`_____ / LAB-TI / ${new Date().getFullYear()}`;

	const tableRows = buildTableRows(transaksi.detail_barang);

	const printHtml = `
		<!DOCTYPE html>
		<html lang="id">
		<head>
			<meta charset="UTF-8">
			<title>Surat Peminjaman_${safeText(transaksi.antrian || transaksi.id, "-")}</title>

			<style>
				@page {
					size: A4;
					margin: 20mm;
				}

				* {
					box-sizing: border-box;
				}

				html,
				body {
					margin: 0;
					padding: 0;
					background: #e2e8f0;
					color: #000;
				}

				body {
					font-family: Arial, sans-serif;
				}

				.toolbar {
					position: sticky;
					top: 0;
					z-index: 999;
					background: #ffffff;
					border-bottom: 1px solid #e2e8f0;
					padding: 12px 18px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
				}

				.toolbar-title {
					display: flex;
					flex-direction: column;
					gap: 2px;
				}

				.toolbar-title strong {
					font-size: 14px;
					color: #0f172a;
				}

				.toolbar-title span {
					font-size: 12px;
					color: #64748b;
				}

				.toolbar-actions {
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.toolbar button {
					border: none;
					border-radius: 10px;
					font-weight: 800;
					padding: 10px 14px;
					cursor: pointer;
				}

				.btn-print {
					background: #2563eb;
					color: white;
				}

				.btn-close {
					background: #f1f5f9;
					color: #475569;
				}

				.preview-area {
					min-height: calc(100vh - 64px);
					padding: 24px;
					display: flex;
					justify-content: center;
					align-items: flex-start;
				}

				.paper {
					width: 210mm;
					min-height: 297mm;
					background: white;
					padding: 20mm;
					font-family: "Times New Roman", Times, serif;
					font-size: 12pt;
					line-height: 1.5;
					box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
				}

				.header {
					display: flex;
					align-items: center;
					border-bottom: 3px solid #000;
					padding-bottom: 10px;
					margin-bottom: 25px;
				}

				.header-logo {
					width: 24mm;
					height: auto;
					margin-right: 10mm;
                    margin-left: 10mm;
				}

				.header-text {
					flex: 1;
					text-align: center;
				}

				.header-text h1 {
					margin: 0;
					font-size: 10pt;
					text-transform: uppercase;
					font-weight: normal;
				}

				.header-text h2 {
					margin: 2px 0;
					font-size: 14pt;
					text-transform: uppercase;
					font-weight: bold;
				}

				.header-text h3 {
					margin: 2px 0;
					font-size: 11pt;
					text-transform: uppercase;
					font-weight: bold;
				}

				.header-text p {
					margin: 2px 0;
					font-size: 8.5pt;
				}

				.nomor-surat {
					display: flex;
					justify-content: space-between;
					gap: 24px;
					margin-bottom: 20px;
				}

				.nomor-surat-left {
					flex: 1;
				}

				.nomor-surat-right {
					white-space: nowrap;
					text-align: right;
				}

				.content {
					text-align: justify;
				}

				table {
					width: 100%;
					border-collapse: collapse;
					margin: 18px 0;
				}

				th,
				td {
					border: 1px solid #000;
					padding: 8px;
					vertical-align: top;
				}

				th {
					background-color: #f2f2f2;
					-webkit-print-color-adjust: exact;
					print-color-adjust: exact;
					text-align: center;
				}

				.identity-table {
					border: none;
					margin: 10px 0;
					width: 100%;
				}

				.identity-table td {
					border: none;
					padding: 3px;
				}

				.identity-table .label {
					width: 25%;
					white-space: nowrap;
				}

				.ttd-section {
					display: flex;
					justify-content: space-between;
					gap: 32px;
					margin-top: 40px;
					page-break-inside: avoid;
				}

				.ttd-box {
					text-align: center;
					width: 45%;
				}

				.ttd-space {
					height: 72px;
				}

				.kalab-section {
					text-align: center;
					margin-top: 45px;
					page-break-inside: avoid;
				}

				@media print {
					html,
					body {
						background: #fff;
					}

					.toolbar {
						display: none;
					}

					.preview-area {
						display: block;
						padding: 0;
						min-height: auto;
					}

					.paper {
						width: auto;
						min-height: auto;
						padding: 0;
						box-shadow: none;
					}
				}

				@media screen and (max-width: 900px) {
					.preview-area {
						justify-content: flex-start;
						overflow-x: auto;
					}

					.paper {
						transform: scale(0.75);
						transform-origin: top left;
					}
				}
			</style>
		</head>

		<body>
			<div class="toolbar">
				<div class="toolbar-title">
					<strong>Preview Surat Peminjaman</strong>
					<span>Periksa surat, lalu klik Cetak / Simpan PDF.</span>
				</div>

				<div class="toolbar-actions">
					<button class="btn-close" onclick="window.close()">Tutup</button>
					<button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
				</div>
			</div>

			<div class="preview-area">
				<div class="paper">
					<div class="header">
						<div class="header-logo-wrap">
                            <img
                                src="${absoluteLogoUrl}"
                                alt="Logo PNJ"
                                class="header-logo"
                                onerror="this.style.display='none'"
                            />
                        </div>

						<div class="header-text">
							<h1>KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
							<h2>POLITEKNIK NEGERI JAKARTA</h2>
							<h3>JURUSAN TEKNIK INFORMATIKA DAN KOMPUTER</h3>
							<p>
								Jl. Prof. DR. G.A. Siwabessy, Kukusan, Kecamatan Beji,
								Kota Depok, Jawa Barat 16425<br>
								Telp: (021) 7270036 Fax: (021) 7270034
							</p>
							<p>Laman: https://pnj.ac.id, email: tik@pnj.ac.id</p>
						</div>
					</div>

					<div class="nomor-surat">
						<div class="nomor-surat-left">
							Nomor : ${safeText(noSurat)}<br>
							Lampiran : -<br>
							Hal : <b>Permohonan Peminjaman Alat Laboratorium</b>
						</div>

						<div class="nomor-surat-right">
							Kota Depok, ${safeText(today)}
						</div>
					</div>

					<div class="content">
						<p>
							Yth. Kepala Laboratorium Teknik Informatika<br>
							Politeknik Negeri Jakarta<br>
							di Tempat
						</p>

						<p>Dengan hormat,</p>

						<p>
							Sehubungan dengan pelaksanaan kegiatan <b>${safeText(acara)}</b>
							dengan judul/tujuan <i>"${safeText(transaksi.tujuan_peminjaman, "......................")}"</i>,
							yang rencananya akan dilaksanakan pada tanggal ${safeText(tglPinjam)}
							s.d. ${safeText(tglKembali)}, maka saya yang bertanda tangan di bawah ini:
						</p>

						<table class="identity-table">
							<tr>
								<td class="label">Nama Lengkap</td>
								<td>: <b>${safeText(namaMahasiswa)}</b></td>
							</tr>
							<tr>
								<td class="label">NIM</td>
								<td>: <b>${safeText(nimMahasiswa)}</b></td>
							</tr>
							<tr>
								<td class="label">Program Studi</td>
								<td>: <b>${safeText(prodiMahasiswa)}</b></td>
							</tr>
							<tr>
								<td class="label">Kelas</td>
								<td>: <b>${safeText(kelasMahasiswa)}</b></td>
							</tr>
							<tr>
								<td class="label">Email</td>
								<td>: <b>${safeText(emailMahasiswa)}</b></td>
							</tr>
							<tr>
								<td class="label">No. Telepon</td>
								<td>: <b>${safeText(teleponMahasiswa)}</b></td>
							</tr>
							${
								penyelenggara
									? `
									<tr>
										<td class="label">Penyelenggara</td>
										<td>: <b>${safeText(penyelenggara)}</b></td>
									</tr>
								`
									: ""
							}
						</table>

						<p>
							Bermaksud untuk meminjam beberapa peralatan laboratorium dengan rincian sebagai berikut:
						</p>

						<table>
							<thead>
								<tr>
									<th style="width: 5%;">No</th>
									<th style="width: 50%;">Nama Alat / Spesifikasi</th>
									<th style="width: 20%;">Jumlah</th>
									<th style="width: 25%;">Keterangan</th>
								</tr>
							</thead>

							<tbody>
								${tableRows}
							</tbody>
						</table>

						<p>
							Demikian surat permohonan ini kami sampaikan. Kami berkomitmen
							untuk menjaga dan merawat alat tersebut selama masa peminjaman.
							Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.
						</p>
					</div>

					<div class="ttd-section">
						<div class="ttd-box">
							<p>Mengetahui,<br>Dosen Penanggung Jawab</p>
							<div class="ttd-space"></div>
							<p>
								<u><b>${safeText(dosenPJ)}</b></u><br>
								NIP. ${safeText(dosenPJNip)}
							</p>
						</div>

						<div class="ttd-box">
							<p>Hormat Kami,<br>Pemohon</p>
							<div class="ttd-space"></div>
							<p>
								<u><b>${safeText(namaMahasiswa)}</b></u><br>
								NIM. ${safeText(nimMahasiswa)}
							</p>
						</div>
					</div>

					<div class="kalab-section">
						<p>Menyetujui,<br>Kepala Laboratorium</p>
						<div class="ttd-space"></div>
						<p>
							<u><b>Iik Muhamad Malik Matin, S.Kom., M.T.</b></u><br>
							NIP. 199408202022031009
						</p>
					</div>
				</div>
			</div>
		</body>
		</html>
	`;

	printWindow.document.open();
	printWindow.document.write(printHtml);
	printWindow.document.close();
};