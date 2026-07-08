import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ProfilAlumniScreen() {
  const router = useRouter();
  const { user, updateAlumniProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // State Form Profil
  const [nama, setNama] = useState(user?.alumni_profile?.nama || "Alumni Demo");
  const [nim, setNim] = useState(user?.alumni_profile?.nim || "1902001");
  const [prodi, setProdi] = useState(user?.alumni_profile?.prodi || "Teknologi Informasi");
  const [angkatan, setAngkatan] = useState("2019");
  const [email, setEmail] = useState(user?.email || "alumni@unuha.ac.id");
  const [telepon, setTelepon] = useState("081234567890");
  const [keahlian, setKeahlian] = useState("React Native, Javascript, UI Design");
  const [ringkasan, setRingkasan] = useState("Lulusan Teknologi Informasi Universitas Nurul Huda yang berminat tinggi dalam pengembangan mobile dan web application.");

  const handleSave = () => {
    setLoading(true);
    setTimeout(async () => {
      await updateAlumniProfile({
        nama,
        nim,
        prodi,
      });
      setLoading(false);
      
      if (Platform.OS === 'web') {
        alert("Profil alumni berhasil diperbarui!");
        router.push("/dashboard");
      } else {
        Alert.alert("Sukses", "Profil alumni berhasil diperbarui!", [
          { text: "OK", onPress: () => router.push("/dashboard") }
        ]);
      }
    }, 1200);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 max-w-[1000px] w-full mx-auto px-4 py-8 md:p-8">
          
          {/* Tombol Kembali */}
          <Pressable 
            onPress={() => router.push("/dashboard")}
            className="flex-row items-center gap-2 mb-6 self-start hover:opacity-70"
          >
            <Ionicons name="arrow-back" size={20} color={Brand.navy} />
            <Text className="text-navy font-semibold text-sm md:text-base">Kembali ke Dashboard</Text>
          </Pressable>

          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            className="flex-col md:flex-row gap-8"
          >
            {/* Panel Kiri: Foto & Ringkasan */}
            <View className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm items-center self-stretch md:self-start">
              <View className="w-28 h-28 rounded-full bg-navy/10 items-center justify-center mb-4 relative shadow-inner">
                <Text className="text-navy font-black text-4xl">{nama.charAt(0)}</Text>
                <Pressable className="absolute right-0 bottom-0 w-8 h-8 bg-orange rounded-full items-center justify-center border-2 border-white shadow-md active:scale-90 transition-all">
                  <Ionicons name="camera" size={16} color="#fff" />
                </Pressable>
              </View>
              <Text className="font-extrabold text-xl text-navy text-center mb-1">{nama}</Text>
              <Text className="text-gray-400 text-sm text-center mb-4">NIM. {nim}</Text>
              
              <View className="w-full bg-navy/5 p-4 rounded-2xl border border-navy/10 mt-2">
                <Text className="text-navy font-bold text-center text-xs tracking-wider uppercase mb-1">Status Tracer Study</Text>
                <Text className="text-red-500 font-extrabold text-center text-sm">Belum Diisi</Text>
              </View>
            </View>

            {/* Panel Kanan: Form Data Lengkap */}
            <View className="flex-[2] bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm gap-6">
              <Text className="text-2xl font-black text-navy mb-2">Profil Alumni</Text>

              <View className="gap-4">
                {/* Baris 1: Nama & NIM */}
                <View className="flex-col md:flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">Nama Lengkap</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={nama}
                        onChangeText={setNama}
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">NIM</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="card-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={nim}
                        onChangeText={setNim}
                      />
                    </View>
                  </View>
                </View>

                {/* Baris 2: Prodi & Angkatan */}
                <View className="flex-col md:flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">Program Studi</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="school-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={prodi}
                        onChangeText={setProdi}
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">Tahun Angkatan / Lulus</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={angkatan}
                        onChangeText={setAngkatan}
                      />
                    </View>
                  </View>
                </View>

                {/* Baris 3: Email & Telepon */}
                <View className="flex-col md:flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">Alamat Email</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-bold mb-1.5 text-sm">No. Telepon / WhatsApp</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        value={telepon}
                        onChangeText={setTelepon}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>

                {/* Keahlian */}
                <View>
                  <Text className="text-gray-700 font-bold mb-1.5 text-sm">Keahlian Utama / Skills</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                    <Ionicons name="construct-outline" size={18} color="#9CA3AF" />
                    <TextInput 
                      className="flex-1 ml-3 text-gray-900 outline-none text-base"
                      placeholder="Contoh: PHP, React, Accounting"
                      placeholderTextColor="#9CA3AF"
                      value={keahlian}
                      onChangeText={setKeahlian}
                    />
                  </View>
                </View>

                {/* Ringkasan Profil */}
                <View>
                  <Text className="text-gray-700 font-bold mb-1.5 text-sm">Ringkasan Karir / Bio Singkat</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                    <TextInput 
                      className="w-full text-gray-900 outline-none text-base min-h-[80px]"
                      placeholder="Tuliskan tentang diri Anda..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      value={ringkasan}
                      onChangeText={setRingkasan}
                    />
                  </View>
                </View>

                {/* Tombol Simpan */}
                <Pressable 
                  onPress={handleSave}
                  disabled={loading}
                  className={`mt-4 rounded-xl py-3.5 items-center justify-center flex-row gap-2 ${loading ? 'bg-navy/70' : 'bg-navy hover:opacity-90 active:scale-[0.98] transition-all'}`}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text className="text-white font-bold text-base">Simpan Perubahan</Text>
                      <Ionicons name="save-outline" size={18} color="#fff" />
                    </>
                  )}
                </Pressable>

              </View>
            </View>
          </Animated.View>

        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
