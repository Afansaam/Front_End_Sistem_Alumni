import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Brand } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";

const FAKULTAS_DATA = [
  {
    nama: "Fakultas Agama Islam",
    prodi: [
      "Pendidikan Agama Islam",
      "Pendidikan guru Ibtida Iyah"
    ]
  },
  {
    nama: "Fakultas Ilmu Kependidikan",
    prodi: [
      "pendidikan fisika",
      "pendidikan bahasa dan sasatra indonesia",
      "pendidikan bahasa inggris",
      "pendidikan ekonomi",
      "pendidikan teknologi informasi"
    ]
  },
  {
    nama: "Fakultas Sains & Teknologi",
    prodi: [
      "Informatika",
      "Matematika",
      "Sains Pertanian"
    ]
  }
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    fakultas: "",
    prodi: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fakultasOpen, setFakultasOpen] = useState(false);
  const [prodiOpen, setProdiOpen] = useState(false);

  const handleRegister = async () => {
    if (
      !formData.nim ||
      !formData.nama ||
      !formData.email ||
      !formData.password ||
      !formData.fakultas ||
      !formData.prodi
    ) {
      Alert.alert("Error", "Semua kolom wajib diisi termasuk Fakultas dan Program Studi");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
        nama: formData.nama,
        nim: formData.nim,
        fakultas: formData.fakultas,
        prodi: formData.prodi,
      });

      if (response.success) {
        // Redirection is handled inside AuthContext
      } else {
        Alert.alert("Gagal", response.message || "Gagal melakukan registrasi");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof typeof formData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <View className="flex-1 bg-white flex-row">
      {/* ── Left Panel – illustration (desktop only) ── */}
      <Animated.View 
        entering={FadeInLeft.duration(600)}
        className="hidden md:flex flex-1 bg-navy items-center justify-center p-14"
      >
        <View className="w-full max-w-[440px]">
          <View className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 items-center justify-center mb-8">
            <Ionicons name="school-outline" size={36} color={Brand.orange} />
          </View>

          <Text className="text-white text-3xl font-extrabold mb-4 leading-tight">
            Bergabung dengan{"\n"}Jaringan Alumni UNUHA
          </Text>
          <Text className="text-gray-300 text-base leading-relaxed mb-10">
            Daftarkan diri Anda untuk mengakses tracer study, mendapatkan
            informasi lowongan kerja, dan terkoneksi dengan sesama lulusan.
          </Text>

          {/* Benefit list */}
          {[
            { icon: "checkmark-circle" as const, text: "Akses tracer study online" },
            { icon: "checkmark-circle" as const, text: "Info lowongan kerja eksklusif" },
            { icon: "checkmark-circle" as const, text: "Profil & CV digital" },
          ].map((b, i) => (
            <View key={i} className="flex-row items-center gap-3 mb-3">
              <Ionicons name={b.icon} size={20} color={Brand.orange} />
              <Text className="text-gray-300 text-sm">{b.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* ── Right Panel – register form ── */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-5 py-10 md:py-16 w-full">
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200).springify()}
            className="w-full max-w-[400px] bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            {/* Back */}
            <Pressable
              onPress={() => router.push("/")}
              className="flex-row items-center gap-2 mb-4 md:mb-8 self-start hover:opacity-70"
            >
              <Ionicons name="arrow-back" size={18} color={Brand.navy} />
              <Text className="text-navy font-semibold text-sm">
                Kembali ke Beranda
              </Text>
            </Pressable>

            {/* Heading */}
            <View className="mb-4 md:mb-5">
              <Text className="text-xl font-extrabold text-gray-900 mb-1">
                Daftar Akun
              </Text>
              <View className="flex-row flex-wrap gap-1 mb-2">
                <Text className="text-gray-500 text-sm">Sudah punya akun?</Text>
                <Pressable onPress={() => router.push("/masuk")}>
                  <Text className="text-orange font-bold text-sm hover:underline">Masuk di sini</Text>
                </Pressable>
              </View>
              <Text className="text-gray-500 text-xs">
                Isi data diri Anda untuk mendaftar sebagai alumni.
              </Text>
            </View>

            {/* ── Form ── */}
            <View className="gap-2.5 md:gap-3">
              {/* NIM */}
              <View>
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  NIM
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="card-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base outline-none"
                    placeholder="Contoh: 1902001"
                    placeholderTextColor="#9CA3AF"
                    value={formData.nim}
                    onChangeText={(t) => update("nim", t)}
                  />
                </View>
              </View>

              {/* Nama */}
              <View>
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Nama Lengkap
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base outline-none"
                    placeholder="Sesuai ijazah"
                    placeholderTextColor="#9CA3AF"
                    value={formData.nama}
                    onChangeText={(t) => update("nama", t)}
                  />
                </View>
              </View>

              {/* Fakultas */}
              <View className="relative z-20">
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Fakultas
                </Text>
                <Pressable
                  onPress={() => {
                    setFakultasOpen(!fakultasOpen);
                    setProdiOpen(false);
                  }}
                  className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 active:bg-gray-100 transition-all"
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="school-outline" size={18} color="#9CA3AF" />
                    <Text className={`flex-1 ml-3 text-base ${formData.fakultas ? "text-gray-900" : "text-gray-400"}`}>
                      {formData.fakultas || "Pilih Fakultas"}
                    </Text>
                  </View>
                  <Ionicons name={fakultasOpen ? "chevron-up" : "chevron-down"} size={18} color="#9CA3AF" />
                </Pressable>
                {fakultasOpen && (
                  <View className="bg-white border border-gray-200 rounded-xl mt-1.5 overflow-hidden shadow-md">
                    {FAKULTAS_DATA.map((item) => (
                      <Pressable
                        key={item.nama}
                        onPress={() => {
                          update("fakultas", item.nama);
                          update("prodi", ""); // reset prodi when fakultas changes
                          setFakultasOpen(false);
                        }}
                        className={`px-4 py-2.5 border-b border-gray-100 active:bg-orange/10 ${
                          formData.fakultas === item.nama ? "bg-orange/5" : ""
                        }`}
                      >
                        <Text className={`text-sm ${formData.fakultas === item.nama ? "text-orange font-bold" : "text-gray-700"}`}>
                          {item.nama}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Program Studi */}
              <View className="relative z-10">
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Program Studi
                </Text>
                <Pressable
                  onPress={() => {
                    if (!formData.fakultas) {
                      Alert.alert("Info", "Pilih Fakultas terlebih dahulu");
                      return;
                    }
                    setProdiOpen(!prodiOpen);
                    setFakultasOpen(false);
                  }}
                  className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 active:bg-gray-100 transition-all"
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="book-outline" size={18} color="#9CA3AF" />
                    <Text className={`flex-1 ml-3 text-base ${formData.prodi ? "text-gray-900" : "text-gray-400"}`}>
                      {formData.prodi || "Pilih Program Studi"}
                    </Text>
                  </View>
                  <Ionicons name={prodiOpen ? "chevron-up" : "chevron-down"} size={18} color="#9CA3AF" />
                </Pressable>
                {prodiOpen && formData.fakultas && (
                  <View className="bg-white border border-gray-200 rounded-xl mt-1.5 overflow-hidden shadow-md">
                    {FAKULTAS_DATA.find((f) => f.nama === formData.fakultas)?.prodi.map((p) => (
                      <Pressable
                        key={p}
                        onPress={() => {
                          update("prodi", p);
                          setProdiOpen(false);
                        }}
                        className={`px-4 py-2.5 border-b border-gray-100 active:bg-orange/10 ${
                          formData.prodi === p ? "bg-orange/5" : ""
                        }`}
                      >
                        <Text className={`text-sm ${formData.prodi === p ? "text-orange font-bold" : "text-gray-700"}`}>
                          {p}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Email */}
              <View>
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base outline-none"
                    placeholder="email@contoh.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(t) => update("email", t)}
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 mx-3 text-gray-900 text-base outline-none"
                    placeholder="Buat password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(t) => update("password", t)}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View>
                <Text className="text-gray-700 font-semibold text-sm mb-1.5">
                  Konfirmasi Password
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-2.5 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#9CA3AF"
                  />
                  <TextInput
                    className="flex-1 mx-3 text-gray-900 text-base outline-none"
                    placeholder="Ulangi password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={formData.confirmPassword}
                    onChangeText={(t) => update("confirmPassword", t)}
                  />
                </View>
              </View>

              {/* Submit */}
              <Pressable
                onPress={handleRegister}
                disabled={loading}
                className={`mt-2 md:mt-3 rounded-xl py-2.5 md:py-3 items-center justify-center flex-row gap-2 ${
                  loading
                    ? "bg-navy/60"
                    : "bg-navy hover:opacity-90 active:scale-[0.98] transition-all"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-sm">
                      Buat Akun
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color="#fff"
                    />
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
