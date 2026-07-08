import { api, USE_MOCK } from "@/services/api";

export interface RequirementItem {
  id: number;
  title: string;
  desc: string;
  status: "pending_upload" | "uploading" | "pending_verification" | "verified" | "rejected";
  fileName: string | null;
}

const getTitleForId = (id: number): string => {
  const titles: Record<number, string> = {
    1: "Pengisian Tracer Study (Wajib)",
    2: "Bebas Pinjam Perpustakaan",
    3: "Bebas Tunggakan Keuangan",
    4: "Penyerahan Jilidan Skripsi / TA",
    5: "Pengembalian Toga & Atribut Wisuda"
  };
  return titles[id] || `Persyaratan #${id}`;
};

const getDescForId = (id: number): string => {
  const descs: Record<number, string> = {
    1: "Mengisi kuesioner pelacakan alumni secara lengkap di sistem ini.",
    2: "Unggah Surat Bebas Pustaka dari Perpustakaan Pusat Universitas.",
    3: "Unggah bukti pelunasan UKT/SPP dari Biro Keuangan.",
    4: "Unggah bukti tanda terima penyerahan skripsi dari program studi.",
    5: "Unggah bukti pengembalian toga dan perlengkapan wisuda."
  };
  return descs[id] || "Berkas kelengkapan bukti pengambilan ijazah.";
};

// Data awal berkas pengambilan ijazah mahasiswa "Alumni Demo" / NIM "1902001"
let mockStudentReqs: RequirementItem[] = [
  { 
    id: 1, 
    title: getTitleForId(1), 
    desc: getDescForId(1), 
    status: "verified", 
    fileName: "Database Tracer Study UNUHA"
  },
  { 
    id: 2, 
    title: getTitleForId(2), 
    desc: getDescForId(2), 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 3, 
    title: getTitleForId(3), 
    desc: getDescForId(3), 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 4, 
    title: getTitleForId(4), 
    desc: getDescForId(4), 
    status: "pending_upload", 
    fileName: null 
  },
  { 
    id: 5, 
    title: getTitleForId(5), 
    desc: getDescForId(5), 
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

  // --- Real API Methods ---
  loadRequirements: async () => {
    if (USE_MOCK) return;
    try {
      const response = await api.get("/ijazah-requirements");
      const mapped = response.data.map((item: any) => ({
        id: item.requirement_id || item.id,
        title: getTitleForId(item.requirement_id || item.id),
        desc: getDescForId(item.requirement_id || item.id),
        status: item.status,
        fileName: item.file_name || null
      }));
      if (mapped.length > 0) {
        mockStudentReqs = mapped;
        subscribers.forEach((cb) => cb());
      }
    } catch (error) {
      console.error("Failed to load ijazah requirements from Laravel API:", error);
      throw error;
    }
  },

  uploadRequirementFile: async (id: number, fileUri: string, fileName: string, fileMime: string) => {
    // Optimistic state update in UI
    ijazahValidationService.updateRequirementStatus(id, "uploading");

    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      // For toga (id 5), status after upload is draft (pending_upload) according to spec
      const targetStatus = id === 5 ? "pending_upload" : "pending_verification";
      ijazahValidationService.updateRequirementStatus(id, targetStatus, fileName);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: fileMime,
      } as any);

      await api.post(`/ijazah-requirements/${id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reload from backend
      await ijazahValidationService.loadRequirements();
    } catch (error) {
      // Revert status to pending_upload on error
      ijazahValidationService.updateRequirementStatus(id, "pending_upload", null);
      console.error(`Failed to upload file for requirement #${id}:`, error);
      throw error;
    }
  },

  submitRequirement5: async () => {
    if (USE_MOCK) {
      ijazahValidationService.updateRequirementStatus(5, "pending_verification");
      return;
    }

    try {
      await api.post("/ijazah-requirements/5/submit");
      await ijazahValidationService.loadRequirements();
    } catch (error) {
      console.error("Failed to submit Step 5 draft to BAAK:", error);
      throw error;
    }
  },

  approveRequirement: async (id: number) => {
    if (USE_MOCK) {
      ijazahValidationService.updateRequirementStatus(id, "verified");
      return;
    }

    try {
      await api.post(`/admin/verifications/${id}/approve`);
      await ijazahValidationService.loadRequirements();
    } catch (error) {
      console.error(`Failed to approve requirement #${id}:`, error);
      throw error;
    }
  },

  rejectRequirement: async (id: number) => {
    if (USE_MOCK) {
      ijazahValidationService.updateRequirementStatus(id, "rejected");
      return;
    }

    try {
      await api.post(`/admin/verifications/${id}/reject`);
      await ijazahValidationService.loadRequirements();
    } catch (error) {
      console.error(`Failed to reject requirement #${id}:`, error);
      throw error;
    }
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
