import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Brand } from "@/constants/theme";

export function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardRedirect = () => {
    switch (role) {
      case "alumni":
        router.push("/dashboard");
        break;
      case "admin":
        router.push("/(admin)/admin");
        break;
      case "super_admin":
        router.push("/(superadmin)/superadmin");
        break;
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/statistik", label: "Statistik" },
    { href: "/lowongan", label: "Lowongan" },
    { href: "/berita", label: "Berita" },
    { href: "/lokasi-kampus", label: "Lokasi Kampus" },
  ] as const;

  return (
    <View className="w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 px-6 py-3.5 z-50 shadow-sm">
      <View className="flex-row items-center justify-between max-w-[1400px] w-full mx-auto">
        {/* Logo / Title */}
        <Link href="/" asChild>
          <Pressable className="flex-row items-center hover:opacity-80 transition-opacity">
            <View className="w-10 h-10 rounded-xl bg-navy items-center justify-center mr-3 shadow-md shadow-navy/20">
              <Text className="text-white font-extrabold text-xl">U</Text>
            </View>
            <View>
              <Text className="text-navy font-extrabold text-lg leading-tight tracking-tight">Pusat Karir</Text>
              <Text className="text-gray-400 text-xs font-semibold tracking-wide">UNUHA</Text>
            </View>
          </Pressable>
        </Link>

        {/* Desktop Navigation Links */}
        {Platform.OS === "web" && (
          <View className="hidden md:flex flex-row items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} asChild>
                <Pressable className="px-4 py-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <Text className="text-gray-600 font-semibold text-sm hover:text-navy transition-colors">{link.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}

        {/* Auth Buttons */}
        <View className="flex-row items-center gap-2">
          <View className="hidden md:flex flex-row items-center gap-2">
            {isAuthenticated ? (
              <>
                <Pressable
                  onPress={handleDashboardRedirect}
                  className="bg-navy px-5 py-2.5 rounded-xl flex-row items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-navy/20"
                >
                  <Ionicons name="grid" size={16} color="#fff" />
                  <Text className="text-white font-bold text-sm">Dashboard</Text>
                </Pressable>
                <Pressable
                  onPress={logout}
                  className="px-4 py-2.5 rounded-xl flex-row items-center gap-2 hover:bg-red-50 transition-colors"
                >
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text className="text-red-500 font-bold text-sm">Keluar</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Link href="/masuk" asChild>
                  <Pressable className="px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <Text className="text-navy font-bold text-sm">Masuk</Text>
                  </Pressable>
                </Link>
                <Link href="/daftar" asChild>
                  <Pressable className="bg-orange px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-orange/20">
                    <Text className="text-white font-bold text-sm">Daftar</Text>
                  </Pressable>
                </Link>
              </>
            )}
          </View>

          {/* Mobile menu toggle */}
          {Platform.OS === "web" && (
            <Pressable
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Ionicons name={mobileMenuOpen ? "close" : "menu"} size={24} color={Brand.navy} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Mobile Menu */}
      {mobileMenuOpen && Platform.OS === "web" && (
        <View className="md:hidden mt-3 pt-3 border-t border-gray-100 gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} asChild>
              <Pressable
                className="py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                onPress={() => setMobileMenuOpen(false)}
              >
                <Text className="text-gray-700 font-semibold">{link.label}</Text>
              </Pressable>
            </Link>
          ))}
          
          <View className="h-px bg-gray-100 my-2 mx-2" />
          
          {isAuthenticated ? (
            <View className="flex-col gap-2 mt-1">
              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
                className="bg-navy py-3.5 px-4 rounded-xl flex-row items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Ionicons name="grid" size={16} color="#fff" />
                <Text className="text-white font-bold text-sm">Dashboard</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="py-3.5 px-4 rounded-xl border border-red-100 bg-red-50 flex-row items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                <Text className="text-red-500 font-bold text-sm">Keluar</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row gap-2 mt-1">
              <Link href="/masuk" asChild>
                <Pressable className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 items-center hover:bg-gray-50 active:scale-[0.98] transition-all" onPress={() => setMobileMenuOpen(false)}>
                  <Text className="text-navy font-bold text-sm">Masuk</Text>
                </Pressable>
              </Link>
              <Link href="/daftar" asChild>
                <Pressable className="flex-1 bg-orange py-3.5 px-4 rounded-xl items-center hover:opacity-90 active:scale-[0.98] transition-all" onPress={() => setMobileMenuOpen(false)}>
                  <Text className="text-white font-bold text-sm">Daftar</Text>
                </Pressable>
              </Link>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
