import React from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const adminFakultas = user?.fakultas || "Pusat";

  // Data statistik dinamis berdasarkan fakultas admin
  const getStats = () => {
    switch (adminFakultas) {
      case "Fakultas Sains & Teknologi":
        return { alumni: 645, tracer: "84%", loker: 5, mitra: 6 };
      case "Fakultas Agama Islam":
        return { alumni: 389, tracer: "72%", loker: 2, mitra: 4 };
      case "Fakultas Ilmu Kependidikan":
        return { alumni: 856, tracer: "76%", loker: 2, mitra: 5 };
      default: // Pusat
        return { alumni: 1890, tracer: "78%", loker: 9, mitra: 15 };
    }
  };

  const stats = getStats();

  const adminSystems = [
    {
      title: "Validasi Berkas Ijazah",
      desc: "Verifikasi surat bebas perpustakaan, pelunasan keuangan, dan tugas akhir mahasiswa.",
      icon: "document-text-outline",
      href: "/(admin)/admin/tracer-study" as const,
      color: "bg-orange/10 text-orange border-orange/20",
      iconColor: Brand.orange,
    },
    {
      title: "Kelola Lowongan Kerja",
      desc: "Publikasikan lowongan kerja baru, edit, atau nonaktifkan loker dari perusahaan mitra.",
      icon: "briefcase-outline",
      href: "/(admin)/admin/lowongan" as const,
      color: "bg-blue-50 text-navy border-blue-100",
      iconColor: Brand.navy,
    },
    {
      title: "Kemitraan Perusahaan",
      desc: "Kelola data industri mitra, status MoU, dan hak akses portal lowongan kerja mitra.",
      icon: "business-outline",
      href: "/(admin)/admin/mitra" as const,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconColor: "#10B981",
    },
    {
      title: "Berita & Pengumuman",
      desc: "Buat info karir, tips wawancara, jadwal pelatihan, atau pengumuman penting akademik.",
      icon: "newspaper-outline",
      href: "/(admin)/admin/berita" as const,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      iconColor: "#8B5CF6",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-8 md:p-8">
          
          {/* Welcome Banner */}
          <Animated.View 
            entering={FadeInUp.duration(600).springify()}
            className="bg-navy rounded-3xl p-6 md:p-10 mb-8 shadow-xl shadow-navy/20 relative overflow-hidden"
          >
            {/* Background Decorative Pattern */}
            <View className="absolute right-0 top-0 bottom-0 w-1/3 bg-orange/10 rounded-l-full transform translate-x-12 scale-150 pointer-events-none" />
            
            <View className="flex-1">
              <Text className="text-orange font-bold text-sm tracking-wider uppercase mb-2">Panel Administrasi</Text>
              <Text className="text-white text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
                {adminFakultas === "Pusat" ? "Dashboard Admin Pusat UNUHA" : `Admin ${adminFakultas}`}
              </Text>
              <Text className="text-blue-100 text-sm md:text-base max-w-[700px] leading-relaxed">
                Portal manajemen karir dan pelacakan alumni terintegrasi. Kelola verifikasi berkas ijazah, publikasi lowongan kerja, kemitraan, serta publikasi berita kampus.
              </Text>
            </View>
          </Animated.View>

          {/* Stats Summary Cards */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(150).springify()}
            className="flex-row flex-wrap gap-4 mb-8 w-full"
          >
            {/* Stat 1: Total Alumni */}
            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-navy/5 rounded-xl items-center justify-center">
                <Ionicons name="people" size={24} color={Brand.navy} />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Alumni</Text>
                <Text className="text-navy font-black text-xl mt-0.5">{stats.alumni}</Text>
              </View>
            </View>

            {/* Stat 2: Tracer Study Rate */}
            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-orange/10 rounded-xl items-center justify-center">
                <Ionicons name="stats-chart" size={24} color={Brand.orange} />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tracer Study Terisi</Text>
                <Text className="text-orange font-black text-xl mt-0.5">{stats.tracer}</Text>
              </View>
            </View>

            {/* Stat 3: Lowongan Aktif */}
            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center">
                <Ionicons name="briefcase" size={24} color="#10B981" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Lowongan Aktif</Text>
                <Text className="text-green-600 font-black text-xl mt-0.5">{stats.loker}</Text>
              </View>
            </View>

            {/* Stat 4: Mitra Industri */}
            <View className="flex-1 min-w-[220px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-4">
              <View className="w-12 h-12 bg-purple-50 rounded-xl items-center justify-center">
                <Ionicons name="business" size={24} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">Mitra Kerjasama</Text>
                <Text className="text-purple-600 font-black text-xl mt-0.5">{stats.mitra}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Section: System Modules */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(250).springify()}
            className="gap-4 mb-4 w-full"
          >
            <Text className="text-xl font-black text-navy mb-2">Modul Sistem Administrasi</Text>
            
            <View className="flex-row flex-wrap gap-6">
              {adminSystems.map((sys, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => router.push(sys.href)}
                  className="flex-1 min-w-[280px] md:min-w-[340px] bg-white border border-gray-100 hover:border-navy/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex-col justify-between gap-4"
                >
                  <View className="gap-3">
                    <View className={`w-12 h-12 rounded-2xl items-center justify-center border ${sys.color.split(" ")[0]} ${sys.color.split(" ")[2]}`}>
                      <Ionicons name={sys.icon as any} size={22} color={sys.iconColor} />
                    </View>
                    <Text className="text-gray-900 font-extrabold text-base md:text-lg">{sys.title}</Text>
                    <Text className="text-gray-500 text-xs md:text-sm leading-relaxed">{sys.desc}</Text>
                  </View>
                  
                  <View className="flex-row items-center gap-1.5 self-start mt-2">
                    <Text className="text-orange font-bold text-xs">Buka Modul</Text>
                    <Ionicons name="arrow-forward" size={14} color={Brand.orange} />
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
