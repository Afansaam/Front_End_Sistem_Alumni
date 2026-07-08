import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LupaPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Email wajib diisi");
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sukses", "Tautan reset password telah dikirim ke email Anda.", [
        { text: "OK", onPress: () => router.push("/masuk") }
      ]);
    }, 1500);
  };

  return (
    <View className="flex-1 bg-gray-50 flex-row">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center px-5 py-10 md:py-16 w-full">
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200).springify()}
            className="w-full max-w-[400px] bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            
            <Pressable 
              onPress={() => router.push("/masuk")}
              className="flex-row items-center gap-2 mb-4 md:mb-5 self-start hover:opacity-70"
            >
              <Ionicons name="arrow-back" size={20} color={Brand.navy} />
              <Text className="text-navy font-semibold text-sm">Kembali ke Halaman Masuk</Text>
            </Pressable>

            <View className="mb-5 md:mb-6">
              <Text className="text-xl md:text-2xl font-extrabold text-navy mb-2">Lupa Password</Text>
              <Text className="text-gray-500 leading-relaxed text-xs">
                Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-gray-700 font-bold mb-1.5 text-xs">Alamat Email</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput 
                    className="flex-1 ml-3 text-gray-900 outline-none text-sm"
                    placeholder="email@contoh.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <Pressable 
                onPress={handleResetPassword}
                disabled={loading}
                className={`mt-2 md:mt-3 rounded-xl py-2.5 md:py-3 items-center justify-center flex-row gap-2 ${loading ? 'bg-navy/70' : 'bg-navy hover:opacity-90 active:scale-[0.98] transition-all'}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-sm">Kirim Tautan</Text>
                    <Ionicons name="send-outline" size={16} color="#fff" />
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
