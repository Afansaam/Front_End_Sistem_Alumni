import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/cards/StatCard";
import { mockStatistik } from "@/services/mock/statistik";
import { Brand } from "@/constants/theme";

export default function StatistikScreen() {
  return (
    <View className="flex-1 bg-white">
      <Navbar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-12 md:py-20 items-center bg-white min-h-[70vh]">
          <View className="max-w-[1200px] w-full">
            <View className="mb-12 items-center">
              <Text className="text-navy text-3xl md:text-4xl font-extrabold text-center mb-3">
                Statistik Alumni & Karir
              </Text>
              <View className="w-16 h-1 rounded-full bg-orange mb-4" />
              <Text className="text-gray-500 text-center max-w-[560px] text-base leading-relaxed">
                Transparansi data serapan lulusan kami ke dunia kerja profesional sebagai tolok ukur kualitas pendidikan.
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-5">
              <StatCard title="Total Alumni" value={mockStatistik.total_alumni.toLocaleString()} iconName="people" color={Brand.navy} bgColor="#E0E7FF" />
              <StatCard title="Alumni Bekerja" value={mockStatistik.alumni_bekerja.toLocaleString()} iconName="briefcase" color={Brand.orange} bgColor="#FFEDD5" />
              <StatCard title="Perusahaan Mitra" value={mockStatistik.perusahaan_mitra} iconName="business" color="#10B981" bgColor="#D1FAE5" />
              <StatCard title="Lowongan Aktif" value={mockStatistik.lowongan_aktif} iconName="megaphone" color="#8B5CF6" bgColor="#EDE9FE" />
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
