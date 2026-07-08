import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";

export function Footer() {
  return (
    <View className="w-full bg-navy px-6 py-8 md:py-10 mt-auto">
      <View className="max-w-[1200px] w-full mx-auto">
        <View className="flex-col md:flex-row justify-between gap-6 md:gap-12 mb-6">

          {/* Brand Info */}
          <View className="flex-1 max-w-[400px]">
            <View className="flex-row items-center mb-3">
              <View className="w-9 h-9 rounded-xl bg-orange items-center justify-center mr-2 shadow-md">
                <Text className="text-white font-extrabold text-base">U</Text>
              </View>
              <View>
                <Text className="text-white font-extrabold text-base leading-tight">Pusat Karir & Alumni</Text>
                <Text className="text-blue-200 text-xs font-semibold">Universitas Nurul Huda</Text>
              </View>
            </View>
            <Text className="text-blue-200/70 text-xs leading-relaxed mb-4">
              Sistem informasi tracer study dan pusat karir terpadu Universitas Nurul Huda.
            </Text>

            {/* Social icons */}
            <View className="flex-row gap-2">
              {(["logo-facebook", "logo-instagram", "logo-linkedin", "logo-youtube"] as const).map((icon) => (
                <View
                  key={icon}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Ionicons name={icon} size={15} color="#93C5FD" />
                </View>
              ))}
            </View>
          </View>

          {/* Quick Links */}
          <View className="flex-col gap-2">
            <Text className="text-white font-bold text-xs mb-2 tracking-wider uppercase">Navigasi</Text>
            {[
              { href: "/statistik", label: "Statistik Alumni", icon: "stats-chart-outline" as const },
              { href: "/lowongan", label: "Lowongan Kerja", icon: "briefcase-outline" as const },
              { href: "/berita", label: "Berita Kampus", icon: "newspaper-outline" as const },
              { href: "/masuk", label: "Masuk Sistem", icon: "log-in-outline" as const },
            ].map((link) => (
              <Link key={link.href} href={link.href as any} asChild>
                <Pressable className="flex-row items-center gap-2 py-0.5 hover:opacity-80 transition-opacity">
                  <Ionicons name={link.icon} size={14} color="#93C5FD" />
                  <Text className="text-blue-200/80 hover:text-white transition-colors text-xs font-medium">{link.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>

          {/* Contact Info */}
          <View className="flex-col gap-2">
            <Text className="text-white font-bold text-xs mb-2 tracking-wider uppercase">Kontak</Text>
            {[
              { icon: "location-outline" as const, text: "Jl. Lintas Timur, OKU Timur, Sumsel" },
              { icon: "call-outline" as const,     text: "(0711) 123456" },
              { icon: "mail-outline" as const,     text: "pusatkarir@unuha.ac.id" },
            ].map((item, i) => (
              <View key={i} className="flex-row items-center gap-2 py-0.5">
                <Ionicons name={item.icon} size={14} color="#93C5FD" />
                <Text className="text-blue-200/80 text-xs font-medium">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Divider + Copyright */}
        <View className="pt-4 border-t border-white/10 flex-col md:flex-row justify-between items-center gap-2">
          <Text className="text-blue-300/40 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Universitas Nurul Huda. All rights reserved.
          </Text>
          <Text className="text-blue-300/40 text-[10px] text-center md:text-right">
            Expo & React Native
          </Text>
        </View>
      </View>
    </View>
  );
}
