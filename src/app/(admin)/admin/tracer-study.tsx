import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Platform, Alert, ActivityIndicator } from "react-native";
import { Brand } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ijazahValidationService, RequirementItem } from "@/services/mock/ijazahValidation";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AdminTracerStudyScreen() {
  const [reqs, setReqs] = useState<RequirementItem[]>(() => ijazahValidationService.getRequirements());
  const { user } = useAuth();
  const adminFakultas = user?.fakultas || "Pusat";
  const studentFaculty = ijazahValidationService.getStudentFaculty();

  // Memeriksa wewenang admin (Admin Pusat bisa verifikasi semua, admin fakultas hanya fakultasnya sendiri)
  const hasAuthority = adminFakultas === "Pusat" || adminFakultas === studentFaculty;

  useEffect(() => {
    const unsubscribe = ijazahValidationService.subscribe(() => {
      setReqs([...ijazahValidationService.getRequirements()]);
    });
    return unsubscribe;
  }, []);

  const handleApprove = (id: number) => {
    if (!hasAuthority) return;
    ijazahValidationService.updateRequirementStatus(id, "verified");
    if (Platform.OS !== "web") {
      Alert.alert("Sukses", "Dokumen berhasil disetujui.");
    }
  };

  const handleReject = (id: number) => {
    if (!hasAuthority) return;
    ijazahValidationService.updateRequirementStatus(id, "rejected");
    if (Platform.OS !== "web") {
      Alert.alert("Ditolak", "Dokumen telah ditolak.");
    }
  };

  const handleApproveAll = () => {
    if (!hasAuthority) return;
    reqs.forEach((r) => {
      if (r.status === "pending_verification") {
        ijazahValidationService.updateRequirementStatus(r.id, "verified");
      }
    });
    Alert.alert("Sukses", "Semua berkas masuk telah disetujui.");
  };

  const handleRejectAll = () => {
    if (!hasAuthority) return;
    reqs.forEach((r) => {
      if (r.status === "pending_verification") {
        ijazahValidationService.updateRequirementStatus(r.id, "rejected");
      }
    });
    Alert.alert("Sukses", "Semua berkas masuk telah ditolak.");
  };

  const handleReset = () => {
    ijazahValidationService.resetRequirements();
    Alert.alert("Reset", "Data simulasi persyaratan ijazah telah di-reset.");
  };

  const pendingCount = reqs.filter((r) => r.status === "pending_verification").length;
  const verifiedCount = reqs.filter((r) => r.status === "verified").length;

  return (
    <View className="flex-1 bg-white">
      <Navbar />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50 flex-1" showsVerticalScrollIndicator={false}>
        <View className="max-w-[1200px] w-full mx-auto px-4 py-8 md:p-8 gap-6">
          
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(500)} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <View className="flex-1">
              <Text className="text-navy text-2xl font-black">Validasi Persyaratan Ijazah</Text>
              <Text className="text-gray-500 text-sm mt-1">Verifikasi dokumen bukti fisik/digital kelulusan mahasiswa sebelum pengambilan ijazah asli.</Text>
              <Text className="text-orange font-bold text-xs mt-1">Grup Akses: Admin {adminFakultas}</Text>
            </View>
            <Pressable 
              onPress={handleReset}
              className="bg-navy hover:bg-navy/90 px-4 py-2.5 rounded-xl flex-row items-center gap-2 active:scale-95 transition-all self-stretch md:self-auto justify-center"
            >
              <Ionicons name="refresh-outline" size={16} color="#fff" />
              <Text className="text-white font-bold text-xs">Reset Semua Simulasi</Text>
            </Pressable>
          </Animated.View>

          {/* Warning Banner if No Authority */}
          {!hasAuthority && (
            <Animated.View entering={FadeInDown.duration(500).delay(50)} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center gap-3">
              <Ionicons name="alert-circle-outline" size={20} color="#EF4444" className="shrink-0" />
              <Text className="text-red-700 text-xs md:text-sm font-semibold flex-1 leading-relaxed">
                Anda login sebagai Admin {adminFakultas}. Mahasiswa yang mengajukan berkas saat ini berasal dari {studentFaculty}. Anda hanya dapat melihat (preview) berkas ini tanpa wewenang menyetujui atau menolak.
              </Text>
            </Animated.View>
          )}

          {/* Stats Row */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} className="flex-row flex-wrap gap-4">
            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-amber-50 rounded-xl items-center justify-center">
                <Ionicons name="time" size={24} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Menunggu Verifikasi</Text>
                <Text className="text-amber-600 font-black text-xl mt-0.5">{pendingCount} Berkas</Text>
              </View>
            </View>

            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Telah Disetujui</Text>
                <Text className="text-green-600 font-black text-xl mt-0.5">{verifiedCount} / 5 Syarat</Text>
              </View>
            </View>
          </Animated.View>

          {/* Validation List Card */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 gap-6">
            
            {/* Section Header */}
            <View className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <View className="flex-1">
                <Text className="text-navy font-extrabold text-base md:text-lg">Daftar Berkas Mahasiswa</Text>
                <View className="flex-row items-center flex-wrap gap-2 mt-1">
                  <Text className="text-gray-900 font-bold text-xs">Alumni Demo</Text>
                  <Text className="text-gray-400 text-xs">•</Text>
                  <Text className="text-gray-500 text-xs">NIM: 1902001</Text>
                  <Text className="text-gray-400 text-xs">•</Text>
                  <Text className="text-gray-500 text-xs font-bold">{studentFaculty}</Text>
                  <Text className="text-gray-400 text-xs">•</Text>
                  
                  {/* Authority Badge */}
                  {hasAuthority ? (
                    <View className="bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex-row items-center gap-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <Text className="text-green-700 text-[10px] font-bold">Wewenang Anda</Text>
                    </View>
                  ) : (
                    <View className="bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex-row items-center gap-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <Text className="text-red-700 text-[10px] font-bold">Hanya Baca (Fakultas Lain)</Text>
                    </View>
                  )}
                </View>
              </View>
              
              {pendingCount > 0 && hasAuthority && (
                <View className="flex-row gap-2 self-stretch sm:self-auto">
                  <Pressable 
                    onPress={handleApproveAll}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-3.5 py-2 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Ionicons name="checkmark-done" size={14} color="#fff" />
                    <Text className="text-white font-bold text-xs">Setujui Semua</Text>
                  </Pressable>
                  <Pressable 
                    onPress={handleRejectAll}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Ionicons name="close-circle-outline" size={14} color="#fff" />
                    <Text className="text-white font-bold text-xs">Tolak Semua</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Requirements Table */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} className="w-full">
              <View className="min-w-[850px] w-full flex-col">
                
                {/* Table Header */}
                <View className="flex-row bg-slate-100 border border-gray-200 py-3.5 px-4 rounded-t-2xl">
                  <View className="w-[50px] justify-center"><Text className="text-gray-700 font-extrabold text-xs uppercase tracking-wide">No</Text></View>
                  <View className="flex-1 justify-center"><Text className="text-gray-700 font-extrabold text-xs uppercase tracking-wide">Persyaratan & Deskripsi</Text></View>
                  <View className="w-[200px] justify-center"><Text className="text-gray-700 font-extrabold text-xs uppercase tracking-wide">Berkas Bukti</Text></View>
                  <View className="w-[140px] justify-center"><Text className="text-gray-700 font-extrabold text-xs uppercase tracking-wide">Status</Text></View>
                  <View className="w-[180px] justify-center items-center"><Text className="text-gray-700 font-extrabold text-xs uppercase tracking-wide text-center">Tindakan / Aksi</Text></View>
                </View>
                
                {/* Table Body */}
                <View className="border-x border-b border-gray-200 rounded-b-2xl overflow-hidden bg-white">
                  {reqs.map((r, index) => {
                    const isCompleted = r.status === "verified";
                    const isPendingVerification = r.status === "pending_verification";
                    const isRejected = r.status === "rejected";
                    const isUploading = r.status === "uploading";
                    const isPendingUpload = r.status === "pending_upload";

                    return (
                      <View key={r.id} className={`flex-row items-center py-4 px-4 border-b border-gray-100 ${index % 2 === 1 ? 'bg-slate-50/20' : ''}`}>
                        
                        {/* No */}
                        <View className="w-[50px]">
                          <Text className="text-navy font-bold text-sm">{r.id}</Text>
                        </View>
                        
                        {/* Persyaratan & Deskripsi */}
                        <View className="flex-1 pr-6 gap-0.5">
                          <Text className="font-bold text-navy text-sm md:text-base">{r.title}</Text>
                          <Text className="text-gray-500 text-xs leading-relaxed">{r.desc}</Text>
                        </View>
                        
                        {/* Berkas Bukti */}
                        <View className="w-[200px] pr-4">
                          {r.fileName ? (
                            <View className="flex-row items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg self-start">
                              <Ionicons name="document-text-outline" size={13} color="#64748b" />
                              <Text className="text-slate-600 text-xs font-semibold max-w-[140px]" numberOfLines={1}>{r.fileName}</Text>
                            </View>
                          ) : (
                            <Text className="text-gray-400 text-xs italic">- Belum ada berkas -</Text>
                          )}
                        </View>
                        
                        {/* Status */}
                        <View className="w-[140px]">
                          {isCompleted && (
                            <View className="bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 self-start">
                              <Text className="text-green-700 font-bold text-[10px]">DISETUJUI</Text>
                            </View>
                          )}
                          {isPendingVerification && (
                            <View className="bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 self-start">
                              <Text className="text-amber-700 font-bold text-[10px]">PERLU VERIFIKASI</Text>
                            </View>
                          )}
                          {isRejected && (
                            <View className="bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 self-start">
                              <Text className="text-red-700 font-bold text-[10px]">DITOLAK</Text>
                            </View>
                          )}
                          {(isPendingUpload || isUploading) && (
                            <View className="bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5 self-start">
                              <Text className="text-gray-500 font-bold text-[10px]">{isUploading ? "SEDANG UNGGAH" : "BELUM DIUNGGAH"}</Text>
                            </View>
                          )}
                        </View>
                        
                        {/* Tindakan */}
                        <View className="w-[180px] items-center">
                          {isPendingVerification && (
                            <View className="flex-row gap-2 justify-center">
                              {hasAuthority ? (
                                <>
                                  <Pressable 
                                    onPress={() => handleApprove(r.id)}
                                    className="bg-green-600 hover:bg-green-700 p-2 rounded-xl flex-row items-center gap-1 active:scale-95 transition-all"
                                  >
                                    <Ionicons name="checkmark" size={12} color="#fff" />
                                    <Text className="text-white font-extrabold text-[10px] px-1">Setujui</Text>
                                  </Pressable>
                                  <Pressable 
                                    onPress={() => handleReject(r.id)}
                                    className="bg-red-600 hover:bg-red-700 p-2 rounded-xl flex-row items-center gap-1 active:scale-95 transition-all"
                                  >
                                    <Ionicons name="close" size={12} color="#fff" />
                                    <Text className="text-white font-extrabold text-[10px] px-1">Tolak</Text>
                                  </Pressable>
                                </>
                              ) : (
                                <View className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 flex-row items-center gap-1">
                                  <Ionicons name="lock-closed" size={11} color="#94A3B8" />
                                  <Text className="text-slate-500 font-bold text-[10px]">Terkunci</Text>
                                </View>
                              )}
                            </View>
                          )}

                          {isCompleted && r.id > 1 && hasAuthority && (
                            <Pressable 
                              onPress={() => handleReject(r.id)}
                              className="border border-red-200 hover:bg-red-50/50 px-3 py-1.5 rounded-xl flex-row items-center justify-center gap-1 active:scale-95 transition-all"
                            >
                              <Ionicons name="close-circle-outline" size={12} color="#EF4444" />
                              <Text className="text-red-600 font-extrabold text-[10px]">Batalkan</Text>
                            </Pressable>
                          )}
                          
                          {isRejected && hasAuthority && (
                            <Pressable 
                              onPress={() => handleApprove(r.id)}
                              className="border border-green-200 hover:bg-green-50/50 px-3 py-1.5 rounded-xl flex-row items-center justify-center gap-1 active:scale-95 transition-all"
                            >
                              <Ionicons name="checkmark-circle-outline" size={12} color="#10B981" />
                              <Text className="text-green-600 font-extrabold text-[10px]">Setujui</Text>
                            </Pressable>
                          )}

                          {!isPendingVerification && (!hasAuthority || (r.id === 1 && isCompleted)) && (
                            <Text className="text-gray-400 text-xs">-</Text>
                          )}
                        </View>

                      </View>
                    );
                  })}
                </View>

              </View>
            </ScrollView>
          </Animated.View>
          
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
