import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "NIM/NIDN/Email dan Password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: identifier, password });
      if (response.success) {
        // Redirect handled inside AuthProvider based on role
      } else {
        Alert.alert("Gagal", "Kredensial tidak valid");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 flex-row">
      {/* Left Panel - Illustration (Hidden on Mobile) */}
      <Animated.View 
        entering={FadeInLeft.duration(600)}
        className="hidden md:flex flex-1 bg-navy items-center justify-center p-12"
      >
        <View className="w-full max-w-[500px]">
          <Text className="text-white text-4xl font-extrabold mb-4 leading-tight">
            Selamat Datang Kembali di Pusat Karir
          </Text>
          <Text className="text-blue-100 text-lg leading-relaxed mb-8">
            Akses sistem Tracer Study terpadu, temukan lowongan pekerjaan terbaik, dan bangun jaringan alumni Universitas Nurul Huda.
          </Text>
          
          <View className="bg-white/10 p-6 rounded-2xl border border-white/20 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-orange items-center justify-center">
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Akses Aman</Text>
              <Text className="text-blue-100">Gunakan kredensial akademik Anda untuk masuk dengan aman.</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Right Panel - Login Form */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center px-5 py-10 md:py-16 w-full">
          
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200).springify()}
            className="w-full max-w-[400px] bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            
            {/* Back to Home */}
            <Pressable 
              onPress={() => router.push("/")}
              className="flex-row items-center gap-2 mb-4 md:mb-8 self-start hover:opacity-70"
            >
              <Ionicons name="arrow-back" size={20} color={Brand.navy} />
              <Text className="text-navy font-semibold">Kembali ke Beranda</Text>
            </Pressable>

            <View className="mb-5 md:mb-6">
              <Text className="text-xl md:text-2xl font-extrabold text-navy mb-1">Masuk</Text>
              <View className="flex-row flex-wrap gap-1 mb-2">
                <Text className="text-gray-500 text-sm">Belum punya akun?</Text>
                <Pressable onPress={() => router.push("/daftar")}>
                  <Text className="text-orange font-bold text-sm hover:underline">Daftar Sekarang</Text>
                </Pressable>
              </View>
              <Text className="text-gray-500 text-xs">Silakan masuk menggunakan NIM / NIDN atau Email Anda.</Text>
            </View>

            {/* Form Fields */}
            <View className="gap-3 md:gap-4">
              
              <View>
                <Text className="text-gray-700 font-bold mb-2">NIM / NIDN / Email</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput 
                    className="flex-1 ml-3 text-gray-900 outline-none text-sm"
                    placeholder="Masukkan identitas Anda"
                    placeholderTextColor="#9CA3AF"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View>
                <Text className="text-gray-700 font-bold mb-2">Password</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput 
                    className="flex-1 mx-3 text-gray-900 outline-none text-sm"
                    placeholder="Masukkan password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row justify-end">
                <Pressable onPress={() => router.push("/lupa-password")}>
                  <Text className="text-orange font-semibold hover:opacity-80">Lupa Password?</Text>
                </Pressable>
              </View>

              {/* Submit Button */}
              <Pressable 
                onPress={handleLogin}
                disabled={loading}
                className={`mt-2 md:mt-3 rounded-xl py-2.5 md:py-3 items-center justify-center flex-row gap-2 ${loading ? 'bg-navy/70' : 'bg-navy hover:opacity-90 active:scale-[0.98] transition-all'}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg">Masuk ke Sistem</Text>
                    <Ionicons name="log-in-outline" size={20} color="#fff" />
                  </>
                )}
              </Pressable>
             </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
