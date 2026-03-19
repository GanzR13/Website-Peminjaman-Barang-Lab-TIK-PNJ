const { ref_Prodi, ref_Kelas } = require("../models");

exports.getAllProdi = async (req, res) => {
  try {
    const data = await ref_Prodi.findAll({
      order: [['nama_prodi', 'ASC']]
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data prodi" });
  }
};

exports.getAllKelas = async (req, res) => {
  try {
    const data = await ref_Kelas.findAll({
      order: [['nama_kelas', 'ASC']]
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kelas" });
  }
};