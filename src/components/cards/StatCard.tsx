import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  iconName,
  color = Brand.navy,
  bgColor = "#DBEAFE",
}: StatCardProps) {
  return (
    <View className="bg-white rounded-3xl p-7 flex-1 min-w-[240px] shadow-lg shadow-gray-200/50 border border-gray-100/80 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 cursor-pointer group">
      <View className="flex-row items-center gap-5">
        <View
          className="w-16 h-16 rounded-2xl items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: bgColor }}
        >
          <Ionicons name={iconName} size={30} color={color} />
        </View>
        <View className="flex-shrink">
          <Text className="text-gray-400 text-xs font-bold tracking-wider mb-1 uppercase">{title}</Text>
          <Text className="text-gray-900 text-4xl font-extrabold tracking-tight">{value}</Text>
        </View>
      </View>
    </View>
  );
}
