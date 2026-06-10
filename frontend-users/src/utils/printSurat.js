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

const safeImageUrl = (value) => {
	if (!value) return "";

	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
};

const getLocalStorageUser = () => {
	try {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : {};
	} catch (error) {
		console.error("Gagal membaca user localStorage:", error);
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

const buildTtdImage = (url) => {
	if (!url) return `<div class="ttd-space"></div>`;

	return `
        <div class="ttd-image-wrap">
            <img
                src="${safeImageUrl(url)}"
                alt="TTD Digital"
                class="ttd-image"
                onerror="this.style.display='none'"
            />
        </div>
    `;
};

const buildTableRows = (detailBarang = []) => {
	if (!Array.isArray(detailBarang) || detailBarang.length === 0) {
		return `
            <tr>
                <td colspan="3" style="text-align:center; padding: 10px;">Tidak ada data barang</td>
            </tr>
        `;
	}

	return detailBarang
		.map((item, index) => {
			const namaBarang = safeText(item?.barang?.nama_barang, "Barang Dihapus");
			const jumlahPinjam = safeText(item?.jumlah_pinjam || item?.jumlah || 0);

			return `
                <tr>
                    <td style="text-align:center;">${index + 1}</td>
                    <td>${namaBarang}</td>
                    <td style="text-align:center;">${jumlahPinjam} Unit</td>
                </tr>
            `;
		})
		.join("");
};

const getAcaraLabel = (transaksi = {}) => {
	const kategori = String(transaksi.kategori_kebutuhan || "")
		.trim()
		.toLowerCase();

	const jenisKhusus = String(transaksi.jenis_khusus || "")
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
		return transaksi.nama_acara || "Kegiatan Organisasi / Lomba";
	}

	if (jenisKhusus === "pribadi") {
		return "Peminjaman Pribadi";
	}

	return transaksi.jenis_khusus || "Kegiatan Khusus";
};

const getPemohonData = (transaksi = {}, currentUser = {}) => {
	const peminjam = transaksi.peminjam || transaksi.user || {};

	const mahasiswa =
		peminjam.mahasiswa || transaksi.mahasiswa || currentUser.mahasiswa || null;

	const pegawai =
		peminjam.pegawai || transaksi.pegawai || currentUser.pegawai || null;

	const roleName = String(
		currentUser.role_name ||
			currentUser.nama_role ||
			currentUser.role?.nama_role ||
			peminjam.role_name ||
			peminjam.nama_role ||
			peminjam.Role?.nama_role ||
			"",
	).toLowerCase();

	const roleId = Number(
		currentUser.role_id ||
			currentUser.role?.id ||
			peminjam.role_id ||
			peminjam.role?.id ||
			0,
	);

	const isDosen =
		roleName === "dosen" || roleId === 4 || !!currentUser.nip || !!pegawai?.nip;

	const nama = isDosen
		? currentUser.nama_lengkap ||
			currentUser.nama ||
			pegawai?.nama_lengkap ||
			peminjam.nama_lengkap ||
			peminjam.email ||
			"..........................................."
		: currentUser.nama_lengkap ||
			currentUser.nama ||
			mahasiswa?.nama_mahasiswa ||
			peminjam.nama_lengkap ||
			peminjam.email ||
			"...........................................";

	const identitas = isDosen
		? currentUser.nip ||
			currentUser.identitas ||
			pegawai?.nip ||
			transaksi.nip ||
			"........................"
		: currentUser.nim ||
			currentUser.identitas ||
			mahasiswa?.nim ||
			transaksi.nim ||
			"........................";

	const prodi =
		currentUser.prodi ||
		mahasiswa?.prodi?.nama_prodi ||
		mahasiswa?.ref_prodi?.nama_prodi ||
		mahasiswa?.nama_prodi ||
		transaksi.prodi ||
		"-";

	const kelas =
		currentUser.kelas ||
		mahasiswa?.kelas?.nama_kelas ||
		mahasiswa?.ref_kelas?.nama_kelas ||
		mahasiswa?.nama_kelas ||
		transaksi.kelas ||
		"-";

	const angkatan =
		currentUser.angkatan || mahasiswa?.angkatan || transaksi.angkatan || "-";

	const email = currentUser.email || peminjam.email || transaksi.email || "-";

	const noTelepon =
		currentUser.no_telepon ||
		peminjam.no_telepon ||
		transaksi.no_telepon ||
		"-";

	const ttdDigital =
		currentUser.ttd_digital ||
		peminjam.ttd_digital ||
		peminjam.user?.ttd_digital ||
		transaksi.ttd_digital_peminjam ||
		"";

	return {
		isDosen,
		labelIdentitas: isDosen ? "NIP" : "NIM",
		nama,
		identitas,
		prodi,
		kelas,
		angkatan,
		email,
		noTelepon,
		ttdDigital,
	};
};

const getDosenPJData = (transaksi = {}) => {
	const approvedDosenPJ =
		transaksi.approved_dosen_pj ||
		transaksi.dosen_pj_approver ||
		transaksi.dosen_penanggung_jawab_approver ||
		null;

	const hasDosenPJ =
		!!transaksi.dosen_pj_user_id ||
		!!transaksi.dosen_penanggung_jawab ||
		!!approvedDosenPJ;

	if (!hasDosenPJ) {
		return null;
	}

	return {
		nama:
			approvedDosenPJ?.nama_lengkap ||
			approvedDosenPJ?.nama ||
			approvedDosenPJ?.pegawai?.nama_lengkap ||
			transaksi.dosen_penanggung_jawab ||
			"...........................................",
		nip:
			approvedDosenPJ?.nip ||
			approvedDosenPJ?.pegawai?.nip ||
			transaksi.nip_dosen_pj ||
			"........................",
		ttdDigital:
			approvedDosenPJ?.ttd_digital ||
			approvedDosenPJ?.user?.ttd_digital ||
			transaksi.ttd_digital_dosen_pj ||
			"",
	};
};

const getKalabData = (transaksi = {}) => {
	const approvedKalab =
		transaksi.approved_kalab ||
		transaksi.kalab_approver ||
		transaksi.kepala_lab_approver ||
		transaksi.approved_by_kalab ||
		null;

	return {
		nama:
			approvedKalab?.nama_lengkap ||
			approvedKalab?.nama ||
			approvedKalab?.pegawai?.nama_lengkap ||
			transaksi.nama_kalab_approver ||
			"...........................................",
		nip:
			approvedKalab?.nip ||
			approvedKalab?.pegawai?.nip ||
			transaksi.nip_kalab_approver ||
			"........................",
		ttdDigital:
			approvedKalab?.ttd_digital ||
			approvedKalab?.user?.ttd_digital ||
			transaksi.ttd_digital_kalab ||
			"",
	};
};

const buildPemohonRows = (pemohon) => {
	if (pemohon.isDosen) {
		return `
            <tr>
                <td class="label">Nama Lengkap</td>
                <td>: ${safeText(pemohon.nama)}</td>
            </tr>
            <tr>
                <td class="label">NIP</td>
                <td>: <>${safeText(pemohon.identitas)}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td>: ${safeText(pemohon.email)}</td>
            </tr>
            <tr>
                <td class="label">No. Telepon</td>
                <td>: ${safeText(pemohon.noTelepon)}</td>
            </tr>
        `;
	}

	return `
        <tr>
            <td class="label">Nama Lengkap</td>
            <td>: ${safeText(pemohon.nama)}</td>
        </tr>
        <tr>
            <td class="label">NIM</td>
            <td>: ${safeText(pemohon.identitas)}</td>
        </tr>
        <tr>
            <td class="label">Program Studi</td>
            <td>: ${safeText(pemohon.prodi)}</td>
        </tr>
        <tr>
            <td class="label">Kelas / Angkatan</td>
            <td>: ${safeText(pemohon.kelas)} / ${safeText(pemohon.angkatan)}</td>
        </tr>
        <tr>
            <td class="label">Email</td>
            <td>: ${safeText(pemohon.email)}</td>
        </tr>
        <tr>
            <td class="label">No. Telepon</td>
            <td>: ${safeText(pemohon.noTelepon)}</td>
        </tr>
    `;
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
                    background: #525659; /* Warna background khas PDF viewer */
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e5e7eb;
                    border-top-color: #2563eb;
                    border-radius: 999px;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 16px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                p {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div>
                <div class="spinner"></div>
                <p>Menyiapkan preview surat...</p>
            </div>
        </body>
        </html>
    `);

	printWindow.document.close();

	const currentUser = getLocalStorageUser();
	const pemohon = getPemohonData(transaksi, currentUser);
	const dosenPJ = getDosenPJData(transaksi);
	const kalab = getKalabData(transaksi);

	const tanggalPinjam = formatTanggalIndonesia(transaksi.tanggal_pinjam);
	const tanggalKembali = formatTanggalIndonesia(transaksi.tanggal_kembali);
	const tanggalSurat = formatTanggalIndonesia(new Date());
	const kodePeminjaman = transaksi.kode_peminjaman || "-";
	const acaraLabel = getAcaraLabel(transaksi);
	const tujuanPeminjaman = transaksi.tujuan_peminjaman || "-";

	const detailBarang =
		transaksi.detail_barang ||
		transaksi.DetailPeminjamen ||
		transaksi.detail_peminjaman ||
		[];

	const dosenPJSection = dosenPJ
		? `
        <div class="ttd-box">
            <p>Mengetahui,<br><strong>Dosen Penanggung Jawab</strong></p>
            ${buildTtdImage(dosenPJ.ttdDigital)}
            <p>
                <u>${safeText(dosenPJ.nama)}</u><br>
                NIP. ${safeText(dosenPJ.nip)}
            </p>
        </div>
    `
		: "";

	// Kalau ada dosenPJ → Kepala Lab pakai class center
	// Kalau tidak ada dosenPJ → Kepala Lab biasa sejajar
	const kalabClass = dosenPJ ? "ttd-box ttd-box-center" : "ttd-box";

	const htmlContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Preview Surat Peminjaman</title>
            <style>
                /* Pengaturan Default Halaman Cetak (Print Margin 1cm di Semua Sisi) */
                @page {
                    size: A4 portrait;
                    margin: 2cm; 
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    font-family: "Times New Roman", Times, serif;
                    color: #000;
                }

                /* Tampilan Latar Belakang di Mode Preview (Layar Monitor) */
                body {
                    background: #525659; /* Warna gelap khas PDF Viewer */
                    font-size: 12pt;
                    line-height: 1.5; 
                    padding: 2rem 0; /* Memberi jarak agar kertas tidak menempel di tepi atas/bawah layar */
                }

                /* Kertas HVS di Layar (A4) */
                .container {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    /* Simulasi margin cetak 2cm di layar Preview */
                    padding: 2cm; 
                    background: #fff;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                }

                /* Kop Surat */
                .header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    border-bottom: 3px solid #000; /* Garis kop tebal */
                    padding-bottom: 12px;
                    margin-bottom: 24px;
                }

                .logo {
                    width: 90px;
                    height: 90px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                .header-text {
                    flex: 1;
                    text-align: center;
                }

                .header-text h1,
                .header-text h2,
                .header-text p {
                    margin: 0;
                    line-height: 1.2;
                }

                .header-text h1 {
                    font-size: 14pt;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .header-text h2 {
                    font-size: 13pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    margin-top: 4px;
                }

                .header-text p {
                    font-size: 10.5pt;
                    margin-top: 4px;
                }

                /* Judul Surat */
                .title {
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                .title h3 {
                    display: inline-block;
                    margin: 0;
                    font-size: 13pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-decoration: underline;
                }

                .title p {
                    margin: 6px 0 0;
                    font-size: 11.5pt;
                }

                /* Paragraf Utama */
                .paragraph {
                    text-align: justify;
                    margin: 12px 0;
                    text-indent: 10mm; /* Baris pertama menjorok ke dalam */
                }

                /* Tabel Biodata Pemohon */
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0 20px;
                }

                .info-table td {
                    vertical-align: top;
                    padding: 4px 0;
                }

                .info-table .label {
                    width: 170px;
                    
                }

                /* Tabel Barang */
                .barang-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16px 0 24px;
                }

                .barang-table th,
                .barang-table td {
                    border: 1px solid #000;
                    padding: 8px 10px;
                    vertical-align: middle;
                }

                .barang-table th {
                    text-align: center;
                    font-weight: bold;
                    background: #f9fafb;
                }

                /* Bagian Tanda Tangan */
                .footer-date {
                    text-align: right;
                    margin-top: 24px;
                    margin-bottom: 12px;
                }

                .signature-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 12px;
					margin-top: 10px;
					text-align: center;
					align-items: start;
				}

				.ttd-box-center {
					grid-column: 1 / -1;
					width: 50%;
					margin: 0 auto;
					text-align: center;
				}

                .ttd-box p {
                    margin: 0;
                    font-size: 11pt;
                    line-height: 1.3;
                }

                .ttd-space {
                    height: 60px;
                }

                .ttd-image-wrap {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 8px 0;
                }

                .ttd-image {
                    max-height: 55px;
                    max-width: 140px;
                    object-fit: contain;
                }

                /* Tombol Print Mengambang (Sembunyikan saat dicetak) */
                .print-actions {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    display: flex;
                    gap: 8px;
                    z-index: 9999;
                }

                .print-actions button {
                    border: none;
                    border-radius: 6px;
                    padding: 10px 16px;
                    font-family: Arial, sans-serif;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    transition: opacity 0.2s;
                }
                
                .print-actions button:hover {
                    opacity: 0.9;
                }

                .btn-print {
                    background: #2563eb;
                    color: #fff;
                }

                .btn-close {
                    background: #ef4444;
                    color: #fff;
                }

                /* ====================================================
                   PERILAKU KETIKA MODE CETAK (CTRL+P / CMND+P) AKTIF
                   ==================================================== */
                @media print {
                    body {
                        background: #fff;
                        padding: 0; /* Hapus padding luar di mode cetak */
                    }

                    .print-actions {
                        display: none !important; /* Hilangkan tombol di kertas print */
                    }

                    .container {
                        width: 100%;
                        min-height: auto;
                        margin: 0;
                        /* Padding di 0-kan, karena margin kertas sudah dihandle oleh @page di atas */
                        padding: 0; 
                        box-shadow: none;
                    }

                    /* Hindari elemen terpotong aneh di antara halaman */
                    .header,
                    .title,
                    .info-table,
                    .barang-table,
                    .signature-grid,
                    .ttd-box {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            </style>
        </head>

        <body>
            <div class="print-actions">
                <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
                <button class="btn-close" onclick="window.close()">Tutup</button>
            </div>

            <div class="container">
                <div class="header">
                    <img src="${safeImageUrl(logoPnj)}" class="logo" alt="Logo PNJ" />
                    <div class="header-text">
                        <h1>Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</h1>
                        <h2>Politeknik Negeri Jakarta</h2>
                        <h2>Jurusan Teknik Informatika dan Komputer</h2>
                        <p>Jl. Prof. Dr. G.A. Siwabessy, Kampus UI Depok 16425</p>
                        <p>Telepon: (021) 7270036, Fax: (021) 7270034</p>
                    </div>
                </div>

                <div class="title">
                    <h3>Surat Peminjaman Barang Laboratorium</h3>
                    <p>Kode Peminjaman: ${safeText(kodePeminjaman)}</p>
                </div>

                <p class="paragraph">
                    Yang bertanda tangan di bawah ini mengajukan permohonan peminjaman barang
                    Laboratorium PLP TIK Jurusan Teknik Informatika dan Komputer Politeknik Negeri Jakarta
                    untuk keperluan berikut:
                </p>

                <table class="info-table">
                    ${buildPemohonRows(pemohon)}
                    <tr>
                        <td class="label">Kategori Kebutuhan</td>
                        <td>: ${safeText(transaksi.kategori_kebutuhan)}</td>
                    </tr>
                    <tr>
                        <td class="label">Jenis Kegiatan</td>
                        <td>: ${safeText(acaraLabel)}</td>
                    </tr>
                    <tr>
                        <td class="label">Tujuan Peminjaman</td>
                        <td>: ${safeText(tujuanPeminjaman)}</td>
                    </tr>
                    <tr>
                        <td class="label">Tanggal Pinjam</td>
                        <td>: ${safeText(tanggalPinjam)}</td>
                    </tr>
                    <tr>
                        <td class="label">Tanggal Kembali</td>
                        <td>: ${safeText(tanggalKembali)}</td>
                    </tr>
                </table>

                <p class="paragraph">
                    Adapun barang yang dipinjam adalah sebagai berikut:
                </p>

                <table class="barang-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">No</th>
                            <th>Nama Barang</th>
                            <th style="width: 130px;">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${buildTableRows(detailBarang)}
                    </tbody>
                </table>

                <p class="paragraph">
                    Demikian surat peminjaman ini dibuat dengan sebenar-benarnya. Pemohon bertanggung jawab
                    atas penggunaan dan pengembalian barang sesuai dengan waktu yang telah ditentukan.
                </p>

                <div class="footer-date">
                    Depok, ${safeText(tanggalSurat)}
                </div>

                <div class="signature-grid">
					<div class="ttd-box">
						<p>Hormat Kami,<br><strong>Pemohon</strong></p>
						${buildTtdImage(pemohon.ttdDigital)}
						<p>
							<u>${safeText(pemohon.nama)}</u><br>
							${safeText(pemohon.labelIdentitas)}. ${safeText(pemohon.identitas)}
						</p>
					</div>

					${dosenPJSection}

					<div class="${kalabClass}">
						<p>Menyetujui,<br><strong>Kepala Laboratorium</strong></p>
						${buildTtdImage(kalab.ttdDigital)}
						<p>
							<u>${safeText(kalab.nama)}</u><br>
							NIP. ${safeText(kalab.nip)}
						</p>
					</div>
				</div>
            </div>
        </body>
        </html>
    `;

	printWindow.document.open();
	printWindow.document.write(htmlContent);
	printWindow.document.close();
};

export default generateSuratPDF;
