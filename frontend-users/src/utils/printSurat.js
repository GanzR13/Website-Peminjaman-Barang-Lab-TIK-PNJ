import logoPnj from "../assets/logo_pnj.png";

export const generateSuratPDF = (transaksi, showAlert) => {
	const printWindow = window.open("", "_blank", "width=900,height=1000");

	if (!printWindow) {
		if (showAlert)
			showAlert(
				"Browser Anda memblokir Pop-up. Izinkan pop-up untuk mencetak surat.",
				"warning",
			);
		return;
	}

	// Tampilkan loading sebentar selagi menyiapkan data
	printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Menyiapkan Dokumen...</title>
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif; background: #fff; }
                .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
        </head>
        <body>
            <div style="text-align: center; color: #333;">
                <div class="spinner"></div>
                <p>Menyiapkan Dokumen A4...</p>
            </div>
        </body>
        </html>
    `);

	const absoluteLogoUrl = new URL(logoPnj, window.location.origin).href;

	// Ambil data User dari localStorage
	const userStr = localStorage.getItem("user");
	const currentUser = userStr ? JSON.parse(userStr) : {};

	// Mapping Data Mahasiswa
	const nama_mahasiswa =
		currentUser.nama ||
		currentUser.nama_lengkap ||
		currentUser.username ||
		"Peminjam";
	const nim_mahasiswa =
		currentUser.identitas ||
		currentUser.nim ||
		currentUser.nomor_induk ||
		currentUser.nip ||
		"-";

	// TAMBAHAN: Prodi dan Kelas
	const prodi_mahasiswa = currentUser.prodi || currentUser.program_studi || "-";
	const kelas_mahasiswa = currentUser.kelas || "-";

	// Data Kontak
	const email_mahasiswa = currentUser.email || "-";
	const telepon_mahasiswa =
		currentUser.telepon || currentUser.no_telepon || "-";

	// Ambil spesifikasi dari transaksi untuk Jenis Kegiatan
	let acara = "";
	const kategori = String(transaksi.kategori_kebutuhan || "")
		.trim()
		.toLowerCase();
	const jenisKhusus = String(transaksi.jenis_khusus || "")
		.trim()
		.toLowerCase();

	if (kategori === "khusus") {
		if (jenisKhusus === "pbl") {
			acara = "Project Based Learning (PBL)";
		} else if (jenisKhusus === "skripsi" || jenisKhusus === "tugas akhir") {
			acara = "Tugas Akhir / Skripsi";
		} else if (jenisKhusus === "organisasi") {
			acara = transaksi.nama_acara || "Kegiatan Organisasi / Lomba";
		} else {
			acara = transaksi.jenis_khusus || "Kegiatan Khusus";
		}
	} else {
		acara = "Praktikum Reguler (Harian)";
	}

	const dosenPJ =
		transaksi.dosen_penanggung_jawab ||
		"...........................................";
	const dosenPJ_NIP = transaksi.nip_dosen_pj || "........................";
	const penyelenggara = transaksi.organisasi_penyelenggara || "";

	// Bangun baris tabel daftar barang
	let tableRows = "";
	if (transaksi.detail_barang && transaksi.detail_barang.length > 0) {
		transaksi.detail_barang.forEach((item, index) => {
			tableRows += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${item.barang?.nama_barang || "Barang Dihapus"}</td>
                    <td style="text-align: center;">${item.jumlah_pinjam} Unit</td>
                    <td></td>
                </tr>
            `;
		});
	} else {
		tableRows =
			'<tr><td colspan="4" style="text-align: center;">Tidak ada data barang</td></tr>';
	}

	// Format Tanggal
	const today = new Date().toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const tglPinjam = transaksi.tanggal_pinjam
		? new Date(transaksi.tanggal_pinjam).toLocaleDateString("id-ID")
		: ".......";
	const tglKembali = transaksi.tanggal_kembali
		? new Date(transaksi.tanggal_kembali).toLocaleDateString("id-ID")
		: ".......";

	// Ambil Nomor Surat
	const noSurat =
		transaksi.nomor_surat || `_____ / LAB-TI / ${new Date().getFullYear()}`;

	// Template HTML Surat (Murni Dokumen, Kertas A4)
	const printHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Surat Peminjaman #${transaksi.antrian || transaksi.id}</title>
        <style>
            /* Mengatur Ukuran Kertas A4 secara spesifik untuk Printer/PDF */
            @page { 
                size: A4; 
                margin: 20mm; 
            }
            
            body { 
                font-family: 'Times New Roman', Times, serif; 
                font-size: 12pt; 
                line-height: 1.5; 
                color: #000;
                background-color: #fff;
                margin: 0;
                padding: 20mm; 
                max-width: 210mm;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
            }

            .paper {
                background: white; 
                width: 100%; 
                min-height: 257mm; 
                box-sizing: border-box;
            }

            .header { 
                display: flex; align-items: center; border-bottom: 3px solid #000; 
                padding-bottom: 10px; margin-bottom: 25px; 
            }
            .header-logo { width: 100px; height: auto; margin-right: 20px; }
            .header-text { flex: 1; text-align: center; }
            .header-text h1 { margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: normal; }
            .header-text h2 { margin: 2px 0; font-size: 16pt; text-transform: uppercase; font-weight: bold; }
            .header-text h3 { margin: 2px 0; font-size: 14pt; text-transform: uppercase; font-weight: bold; }
            .header-text p { margin: 2px 0; font-size: 10pt; }
            
            .nomor-surat { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .content { text-align: justify; }
            
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background-color: #f2f2f2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            
            .ttd-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .ttd-box { text-align: center; width: 45%; }
            .ttd-space { height: 80px; }

            @media print {
                body {
                    padding: 0;
                    max-width: none;
                }
            }
        </style>
    </head>
    <body onload="setTimeout(() => window.print(), 500)">
        <div class="paper">
            <div class="header">
                <img src="${absoluteLogoUrl}" alt="Logo PNJ" class="header-logo" onerror="this.style.display='none'" />
                <div class="header-text">
                    <h1>KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h1>
                    <h2>POLITEKNIK NEGERI JAKARTA</h2>
                    <h3>JURUSAN TEKNIK INFORMATIKA DAN KOMPUTER</h3>
                    <p>Jl. Prof. DR. G.A. Siwabessy, Kukusan, Kecamatan Beji, Kota Depok, Jawa Barat 16425<br>
                    Telp: (021) 7270036 Fax: (021) 7270034</p>
                    <p>Laman: https://pnj.ac.id, email: tik@pnj.ac.id</p>
                </div>
            </div>

            <div class="nomor-surat">
                <div>
                    Nomor : ${noSurat}<br>
                    Lampiran : -<br>
                    Hal : <b>Permohonan Peminjaman Alat Laboratorium</b>
                </div>
                <div>Kota Depok, ${today}</div>
            </div>

            <div class="content">
                <p>Yth. Kepala Laboratorium Teknik Informatika<br>Politeknik Negeri Jakarta<br>di Tempat</p>
                
                <p>Dengan hormat,</p>
                <p>Sehubungan dengan pelaksanaan kegiatan <b>${acara}</b> 
                dengan judul/tujuan <i>"${transaksi.tujuan_peminjaman || "......................"}"</i>, 
                yang rencananya akan dilaksanakan pada tanggal ${tglPinjam} s.d. ${tglKembali}, 
                maka saya yang bertanda tangan di bawah ini:</p>

                <table style="border: none; margin: 10px 0; width: 100%;">
                    <tr style="border: none;">
                        <td style="border: none; width: 25%; padding: 3px;">Nama Lengkap</td>
                        <td style="border: none; padding: 3px;">: <b>${nama_mahasiswa}</b></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">NIM</td>
                        <td style="border: none; padding: 3px;">: <b>${nim_mahasiswa}</b></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">Program Studi</td>
                        <td style="border: none; padding: 3px;">: <b>${prodi_mahasiswa}</b></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">Kelas</td>
                        <td style="border: none; padding: 3px;">: <b>${kelas_mahasiswa}</b></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">Email</td>
                        <td style="border: none; padding: 3px;">: <b>${email_mahasiswa}</b></td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">No. Telepon</td>
                        <td style="border: none; padding: 3px;">: <b>${telepon_mahasiswa}</b></td>
                    </tr>
                    ${
											penyelenggara
												? `
                    <tr style="border: none;">
                        <td style="border: none; padding: 3px;">Penyelenggara</td>
                        <td style="border: none; padding: 3px;">: <b>${penyelenggara}</b></td>
                    </tr>`
												: ""
										}
                </table>

                <p>Bermaksud untuk meminjam beberapa peralatan laboratorium dengan rincian sebagai berikut:</p>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 50%;">Nama Alat / Spesifikasi</th>
                            <th style="width: 20%;">Jumlah</th>
                            <th style="width: 25%;">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>

                <p>Demikian surat permohonan ini kami sampaikan. Kami berkomitmen untuk menjaga dan merawat alat 
                tersebut selama masa peminjaman. Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.</p>
            </div>

            <div class="ttd-section">
                <div class="ttd-box">
                    <p>Mengetahui,<br>Dosen Penanggung Jawab</p>
                    <div class="ttd-space"></div>
                    <p><u><b>${dosenPJ}</b></u><br>NIP. ${dosenPJ_NIP}</p>
                </div>
                <div class="ttd-box">
                    <p>Hormat Kami,<br>Pemohon</p>
                    <div class="ttd-space"></div>
                    <p><u><b>${nama_mahasiswa}</b></u><br>NIM. ${nim_mahasiswa}</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 50px;">
                <p>Menyetujui,<br>Kepala Laboratorium</p>
                <div class="ttd-space"></div>
                <p><u><b>Iik Muhamad Malik Matin , S.Kom., M.T.</b></u><br>NIP. 199408202022031009</p>
            </div>
        </div>
    </body>
    </html>
    `;

	printWindow.document.open();
	printWindow.document.write(printHtml);
	printWindow.document.close();
};
