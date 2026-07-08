import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Lowongan } from "@/services/mock/lowongan";
import { Brand, StatusColors } from "@/constants/theme";

interface JobCardProps {
  job: Lowongan;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  // Badge styling by type
  const badgeMap: Record<string, { bg: string; text: string; label: string }> = {
    fulltime:    { bg: StatusColors.infoBg,    text: StatusColors.info,    label: "Full-Time" },
    contract:    { bg: StatusColors.warningBg,  text: StatusColors.warning,  label: "Kontrak" },
    internship:  { bg: StatusColors.successBg,  text: StatusColors.success,  label: "Magang" },
    remote:      { bg: "#F3E8FF",              text: "#9333EA",             label: "Remote" },
  };
  const badge = badgeMap[job.tipe] || { bg: "#E5E7EB", text: "#4B5563", label: job.tipe };

  return (
    <Pressable
      onPress={() => router.push(`/lowongan/${job.id}`)}
      className="group bg-white rounded-3xl p-7 shadow-lg shadow-gray-200/50 border border-gray-100/80 flex-1 min-w-[300px] max-w-[400px] hover:-translate-y-2 hover:shadow-2xl hover:border-orange/20 active:scale-[0.98] transition-all duration-300"
    >
      {/* Header */}
      <View className="flex-row items-start gap-4 mb-5">
        <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Ionicons name="business" size={28} color={Brand.navy} />
        </View>
        <View className="flex-1 flex-shrink">
          <Text className="text-gray-900 font-bold text-lg leading-tight mb-1" numberOfLines={1}>
            {job.judul}
          </Text>
          <Text className="text-orange font-semibold text-sm" numberOfLines={1}>
            {job.perusahaan}
          </Text>
        </View>
      </View>

      {/* Meta tags */}
      <View className="flex-row flex-wrap gap-2.5 mb-5">
        <View className="bg-gray-50 px-3 py-1.5 rounded-lg flex-row items-center gap-1.5">
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-semibold">{job.lokasi}</Text>
        </View>
        <View className="px-3 py-1.5 rounded-lg flex-row items-center" style={{ backgroundColor: badge.bg }}>
          <Text style={{ color: badge.text, fontSize: 12, fontWeight: "700" }}>{badge.label}</Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-gray-500 text-sm leading-relaxed mb-6" numberOfLines={2}>
        {job.deskripsi}
      </Text>

      {/* Footer */}
      <View className="pt-5 border-t border-gray-100 flex-row justify-between items-center">
        <Text className="text-gray-400 text-xs font-medium">
          {new Date(job.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </Text>
        <View className="flex-row items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300">
          <Text className="text-orange font-bold text-sm">Detail</Text>
          <Ionicons name="arrow-forward" size={14} color={Brand.orange} />
        </View>
      </View>
    </Pressable>
  );
}
