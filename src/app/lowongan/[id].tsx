import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Components
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Mock Data
import { mockLowongan } from "@/services/mock/lowongan";
import { Brand, StatusColors } from "@/constants/theme";

export default function LowonganDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Find job in mock data
  const job = mockLowongan.find(j => j.id.toString() === id);

  if (!job) {
    return (
      <View className="flex-1 bg-gray-50">
        <Navbar />
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-900 text-xl font-bold mt-4">Lowongan Tidak Ditemukan</Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Lowongan dengan ID {id} tidak ada atau telah dihapus.
          </Text>
          <Pressable 
            onPress={() => router.back()}
            className="bg-navy px-6 py-3 rounded-lg flex-row items-center gap-2"
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text className="text-white font-semibold">Kembali</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Handle external link
  const handleApply = async () => {
    try {
      const supported = await Linking.canOpenURL(job.link_eksternal);
      if (supported) {
        await Linking.openURL(job.link_eksternal);
      } else {
        alert("Tidak dapat membuka tautan ini.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat membuka tautan.");
    }
  };

  const formatTipe = (tipe: string) => {
    const map: Record<string, string> = {
      fulltime: "Full-Time",
      contract: "Kontrak",
      internship: "Magang",
      remote: "Remote",
    };
    return map[tipe] || tipe;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-10 items-center">
          <View className="max-w-[800px] w-full">
            
            {/* Back Button */}
            <Pressable 
              onPress={() => router.back()}
              className="flex-row items-center gap-2 mb-8 self-start hover:opacity-70"
            >
              <Ionicons name="arrow-back" size={20} color={Brand.navy} />
              <Text className="text-navy font-semibold">Kembali ke Daftar Lowongan</Text>
            </Pressable>

            {/* Job Header Card */}
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
              <View className="flex-row items-start justify-between flex-wrap gap-4 mb-6">
                
                {/* Title & Company */}
                <View className="flex-row items-center gap-4 flex-1 min-w-[250px]">
                  <View className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 items-center justify-center">
                    <Ionicons name="business" size={32} color={Brand.navy} />
                  </View>
                  <View className="flex-shrink">
                    <Text className="text-gray-900 text-2xl font-bold leading-tight mb-1">
                      {job.judul}
                    </Text>
                    <Text className="text-orange font-medium text-lg">
                      {job.perusahaan}
                    </Text>
                  </View>
                </View>

                {/* Apply Button (Desktop) */}
                <Pressable 
                  onPress={handleApply}
                  className="bg-navy px-8 py-4 rounded-xl flex-row items-center gap-2 hidden md:flex hover:opacity-90"
                >
                  <Text className="text-white font-bold text-lg">Lamar Sekarang</Text>
                  <Ionicons name="open-outline" size={20} color="#fff" />
                </Pressable>
              </View>

              {/* Meta info tags */}
              <View className="flex-row flex-wrap gap-4 pt-6 border-t border-gray-100">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                    <Ionicons name="location" size={16} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700 font-medium">{job.lokasi}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                    <Ionicons name="briefcase" size={16} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700 font-medium">{formatTipe(job.tipe)}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center">
                    <Ionicons name="calendar" size={16} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700 font-medium">
                    Dipublikasi: {new Date(job.created_at).toLocaleDateString('id-ID')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Job Description */}
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <Text className="text-navy text-xl font-bold mb-6">Deskripsi Pekerjaan</Text>
              <Text className="text-gray-700 text-base leading-relaxed">
                {job.deskripsi}
              </Text>
            </View>

            {/* Apply Button (Mobile) */}
            <Pressable 
              onPress={handleApply}
              className="bg-navy px-6 py-4 rounded-xl flex-row items-center justify-center gap-2 md:hidden mb-8 shadow-sm"
            >
              <Text className="text-white font-bold text-lg">Lamar Sekarang</Text>
              <Ionicons name="open-outline" size={20} color="#fff" />
            </Pressable>

          </View>
        </View>
        
        <Footer />
      </ScrollView>
    </View>
  );
}
