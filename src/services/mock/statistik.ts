/**
 * Mock statistik data for UC-01.
 * Matches GET /api/statistik response shape.
 */
export const mockStatistik = {
  total_alumni: 2847,
  alumni_bekerja: 2156,
  perusahaan_mitra: 89,
  lowongan_aktif: 42,
  persentase_bekerja: 75.7,
  alumni_per_prodi: [
    { prodi: "Teknik Informatika", jumlah: 645 },
    { prodi: "Manajemen", jumlah: 538 },
    { prodi: "Akuntansi", jumlah: 412 },
    { prodi: "Pendidikan Agama Islam", jumlah: 389 },
    { prodi: "Hukum Ekonomi Syariah", jumlah: 321 },
    { prodi: "PGSD", jumlah: 542 },
  ],
};
