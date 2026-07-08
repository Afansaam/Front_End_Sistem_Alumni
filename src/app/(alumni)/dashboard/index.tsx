import React from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, ActivityIndicator, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { mockLowongan } from "@/services/mock/lowongan";
import { ijazahValidationService } from "@/services/mock/ijazahValidation";

export default function AlumniDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const namaAlumni = user?.alumni_profile?.nama || "Alumni Demo";
  const nimAlumni = user?.alumni_profile?.nim || "1902001";
  const userFakultas = user?.alumni_profile?.fakultas;

  // Filter lowongan yang sesuai dengan fakultas pengguna
  // Jika tidak ada lowongan yang sesuai fakultas, kembalikan 3 lowongan teratas
  const recommendedJobs = React.useMemo(() => {
    if (!userFakultas) return mockLowongan.slice(0, 3);
    const matched = mockLowongan.filter((job) => job.fakultas === userFakultas);
    return matched.length > 0 ? matched.slice(0, 3) : mockLowongan.slice(0, 3);
  }, [userFakultas]);

  const [reqs, setReqs] = React.useState(() => ijazahValidationService.getRequirements());
  const [activeStep, setActiveStep] = React.useState(1);
  const [step5DraftFile, setStep5DraftFile] = React.useState<string | null>(null);
  const [step5Uploading, setStep5Uploading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = ijazahValidationService.subscribe(() => {
      setReqs([...ijazahValidationService.getRequirements()]);
    });
    return unsubscribe;
  }, []);

  // Set active step to first incomplete on mount
  React.useEffect(() => {
    const incomplete = ijazahValidationService.getRequirements().find((r) => r.status !== "verified");
    if (incomplete) {
      setActiveStep(incomplete.id);
    }
  }, []);

  const getHelpLink = (id: number) => {
    switch (id) {
      case 1:
        return { label: "Portal Pengisian Tracer Study Kemdikbud", url: "https://tracerstudy.kemdikbud.go.id/" };
      case 2:
        return { label: "Situs Bebas Pustaka Perpustakaan UNUHA", url: "http://perpustakaan.unuha.ac.id" };
      case 3:
        return { label: "Sistem Pembayaran / Keuangan Mahasiswa", url: "http://keuangan.unuha.ac.id" };
      case 4:
        return { label: "Unduh Template Surat Bebas Skripsi/TA", url: "http://siat.unuha.ac.id" };
      case 5:
        return { label: "Panduan Pengembalian Toga & Wisuda UNUHA", url: "http://wisuda.unuha.ac.id" };
      default:
        return null;
    }
  };

  const activeReq = reqs.find((r) => r.id === activeStep) || reqs[0];
  const isActiveCompleted = activeReq.status === "verified";
  const isActivePendingVerification = activeReq.status === "pending_verification";
  const isActiveRejected = activeReq.status === "rejected";
  const isActiveUploading = activeReq.status === "uploading";
  const isActivePendingUpload = activeReq.status === "pending_upload";

  let activeStatusIcon = "ellipse-outline";
  let activeStatusColor = "text-gray-400";
  let activeStatusColorHex = "#9CA3AF";
  let activeStatusBg = "bg-gray-50 border-gray-200";

  if (isActiveCompleted) {
    activeStatusIcon = "checkmark-circle";
    activeStatusColor = "text-green-500";
    activeStatusColorHex = "#10B981";
    activeStatusBg = "bg-green-50/50 border-green-200";
  } else if (isActivePendingVerification) {
    activeStatusIcon = "time";
    activeStatusColor = "text-amber-500";
    activeStatusColorHex = "#F59E0B";
    activeStatusBg = "bg-amber-50/50 border-amber-200";
  } else if (isActiveRejected) {
    activeStatusIcon = "close-circle";
    activeStatusColor = "text-red-500";
    activeStatusColorHex = "#EF4444";
    activeStatusBg = "bg-red-50/50 border-red-200";
  }

  const helpLink = getHelpLink(activeReq.id);

  const handleUpload = (id: number) => {
    if (id === 5) {
      setStep5Uploading(true);
      setTimeout(() => {
        setStep5DraftFile("pengembalian_toga_1902001.pdf");
        setStep5Uploading(false);
      }, 1200);
      return;
    }

    ijazahValidationService.updateRequirementStatus(id, "uploading");

    setTimeout(() => {
      const fakeFiles: Record<number, string> = {
        2: "bebas_pustaka_1902001.pdf",
        3: "bukti_keuangan_1902001.pdf",
        4: "tanda_terima_skripsi_1902001.pdf",
      };
      ijazahValidationService.updateRequirementStatus(
        id, 
        "pending_verification", 
        fakeFiles[id] || "dokumen_bukti.pdf"
      );
    }, 1200);
  };

  const handleStep5Submit = () => {
    if (!step5DraftFile) return;

    const confirmMessage = "Apakah Anda yakin ingin mengirim berkas bukti pengembalian toga berikut?\n\nFile: " + step5DraftFile;

    if (Platform.OS === 'web') {
      const confirmSubmit = window.confirm(confirmMessage);
      if (confirmSubmit) {
        ijazahValidationService.updateRequirementStatus(5, "pending_verification", step5DraftFile);
        setStep5DraftFile(null);
        alert("Berkas bukti pengembalian toga berhasil dikirim ke BAAK!");
      }
    } else {
      Alert.alert(
        "Konfirmasi Pengiriman",
        confirmMessage,
        [
          { text: "Batal", style: "cancel" },
          { 
            text: "Ya, Kirim", 
            onPress: () => {
              ijazahValidationService.updateRequirementStatus(5, "pending_verification", step5DraftFile);
              setStep5DraftFile(null);
              Alert.alert("Sukses", "Berkas bukti pengembalian toga berhasil dikirim ke BAAK!");
            }
          }
        ]
      );
    }
  };

  const exportToPDF = () => {
    if (Platform.OS === 'web') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Pop-up blocked. Silakan izinkan pop-up untuk mencetak PDF.");
        return;
      }
      
      const requirementsHtml = reqs.map((r) => {
        let statusText = "BELUM DIUNGGAH";
        if (r.status === "verified") statusText = "TERVERIFIKASI / DISETUJUI";
        if (r.status === "pending_verification") statusText = "MENUNGGU VERIFIKASI";
        if (r.status === "rejected") statusText = "DITOLAK BAAK";
        if (r.status === "uploading") statusText = "SEDANG DIUNGGAH";
        
        const fileInfo = r.fileName ? `<br/><span style="font-size: 11px; color: #64748b; font-style: italic;">File bukti: ${r.fileName}</span>` : "";
        
        return `
          <div class="requirement-item" style="margin-bottom: 15px; padding-left: 25px; position: relative;">
            <div class="requirement-title" style="font-weight: bold; font-size: 15px;">
              ${r.title} — <span style="color: ${r.status === "verified" ? "#10b981" : r.status === "pending_verification" ? "#d97706" : r.status === "rejected" ? "#ef4444" : "#64748b"}; font-weight: bold; font-size: 13px;">${statusText}</span>
            </div>
            <div class="requirement-desc" style="font-size: 13px; color: #475569; margin-top: 2px;">
              ${r.desc} ${fileInfo}
            </div>
          </div>
        `;
      }).join('');
      
      const content = `
        <html>
          <head>
            <title>Persyaratan Pengambilan Ijazah - Universitas Nurul Huda</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                color: #1e293b;
                line-height: 1.6;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                border-bottom: 3px double #0f172a;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .univ-name {
                font-size: 20px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 0;
              }
              .univ-sub {
                font-size: 12px;
                color: #64748b;
                margin: 5px 0 0 0;
              }
              .doc-title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                text-decoration: underline;
                margin-bottom: 25px;
                text-transform: uppercase;
              }
              .meta-info {
                margin-bottom: 25px;
                font-size: 14px;
              }
              .meta-info table {
                width: 100%;
                border-collapse: collapse;
              }
              .meta-info td {
                padding: 4px 0;
              }
              .meta-info td.label {
                width: 150px;
                font-weight: bold;
              }
              .requirements-list {
                margin-bottom: 30px;
              }
              .requirement-item::before {
                content: "✓";
                position: absolute;
                left: 0;
                top: 0;
                color: #f97316;
                font-weight: bold;
              }
              .footer-signature {
                margin-top: 50px;
                float: right;
                width: 250px;
                text-align: center;
                font-size: 14px;
              }
              .signature-space {
                height: 75px;
              }
              .stamp-note {
                font-size: 11px;
                color: #94a3b8;
                margin-top: 5px;
              }
              @media print {
                body { padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="univ-name">Universitas Nurul Huda (UNUHA)</div>
              <div class="univ-sub">Jalan Raya Sukaraja, OKU Timur, Sumatera Selatan • Telepon: (0735) xxxxxx</div>
              <div class="univ-sub">Website: www.unuha.ac.id • Email: info@unuha.ac.id</div>
            </div>
            
            <div class="doc-title">Surat Pernyataan Persyaratan Pengambilan Ijazah</div>
            
            <div class="meta-info">
              <table>
                <tr>
                  <td class="label">Nama Mahasiswa</td>
                  <td>: ${namaAlumni}</td>
                </tr>
                <tr>
                  <td class="label">NIM</td>
                  <td>: ${nimAlumni}</td>
                </tr>
                <tr>
                  <td class="label">Fakultas</td>
                  <td>: ${userFakultas || "-"}</td>
                </tr>
                <tr>
                  <td class="label">Program Studi</td>
                  <td>: ${user?.alumni_profile?.prodi || "-"}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 14px;">Berdasarkan peraturan akademik Universitas Nurul Huda, mahasiswa yang bersangkutan diwajibkan untuk memenuhi dan melengkapi persyaratan administrasi berikut sebelum dapat mengambil ijazah asli kelulusan:</p>
            
            <div class="requirements-list">
              ${requirementsHtml}
            </div>
            
            <p style="font-size: 13px; font-style: italic; color: #64748b; margin-top: 40px;">* Dokumen ini diterbitkan secara elektronik oleh sistem informasi karir dan tracer study UNUHA sebagai panduan checklist bagi mahasiswa.</p>
            
            <div class="footer-signature">
              <div>OKU Timur, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Biro Administrasi Akademik (BAAK)</div>
              <div class="signature-space"></div>
              <div style="font-weight: bold; text-decoration: underline;">Petugas BAAK UNUHA</div>
              <div class="stamp-note">Dokumen sah tanpa tanda tangan fisik</div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
    } else {
      Alert.alert(
        "Unduh PDF",
        "Fitur ekspor PDF langsung dari perangkat mobile sedang dalam pengembangan. Silakan akses melalui browser web untuk mengunduh versi PDF resmi.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-8 md:p-8">
          
          {/* Welcome Banner */}
          <Animated.View 
            entering={FadeInUp.duration(600).springify()}
            className="bg-navy rounded-3xl p-6 md:p-10 mb-8 shadow-xl shadow-navy/20 relative overflow-hidden flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Background Decorative Pattern */}
            <View className="absolute right-0 top-0 bottom-0 w-1/3 bg-orange/10 rounded-l-full transform translate-x-12 scale-150 pointer-events-none" />
            
            <View className="flex-1">
              <Text className="text-orange font-bold text-sm tracking-wider uppercase mb-2">Selamat Datang Kembali</Text>
              <Text className="text-white text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
                {namaAlumni}
              </Text>
              <Text className="text-blue-100 text-sm md:text-base max-w-[650px] leading-relaxed">
                Kelola tracer study Anda, temukan berbagai kesempatan karir terbaik dari mitra industri, dan kembangkan jaringan alumni Universitas Nurul Huda.
              </Text>
            </View>
            
            <Pressable 
              onPress={() => router.push("/profil-alumni")}
              className="bg-white/10 border border-white/20 hover:bg-white/20 active:scale-[0.98] px-5 py-3 rounded-2xl flex-row items-center gap-2 transition-all self-stretch md:self-auto justify-center"
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Lengkapi Profil</Text>
            </Pressable>
          </Animated.View>

          {/* Core Content Grid */}
          <View className="flex-col lg:flex-row gap-6 md:gap-8 items-start">
            
            {/* Left Content (Stats & Recommendations) */}
            <View className="flex-1 lg:flex-[2.2] w-full gap-6 md:gap-8">
              
              {/* Stats Row */}
              <Animated.View 
                entering={FadeInDown.duration(600).delay(200).springify()}
                className="flex-row flex-wrap gap-4 w-full"
              >
                {/* Stat 1: Tracer Study */}
                <View className="flex-1 min-w-[200px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-orange/10 rounded-xl items-center justify-center">
                    <Ionicons name="document-text" size={24} color={Brand.orange} />
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tracer Study</Text>
                    <Text className="text-red-500 font-black text-sm md:text-base mt-0.5">Belum Diisi</Text>
                  </View>
                </View>

                {/* Stat 2: Profil Status */}
                <View className="flex-1 min-w-[200px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-navy/5 rounded-xl items-center justify-center">
                    <Ionicons name="person" size={24} color={Brand.navy} />
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Profil Alumni</Text>
                    <Text className="text-navy font-black text-sm md:text-base mt-0.5">85% Lengkap</Text>
                  </View>
                </View>

                {/* Stat 3: Lowongan */}
                <View className="flex-1 min-w-[200px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center">
                    <Ionicons name="briefcase" size={24} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Lowongan Baru</Text>
                    <Text className="text-green-600 font-black text-sm md:text-base mt-0.5">{mockLowongan.length} Aktif</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Persyaratan Pengambilan Ijazah Card */}
              <Animated.View 
                entering={FadeInDown.duration(600).delay(300).springify()}
                className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm w-full gap-6"
              >
                <View className="flex-row items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                  <View className="w-12 h-12 rounded-2xl bg-orange/10 items-center justify-center shrink-0">
                    <Ionicons name="document-text" size={24} color={Brand.orange} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg md:text-xl font-black text-navy">Persyaratan Pengambilan Ijazah</Text>
                    <Text className="text-gray-500 text-xs md:text-sm mt-0.5">Lengkapi berkas bukti untuk diverifikasi oleh admin BAAK:</Text>
                  </View>
                </View>

                {/* Step Progress Indicator (Stepper) */}
                <View className="flex-row items-center justify-between w-full py-4 border-b border-gray-100 mb-2">
                  {reqs.map((req, idx) => {
                    const stepCompleted = req.status === "verified";
                    const stepActive = activeStep === req.id;
                    
                    return (
                      <React.Fragment key={req.id}>
                        {/* Step Bubble */}
                        <Pressable 
                          onPress={() => setActiveStep(req.id)}
                          className="items-center justify-center active:scale-95 transition-all"
                        >
                          <View className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
                            stepCompleted 
                              ? 'bg-green-500 border-green-500' 
                              : stepActive 
                                ? 'bg-navy border-navy shadow-md shadow-navy/20' 
                                : 'bg-white border-gray-200'
                          }`}>
                            {stepCompleted ? (
                              <Ionicons name="checkmark" size={18} color="#fff" />
                            ) : (
                              <Text className={`font-black text-sm ${stepActive ? 'text-white' : 'text-gray-400'}`}>{req.id}</Text>
                            )}
                          </View>
                          <Text className={`text-[10px] font-extrabold mt-1.5 ${stepActive ? 'text-navy' : 'text-gray-400'}`}>
                            {req.id === 1 ? "Tracer" : req.id === 2 ? "Perpus" : req.id === 3 ? "Keuangan" : req.id === 4 ? "Skripsi" : "Toga"}
                          </Text>
                        </Pressable>
                        
                        {/* Connector Line */}
                        {idx < reqs.length - 1 && (
                          <View className={`flex-1 h-0.5 mx-2 -mt-4 ${
                            reqs[idx].status === "verified" && reqs[idx+1].status === "verified"
                              ? 'bg-green-500' 
                              : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>

                {/* Active Requirement Card Details */}
                <View className={`p-5 rounded-2xl border ${activeStatusBg} gap-4`}>
                  <View className="flex-row items-start gap-3">
                    <Ionicons name={activeStatusIcon as any} size={22} className={`${activeStatusColor} mt-0.5 shrink-0`} color={activeStatusColorHex} />
                    <View className="flex-1">
                      <Text className="text-gray-900 font-extrabold text-base md:text-lg">{activeReq.id}. {activeReq.title}</Text>
                      <Text className="text-gray-500 text-xs md:text-sm mt-1 leading-relaxed">{activeReq.desc}</Text>
                    </View>
                  </View>

                  {/* Actions for Current Step */}
                  <View className="border-t border-gray-100/50 pt-3">
                    {/* Step 5 Specific Submission Flow */}
                    {activeReq.id === 5 && step5DraftFile && isActivePendingUpload && (
                      <View className="gap-3">
                        <View className="flex-row items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 self-start">
                          <Ionicons name="document-text-outline" size={16} color={Brand.navy} />
                          <Text className="text-navy font-bold text-xs">Berkas terpilih: {step5DraftFile}</Text>
                        </View>
                        <View className="flex-row gap-2">
                          <Pressable 
                            onPress={handleStep5Submit}
                            className="bg-orange hover:bg-orange/95 px-5 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95 transition-all"
                          >
                            <Ionicons name="send" size={14} color="#fff" />
                            <Text className="text-white font-extrabold text-xs">Kirim Berkas (Submit)</Text>
                          </Pressable>
                          <Pressable 
                            onPress={() => setStep5DraftFile(null)}
                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition-all"
                          >
                            <Text className="text-gray-600 font-extrabold text-xs">Ganti Berkas</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}

                    {activeReq.id === 5 && step5Uploading && (
                      <View className="flex-row items-center gap-2 py-2">
                        <ActivityIndicator size="small" color={Brand.orange} />
                        <Text className="text-orange font-bold text-xs">Mengunggah berkas...</Text>
                      </View>
                    )}

                    {/* Standard/Step 5 Upload Trigger */}
                    {isActivePendingUpload && activeReq.id > 1 && (activeReq.id !== 5 || (!step5DraftFile && !step5Uploading)) && (
                      <Pressable 
                        onPress={() => handleUpload(activeReq.id)}
                        className="bg-orange hover:bg-orange/95 px-5 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95 transition-all self-start"
                      >
                        <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
                        <Text className="text-white font-bold text-sm">Unggah Bukti</Text>
                      </Pressable>
                    )}

                    {isActiveUploading && activeReq.id !== 5 && (
                      <View className="flex-row items-center gap-2 py-2">
                        <ActivityIndicator size="small" color={Brand.orange} />
                        <Text className="text-orange font-bold text-xs">Mengunggah berkas...</Text>
                      </View>
                    )}

                    {isActivePendingVerification && (
                      <View className="gap-2.5">
                        <View className="flex-row items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1 self-start">
                          <Ionicons name="time-outline" size={13} color="#D97706" />
                          <Text className="text-amber-700 font-bold text-xs">Menunggu Verifikasi Admin BAAK</Text>
                        </View>
                        {activeReq.fileName && (
                          <Text className="text-gray-500 text-xs font-semibold">Berkas Terunggah: {activeReq.fileName}</Text>
                        )}
                        <Pressable 
                          onPress={() => handleUpload(activeReq.id)}
                          className="bg-gray-100 border border-gray-200 hover:bg-gray-200 px-3 py-1.5 rounded-lg self-start active:scale-95 transition-all"
                        >
                          <Text className="text-gray-600 font-bold text-xs">Ganti File Bukti</Text>
                        </Pressable>
                      </View>
                    )}

                    {isActiveCompleted && (
                      <View className="flex-row items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5 self-start">
                        <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
                        <Text className="text-green-700 font-bold text-xs">Berkas Telah Terverifikasi Admin BAAK</Text>
                      </View>
                    )}

                    {isActiveRejected && (
                      <View className="gap-3">
                        {activeReq.id === 5 && step5DraftFile ? (
                          <View className="gap-3">
                            <View className="flex-row items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 self-start">
                              <Ionicons name="document-text-outline" size={16} color={Brand.navy} />
                              <Text className="text-navy font-bold text-xs">Berkas terpilih: {step5DraftFile}</Text>
                            </View>
                            <View className="flex-row gap-2">
                              <Pressable 
                                onPress={handleStep5Submit}
                                className="bg-orange hover:bg-orange/95 px-5 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95 transition-all"
                              >
                                <Ionicons name="send" size={14} color="#fff" />
                                <Text className="text-white font-extrabold text-xs">Kirim Berkas (Submit)</Text>
                              </Pressable>
                              <Pressable 
                                onPress={() => setStep5DraftFile(null)}
                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition-all"
                              >
                                <Text className="text-gray-600 font-extrabold text-xs">Ganti Berkas</Text>
                              </Pressable>
                            </View>
                          </View>
                        ) : (
                          <>
                            <View className="flex-row items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1 self-start">
                              <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                              <Text className="text-red-700 font-bold text-xs">Ditolak - Berkas Tidak Valid</Text>
                            </View>
                            <Pressable 
                              onPress={() => handleUpload(activeReq.id)}
                              className="bg-navy hover:bg-navy/95 px-4 py-2 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition-all self-start"
                            >
                              <Ionicons name="sync-outline" size={14} color="#fff" />
                              <Text className="text-white font-bold text-xs">Unggah Ulang Berkas</Text>
                            </Pressable>
                          </>
                        )}
                      </View>
                    )}

                    {activeReq.id === 1 && (
                      <Pressable 
                        onPress={() => router.push("/dashboard/tracer-study")}
                        className="bg-orange hover:bg-orange/95 px-4 py-2 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition-all self-start mt-1"
                      >
                        <Ionicons name="open-outline" size={14} color="#fff" />
                        <Text className="text-white font-bold text-xs">Buka Kuesioner</Text>
                      </Pressable>
                    )}

                    {/* Stepper Helper / Reference Links */}
                    {helpLink && (
                      <Pressable 
                        onPress={() => {
                          if (Platform.OS === 'web') {
                            window.open(helpLink.url, '_blank');
                          } else {
                            Linking.openURL(helpLink.url).catch(() => Alert.alert("Error", "Gagal membuka link"));
                          }
                        }}
                        className="flex-row items-center gap-1.5 mt-4 bg-orange/5 border border-orange/10 rounded-xl px-3.5 py-2.5 self-start hover:bg-orange/10 active:scale-95 transition-all"
                      >
                        <Ionicons name="link-outline" size={14} color={Brand.orange} />
                        <Text className="text-orange font-bold text-xs">{helpLink.label} ↗</Text>
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3 pt-3 border-t border-gray-100">
                  <Pressable 
                    onPress={exportToPDF}
                    className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 px-6 py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:scale-[0.98] transition-all"
                  >
                    <Ionicons name="download-outline" size={18} color={Brand.navy} />
                    <Text className="text-navy font-bold text-sm">Ekspor PDF Syarat</Text>
                  </Pressable>
                </View>
              </Animated.View>

              {/* Recommended Jobs */}
              <Animated.View 
                entering={FadeInDown.duration(600).delay(400).springify()}
                className="gap-4 w-full"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-1 mr-4">
                    <Text className="text-xl font-black text-navy">Rekomendasi Lowongan Kerja</Text>
                    {userFakultas && (
                      <Text className="text-orange font-bold text-xs mt-0.5">
                        Disesuaikan dengan {userFakultas}
                      </Text>
                    )}
                  </View>
                  <Pressable onPress={() => router.push("/lowongan")} className="hover:opacity-75 shrink-0">
                    <Text className="text-orange font-bold text-sm">Lihat Semua →</Text>
                  </Pressable>
                </View>

                <View className="gap-4">
                  {recommendedJobs.map((job) => (
                    <View key={job.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md hover:border-navy/20 transition-all">
                      <View className="flex-row gap-4 items-center flex-1">
                        <View className="w-12 h-12 rounded-xl bg-navy/5 items-center justify-center shrink-0">
                          <Ionicons name="briefcase-outline" size={24} color={Brand.navy} />
                        </View>
                        <View className="flex-1">
                          <Text className="font-extrabold text-base md:text-lg text-gray-900">{job.judul}</Text>
                          <Text className="text-gray-500 text-sm">{job.perusahaan} • {job.lokasi}</Text>
                          <View className="flex-row mt-2">
                            <View className="bg-blue-50 px-2.5 py-1 rounded-md">
                              <Text className="text-xs font-bold text-navy uppercase tracking-wider">{job.tipe}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <Pressable 
                        onPress={() => router.push("/lowongan")}
                        className="bg-navy px-5 py-2.5 rounded-xl w-full md:w-auto items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                      >
                        <Text className="text-white font-bold text-sm">Detail Karir</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </Animated.View>

            </View>

            {/* Right Sidebar (Profile Info & Navigation Shortcuts) */}
            <Animated.View 
              entering={FadeInDown.duration(600).delay(350).springify()}
              className="flex-1 w-full lg:max-w-[360px] gap-6"
            >
              
              {/* Profile Card */}
              <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm items-center w-full">
                <View className="w-20 h-20 rounded-full bg-navy/10 items-center justify-center mb-4 relative">
                  <Text className="text-navy font-black text-3xl">{namaAlumni.charAt(0)}</Text>
                  <View className="absolute right-0 bottom-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
                </View>
                <Text className="font-extrabold text-lg text-navy text-center">{namaAlumni}</Text>
                <Text className="text-gray-400 text-sm text-center mb-4">NIM. {nimAlumni}</Text>
                
                <View className="w-full h-px bg-gray-100 my-4" />
                
                <View className="w-full gap-3">
                  {user?.alumni_profile?.fakultas && (
                    <View className="flex-row justify-between text-sm">
                      <Text className="text-gray-400">Fakultas</Text>
                      <Text className="text-gray-700 font-bold text-right flex-1 ml-4" numberOfLines={1}>{user.alumni_profile.fakultas}</Text>
                    </View>
                  )}
                  <View className="flex-row justify-between text-sm">
                    <Text className="text-gray-400">Program Studi</Text>
                    <Text className="text-gray-700 font-bold text-right flex-1 ml-4" numberOfLines={1}>{user?.alumni_profile?.prodi || "Teknologi Informasi"}</Text>
                  </View>
                  <View className="flex-row justify-between text-sm">
                    <Text className="text-gray-400">Tahun Lulus</Text>
                    <Text className="text-gray-700 font-bold">2023</Text>
                  </View>
                </View>
              </View>

              {/* Shortcut Menu */}
              <View className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm w-full">
                <Text className="text-navy font-bold px-3 py-2 mb-2 text-base">Menu Navigasi</Text>
                
                {[
                  { label: "Profil & CV Saya", icon: "document-text-outline", href: "/profil-alumni" },
                  { label: "Riwayat Lamaran", icon: "archive-outline", href: "/lowongan" },
                  { label: "Pengaturan Akun", icon: "settings-outline", href: "/dashboard" },
                ].map((item, index) => (
                  <Pressable 
                    key={index}
                    onPress={() => router.push(item.href as any)}
                    className="flex-row items-center justify-between p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name={item.icon as any} size={20} color={Brand.navy} />
                      <Text className="text-gray-700 font-bold text-sm">{item.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>

            </Animated.View>

          </View>

        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
