import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";

export default function LokasiKampusScreen() {
  return (
    <View className="flex-1 bg-white">
      <Navbar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="min-h-[70vh] px-6 py-20 items-center justify-center bg-gray-50">
           <Ionicons name="map-outline" size={80} color={Brand.orange} />
           <Text className="text-navy text-3xl font-extrabold mt-6 mb-3 text-center">Lokasi Kampus</Text>
           <Text className="text-gray-500 text-center max-w-[500px]">Fitur pemetaan lokasi kampus terintegrasi sedang dikembangkan. Silakan hubungi pusat layanan karir untuk info lebih lanjut.</Text>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
