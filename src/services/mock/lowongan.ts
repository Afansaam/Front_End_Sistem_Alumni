/**
 * Mock lowongan data for UC-03.
 * Matches GET /api/lowongan response shape.
 */
export interface Lowongan {
  id: number;
  judul: string;
  perusahaan: string;
  lokasi: string;
  tipe: "fulltime" | "contract" | "internship" | "remote";
  deskripsi: string;
  link_eksternal: string;
  mitra_id: number;
  status: "aktif" | "nonaktif";
  created_at: string;
  fakultas?: string;
}

export const mockLowongan: Lowongan[] = [
  {
    id: 1,
    judul: "Frontend Developer",
    perusahaan: "PT Teknologi Nusantara",
    lokasi: "Jakarta",
    tipe: "fulltime",
    deskripsi:
      "Dicari Frontend Developer berpengalaman minimal 2 tahun dengan keahlian React/React Native. Bertanggung jawab membangun UI/UX untuk produk digital perusahaan.",
    link_eksternal: "https://example.com/lowongan/1",
    mitra_id: 1,
    status: "aktif",
    created_at: "2026-06-28T10:00:00Z",
    fakultas: "Fakultas Sains & Teknologi",
  },
  {
    id: 2,
    judul: "Data Analyst",
    perusahaan: "CV Mitra Data Indonesia",
    lokasi: "Palembang",
    tipe: "fulltime",
    deskripsi:
      "Posisi Data Analyst untuk menganalisis data bisnis dan membuat laporan insight. Memerlukan skill SQL, Python, dan Tableau.",
    link_eksternal: "https://example.com/lowongan/2",
    mitra_id: 2,
    status: "aktif",
    created_at: "2026-06-25T08:30:00Z",
    fakultas: "Fakultas Sains & Teknologi",
  },
  {
    id: 3,
    judul: "Guru Pendidikan Agama Islam",
    perusahaan: "Yayasan Pendidikan Al-Falah",
    lokasi: "OKU Timur",
    tipe: "contract",
    deskripsi:
      "Dibutuhkan Guru PAI untuk mengajar di tingkat SMA. Lulusan S1 PAI, berpengalaman mengajar minimal 1 tahun.",
    link_eksternal: "https://example.com/lowongan/3",
    mitra_id: 3,
    status: "aktif",
    created_at: "2026-06-20T14:00:00Z",
    fakultas: "Fakultas Agama Islam",
  },
  {
    id: 4,
    judul: "Guru Ekonomi SMA",
    perusahaan: "PT Sumber Rejeki Makmur",
    lokasi: "Baturaja",
    tipe: "fulltime",
    deskripsi:
      "Dibutuhkan guru pelajaran Ekonomi untuk tingkat SMA. Lulusan Pendidikan Ekonomi, berpengalaman mengajar lebih disukai.",
    link_eksternal: "https://example.com/lowongan/4",
    mitra_id: 4,
    status: "aktif",
    created_at: "2026-06-18T09:00:00Z",
    fakultas: "Fakultas Ilmu Kependidikan",
  },
  {
    id: 5,
    judul: "UI/UX Designer (Remote)",
    perusahaan: "Startup Edukasi Digital",
    lokasi: "Remote",
    tipe: "remote",
    deskripsi:
      "UI/UX Designer remote untuk merancang platform e-learning. Mahir Figma, familiar dengan design system.",
    link_eksternal: "https://example.com/lowongan/5",
    mitra_id: 5,
    status: "aktif",
    created_at: "2026-06-15T11:00:00Z",
    fakultas: "Fakultas Sains & Teknologi",
  },
  {
    id: 6,
    judul: "Intern - Web Developer",
    perusahaan: "PT Digital Sumsel",
    lokasi: "Palembang",
    tipe: "internship",
    deskripsi:
      "Program magang Web Developer selama 3 bulan. Cocok untuk mahasiswa tingkat akhir yang ingin pengalaman kerja nyata.",
    link_eksternal: "https://example.com/lowongan/6",
    mitra_id: 6,
    status: "aktif",
    created_at: "2026-06-10T07:30:00Z",
    fakultas: "Fakultas Sains & Teknologi",
  },
  {
    id: 7,
    judul: "Guru Bahasa Inggris SMP",
    perusahaan: "SMP Negeri 1 Martapura",
    lokasi: "OKU Timur",
    tipe: "fulltime",
    deskripsi:
      "Membuka lowongan guru Bahasa Inggris untuk mengajar siswa tingkat SMP. Mengutamakan lulusan Pendidikan Bahasa Inggris.",
    link_eksternal: "https://example.com/lowongan/7",
    mitra_id: 7,
    status: "aktif",
    created_at: "2026-06-08T09:00:00Z",
    fakultas: "Fakultas Ilmu Kependidikan",
  },
  {
    id: 8,
    judul: "Guru Kelas MI (SD)",
    perusahaan: "MIN 2 OKU Timur",
    lokasi: "OKU Timur",
    tipe: "fulltime",
    deskripsi:
      "Dibutuhkan guru kelas untuk Madrasah Ibtidaiyah. Lulusan S1 Pendidikan Guru Ibtidaiyah (PGMI) atau Pendidikan Guru Ibtida Iyah.",
    link_eksternal: "https://example.com/lowongan/8",
    mitra_id: 8,
    status: "aktif",
    created_at: "2026-06-05T08:00:00Z",
    fakultas: "Fakultas Agama Islam",
  },
  {
    id: 9,
    judul: "Staff Agronomi & Pertanian",
    perusahaan: "PT Perkebunan Sawit Sumsel",
    lokasi: "Baturaja",
    tipe: "fulltime",
    deskripsi:
      "Mencari staff agronomi lapangan untuk mengelola perkebunan sawit. Diutamakan lulusan Sains Pertanian.",
    link_eksternal: "https://example.com/lowongan/9",
    mitra_id: 9,
    status: "aktif",
    created_at: "2026-06-02T10:00:00Z",
    fakultas: "Fakultas Sains & Teknologi",
  },
];
