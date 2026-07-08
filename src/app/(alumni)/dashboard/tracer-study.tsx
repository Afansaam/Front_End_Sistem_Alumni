import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brand } from "@/constants/theme";

export default function TracerStudyScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [tahunLulus, setTahunLulus] = useState("");
  const [programStudi, setProgramStudi] = useState("");
  const [status, setStatus] = useState(""); // bekerja, wirausaha, pendidikan, menganggur
  
  // Detail Pekerjaan
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [posisi, setPosisi] = useState("");
  const [gaji, setGaji] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sukses", "Data Tracer Study berhasil disimpan. Terima kasih atas partisipasi Anda!", [
        { text: "Kembali ke Dashboard", onPress: () => router.push("/dashboard") }
      ]);
    }, 1500);
  };

  const renderStepIndicator = () => (
    <View className="flex-row items-center justify-between mb-8 px-2 md:px-12">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <View className={`w-10 h-10 rounded-full items-center justify-center border-2 ${step >= s ? 'bg-navy border-navy' : 'bg-white border-gray-300'}`}>
            {step > s ? (
              <Ionicons name="checkmark" size={20} color="#fff" />
            ) : (
              <Text className={`font-bold ${step === s ? 'text-white' : 'text-gray-400'}`}>{s}</Text>
            )}
          </View>
          {s < 3 && (
            <View className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-navy' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 max-w-[800px] w-full mx-auto p-4 md:p-8">
          
          <Pressable 
            onPress={() => router.push("/dashboard")}
            className="flex-row items-center gap-2 mb-6 self-start hover:opacity-70"
          >
            <Ionicons name="arrow-back" size={20} color={Brand.navy} />
            <Text className="text-navy font-semibold text-sm md:text-base">Kembali ke Dashboard</Text>
          </Pressable>

          <View className="mb-8 items-center text-center">
            <Text className="text-2xl md:text-3xl font-extrabold text-navy mb-3 text-center">Kuesioner Tracer Study</Text>
            <Text className="text-gray-500 text-center max-w-[600px] leading-relaxed text-sm md:text-base">
              Data Anda akan dirahasiakan dan hanya digunakan untuk keperluan evaluasi institusi serta pelaporan ke kementerian terkait.
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            {renderStepIndicator()}

            {step === 1 && (
              <View className="gap-5">
                <Text className="text-xl font-bold text-gray-900 mb-2">Data Pendidikan</Text>
                
                <View>
                  <Text className="text-gray-700 font-bold mb-2">Tahun Lulus</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                    <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                    <TextInput 
                      className="flex-1 ml-3 text-gray-900 outline-none text-base"
                      placeholder="Contoh: 2023"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={tahunLulus}
                      onChangeText={setTahunLulus}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 font-bold mb-2">Program Studi</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                    <Ionicons name="school-outline" size={20} color="#9CA3AF" />
                    <TextInput 
                      className="flex-1 ml-3 text-gray-900 outline-none text-base"
                      placeholder="Masukkan nama Program Studi"
                      placeholderTextColor="#9CA3AF"
                      value={programStudi}
                      onChangeText={setProgramStudi}
                    />
                  </View>
                </View>

                <Pressable 
                  onPress={() => {
                    if(!tahunLulus || !programStudi) {
                      Alert.alert("Perhatian", "Mohon lengkapi semua data pendidikan.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-navy mt-4 py-4 rounded-xl items-center hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Text className="text-white font-bold text-lg">Selanjutnya</Text>
                </Pressable>
              </View>
            )}

            {step === 2 && (
              <View className="gap-5">
                <Text className="text-xl font-bold text-gray-900 mb-2">Status Saat Ini</Text>
                
                {/* Options */}
                {[
                  { id: "bekerja", label: "Bekerja (Full-time / Part-time)", icon: "briefcase" },
                  { id: "wirausaha", label: "Wirausaha / Memiliki Bisnis", icon: "storefront" },
                  { id: "pendidikan", label: "Melanjutkan Pendidikan", icon: "school" },
                  { id: "menganggur", label: "Belum Bekerja / Mencari Kerja", icon: "search" },
                ].map((opt) => (
                  <Pressable
                    key={opt.id}
                    onPress={() => setStatus(opt.id)}
                    className={`flex-row items-center p-4 rounded-xl border-2 transition-all ${status === opt.id ? 'border-orange bg-orange/5' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${status === opt.id ? 'bg-orange' : 'bg-gray-100'}`}>
                      <Ionicons name={opt.icon as any} size={20} color={status === opt.id ? '#fff' : '#9CA3AF'} />
                    </View>
                    <Text className={`font-bold text-base md:text-lg ${status === opt.id ? 'text-orange' : 'text-gray-700'}`}>{opt.label}</Text>
                  </Pressable>
                ))}

                <View className="flex-row gap-4 mt-4">
                  <Pressable 
                    onPress={() => setStep(1)}
                    className="flex-1 border border-gray-300 py-4 rounded-xl items-center hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    <Text className="text-gray-700 font-bold text-lg">Kembali</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => {
                      if(!status) {
                        Alert.alert("Perhatian", "Pilih status saat ini terlebih dahulu.");
                        return;
                      }
                      if(status === "menganggur") {
                        handleSubmit();
                      } else {
                        setStep(3);
                      }
                    }}
                    disabled={loading}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl transition-all ${loading ? 'bg-navy/70' : 'bg-navy hover:opacity-90 active:scale-[0.98]'}`}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : (
                       <Text className="text-white font-bold text-lg">
                         {status === "menganggur" ? "Kirim Data" : "Selanjutnya"}
                       </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            {step === 3 && (
              <View className="gap-5">
                <Text className="text-xl font-bold text-gray-900 mb-2">Detail Informasi</Text>
                
                {status === "bekerja" && (
                  <>
                    <View>
                      <Text className="text-gray-700 font-bold mb-2">Nama Perusahaan / Instansi</Text>
                      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                        <Ionicons name="business-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                          className="flex-1 ml-3 text-gray-900 outline-none text-base"
                          placeholder="Masukkan nama perusahaan"
                          placeholderTextColor="#9CA3AF"
                          value={namaPerusahaan}
                          onChangeText={setNamaPerusahaan}
                        />
                      </View>
                    </View>
                    <View>
                      <Text className="text-gray-700 font-bold mb-2">Posisi / Jabatan</Text>
                      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                        <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                          className="flex-1 ml-3 text-gray-900 outline-none text-base"
                          placeholder="Masukkan posisi Anda"
                          placeholderTextColor="#9CA3AF"
                          value={posisi}
                          onChangeText={setPosisi}
                        />
                      </View>
                    </View>
                    <View>
                      <Text className="text-gray-700 font-bold mb-2">Gaji Per Bulan (Kira-kira)</Text>
                      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                        <Text className="text-gray-500 font-bold mr-2">Rp</Text>
                        <TextInput 
                          className="flex-1 text-gray-900 outline-none text-base"
                          placeholder="Contoh: 5000000"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="numeric"
                          value={gaji}
                          onChangeText={setGaji}
                        />
                      </View>
                    </View>
                  </>
                )}

                {status === "wirausaha" && (
                  <View>
                    <Text className="text-gray-700 font-bold mb-2">Nama Usaha / Bisnis</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="storefront-outline" size={20} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        placeholder="Masukkan nama usaha"
                        placeholderTextColor="#9CA3AF"
                        value={namaPerusahaan}
                        onChangeText={setNamaPerusahaan}
                      />
                    </View>
                  </View>
                )}

                {status === "pendidikan" && (
                  <View>
                    <Text className="text-gray-700 font-bold mb-2">Nama Universitas / Kampus Lanjutan</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange focus-within:shadow-sm focus-within:bg-white transition-all">
                      <Ionicons name="school-outline" size={20} color="#9CA3AF" />
                      <TextInput 
                        className="flex-1 ml-3 text-gray-900 outline-none text-base"
                        placeholder="Masukkan nama kampus"
                        placeholderTextColor="#9CA3AF"
                        value={namaPerusahaan}
                        onChangeText={setNamaPerusahaan}
                      />
                    </View>
                  </View>
                )}

                <View className="flex-row gap-4 mt-4">
                  <Pressable 
                    onPress={() => setStep(2)}
                    className="flex-1 border border-gray-300 py-4 rounded-xl items-center hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    <Text className="text-gray-700 font-bold text-lg">Kembali</Text>
                  </Pressable>
                  <Pressable 
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-xl transition-all ${loading ? 'bg-navy/70' : 'bg-navy hover:opacity-90 active:scale-[0.98]'}`}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : (
                       <Text className="text-white font-bold text-lg">Kirim Data</Text>
                    )}
                  </Pressable>
                </View>

              </View>
            )}

          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
