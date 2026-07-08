export interface RequirementItem {
  id: number;
  title: string;
  desc: string;
  status: "pending_upload" | "uploading" | "pending_verification" | "verified" | "rejected";
  fileName: string | null;
}

// Data awal berkas pengambilan ijazah mahasiswa "Alumni Demo" / NIM "1902001"
let mockStudentReqs: RequirementItem[] = [
  { 
    id: 1, 
    title: "Pengisian Tracer Study (Wajib)", 
    desc: "Mengisi kuesioner pelacakan alumni secara lengkap di sistem ini.", 
    status: "verified", 
    fileName: "Database Tracer Study UNUHA"
  },
  { 
    id: 2, 
    title: "Bebas Pinjam Perpustakaan", 
    desc: "Unggah Surat Bebas Pustaka dari Perpustakaan Pusat Universitas.", 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 3, 
    title: "Bebas Tunggakan Keuangan", 
    desc: "Unggah bukti pelunasan UKT/SPP dari Biro Keuangan.", 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 4, 
    title: "Penyerahan Jilidan Skripsi / TA", 
    desc: "Unggah bukti tanda terima penyerahan skripsi dari program studi.", 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 5, 
    title: "Pengembalian Toga & Atribut Wisuda", 
    desc: "Unggah bukti pengembalian toga dan perlengkapan wisuda.", 
    status: "pending_upload", 
    fileName: null 
  },
];

let studentFaculty = "Fakultas Sains & Teknologi";

const subscribers = new Set<() => void>();

export const ijazahValidationService = {
  getRequirements: () => mockStudentReqs,
  
  getStudentFaculty: () => studentFaculty,
  setStudentFaculty: (faculty: string) => {
    studentFaculty = faculty;
    subscribers.forEach((cb) => cb());
  },
  
  updateRequirementStatus: (id: number, status: RequirementItem["status"], fileName?: string | null) => {
    mockStudentReqs = mockStudentReqs.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          fileName: fileName !== undefined ? fileName : r.fileName
        };
      }
      return r;
    });
    subscribers.forEach((cb) => cb());
  },
  
  resetRequirements: () => {
    mockStudentReqs = mockStudentReqs.map((r) => {
      if (r.id === 1) return { ...r, status: "verified", fileName: "Database Tracer Study UNUHA" };
      return { ...r, status: "pending_upload", fileName: null };
    });
    subscribers.forEach((cb) => cb());
  },
  
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  }
};
