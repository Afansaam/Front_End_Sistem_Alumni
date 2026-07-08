import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/cards/JobCard";
import { mockLowongan } from "@/services/mock/lowongan";
import { Brand } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function LowonganListScreen() {
  const [selectedFakultas, setSelectedFakultas] = useState<string>("Semua");

  const categories = [
    { label: "Semua Bidang", value: "Semua" },
    { label: "Agama Islam", value: "Fakultas Agama Islam" },
    { label: "Ilmu Kependidikan", value: "Fakultas Ilmu Kependidikan" },
    { label: "Sains & Teknologi", value: "Fakultas Sains & Teknologi" },
  ];

  const filteredJobs = mockLowongan.filter((job) => {
    if (selectedFakultas === "Semua") return true;
    return job.fakultas === selectedFakultas;
  });

  return (
    <View className="flex-1 bg-white">
      <Navbar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-12 md:py-20 items-center bg-gray-50 min-h-[70vh]">
          <View className="max-w-[1200px] w-full">
            <View className="mb-8 items-center">
              <Text className="text-navy text-3xl md:text-4xl font-extrabold text-center mb-3">
                Jelajahi Lowongan Kerja
              </Text>
              <View className="w-16 h-1 rounded-full bg-orange mb-4" />
              <Text className="text-gray-500 text-center max-w-[560px] text-base leading-relaxed">
                Temukan karir impian Anda. Berikut adalah daftar lowongan kerja terbaru dari perusahaan mitra Universitas Nurul Huda.
              </Text>
            </View>

            {/* Category Tabs */}
            <View className="flex-row flex-wrap justify-center gap-2 mb-10 w-full px-4">
              {categories.map((cat) => {
                const isActive = selectedFakultas === cat.value;
                return (
                  <Pressable
                    key={cat.value}
                    onPress={() => setSelectedFakultas(cat.value)}
                    className={`px-5 py-2.5 rounded-full border transition-all ${
                      isActive
                        ? "bg-navy border-navy text-white shadow-md shadow-navy/10"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95"
                    }`}
                  >
                    <Text className={`font-bold text-sm ${isActive ? "text-white" : "text-gray-600"}`}>
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex-row flex-wrap justify-center gap-5">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <View className="py-16 items-center justify-center w-full">
                  <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 font-bold text-base mt-4">
                    Belum ada lowongan untuk bidang ini.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
