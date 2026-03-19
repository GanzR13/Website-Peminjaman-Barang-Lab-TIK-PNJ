'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dataKelas = [];
    let idCounter = 1;

    const generateClasses = (prefix, maxSemester, suffixes) => {
      for (let semester = 1; semester <= maxSemester; semester++) {
        if (suffixes.length > 0) {
          for (const suffix of suffixes) {
            dataKelas.push({
              id: idCounter++,
              nama_kelas: `${prefix} ${semester}${suffix}`,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        } else {
          dataKelas.push({
            id: idCounter++,
            nama_kelas: `${prefix} ${semester}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    };

    // 1. Program Reguler (Semester 1-8, Kelas A, B, C)
    const regulerProdi = ['TI', 'TMJ', 'TMD'];
    regulerProdi.forEach(prefix => generateClasses(prefix, 8, ['A', 'B', 'C']));

    // 2. Program CCIT (Semester 1-6, Kelas A, B)
    const ccitProdi = ['TI-CCIT', 'TMJ-CCIT', 'TMD-CCIT'];
    ccitProdi.forEach(prefix => generateClasses(prefix, 6, ['A', 'B']));

    // 3. Program MSU (Semester 1-6, Tanpa huruf di belakang)
    const msuProdi = ['TI MSU', 'TMJ-MSU', 'TMD-MSU'];
    msuProdi.forEach(prefix => generateClasses(prefix, 6, []));

    // Eksekusi insert massal ke database
    await queryInterface.bulkInsert('ref_Kelas', dataKelas, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ref_Kelas', null, {});
  }
};