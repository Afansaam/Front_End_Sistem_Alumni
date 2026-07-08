import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Components
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/cards/StatCard";
import { JobCard } from "@/components/cards/JobCard";

// Mock Data
import { mockStatistik } from "@/services/mock/statistik";
import { mockLowongan } from "@/services/mock/lowongan";
import { Brand } from "@/constants/theme";

/** Animated counter – angka naik pelan dari 0 ke target. */
function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let cur = 0;
    const step = Math.ceil(target / (durationMs / 16));
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(cur);
      }
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return value;
}

export default function LandingPageScreen() {
  const router = useRouter();
  const recentJobs = mockLowongan.slice(0, 3);

  const cAlumni = useCountUp(mockStatistik.total_alumni);
  const cBekerja = useCountUp(mockStatistik.alumni_bekerja);
  const cMitra = useCountUp(mockStatistik.perusahaan_mitra);
  const cLoker = useCountUp(mockStatistik.lowongan_aktif);

  return (
    <View className="flex-1 bg-white">
      <Navbar />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ────────────────── HERO ────────────────── */}
        <View className="w-full min-h-[75vh] md:min-h-[80vh] relative">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop",
            }}
            resizeMode="cover"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          {/* overlay */}
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(8,30,53,0.85)",
            }}
          />

          <View className="flex-1 z-10 w-full px-6 md:px-20 lg:px-32 justify-center py-16 md:py-20">
            <View className="max-w-[720px]">
              {/* Sub-label */}
              <View className="bg-white/10 border border-white/20 self-start px-4 py-1.5 rounded-full flex-row items-center gap-2 mb-6">
                <View className="w-2 h-2 rounded-full bg-orange" />
                <Text className="text-white/90 text-sm font-semibold">
                  Portal Karir Resmi
                </Text>
              </View>

              <Text className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] mb-5">
                Pusat Karir &{"\n"}Alumni{" "}
                <Text className="text-orange">UNUHA</Text>
              </Text>

              <Text className="text-gray-300 text-base md:text-lg mb-10 max-w-[560px] leading-relaxed">
                Menghubungkan lulusan Universitas Nurul Huda dengan berbagai peluang
                profesional. Temukan karir yang tepat, lengkapi data tracer study,
                dan kembangkan potensimu.
              </Text>

              {/* CTA */}
              <View className="flex-row flex-wrap gap-3 mb-14">
                <Pressable
                  onPress={() => router.push("/masuk")}
                  className="bg-orange px-7 py-3.5 rounded-xl flex-row items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all duration-200"
                >
                  <Ionicons name="document-text-outline" size={20} color="#fff" />
                  <Text className="text-white font-bold text-base">
                    Isi Tracer Study
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/lowongan")}
                  className="border border-white/40 px-7 py-3.5 rounded-xl flex-row items-center gap-2 hover:bg-white/10 active:scale-[0.97] transition-all duration-200"
                >
                  <Ionicons name="search-outline" size={20} color="#fff" />
                  <Text className="text-white font-bold text-base">
                    Lihat Lowongan
                  </Text>
                </Pressable>
              </View>

              {/* Mini-stats */}
              <View className="flex-row flex-wrap gap-10">
                {[
                  { label: "Alumni Terdaftar", val: cAlumni.toLocaleString() },
                  { label: "Alumni Bekerja", val: cBekerja.toLocaleString() },
                  { label: "Mitra Perusahaan", val: String(cMitra) },
                ].map((s, i) => (
                  <View key={i}>
                    <Text className="text-white text-3xl font-extrabold">
                      {s.val}
                      <Text className="text-orange">+</Text>
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ────────────────── STATISTIK ────────────────── */}
        <View className="px-6 py-20 items-center bg-gray-50">
          <View className="max-w-[1200px] w-full">
            <View className="mb-12 items-center">
              <Text className="text-navy text-3xl md:text-4xl font-extrabold text-center mb-3">
                Statistik Lulusan
              </Text>
              <View className="w-16 h-1 rounded-full bg-orange mb-4" />
              <Text className="text-gray-500 text-center max-w-[520px] text-base leading-relaxed">
                Data agregat dan rekam jejak alumni Universitas Nurul Huda
                yang telah berkontribusi di berbagai sektor industri.
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-5">
              <StatCard
                title="Total Alumni"
                value={cAlumni.toLocaleString()}
                iconName="people"
                color={Brand.navy}
                bgColor="#E0E7FF"
              />
              <StatCard
                title="Alumni Bekerja"
                value={cBekerja.toLocaleString()}
                iconName="briefcase"
                color={Brand.orange}
                bgColor="#FFEDD5"
              />
              <StatCard
                title="Perusahaan Mitra"
                value={cMitra}
                iconName="business"
                color="#10B981"
                bgColor="#D1FAE5"
              />
              <StatCard
                title="Lowongan Aktif"
                value={cLoker}
                iconName="megaphone"
                color="#8B5CF6"
                bgColor="#EDE9FE"
              />
            </View>
          </View>
        </View>

        {/* ────────────────── LAYANAN ────────────────── */}
        <View className="px-6 py-20 items-center bg-white">
          <View className="max-w-[1200px] w-full">
            <View className="mb-12 items-center">
              <Text className="text-navy text-3xl md:text-4xl font-extrabold text-center mb-3">
                Layanan Utama Kami
              </Text>
              <View className="w-16 h-1 rounded-full bg-orange mb-4" />
              <Text className="text-gray-500 text-center max-w-[520px] text-base leading-relaxed">
                Platform terpadu untuk mendukung pengembangan karir dan 
                pengumpulan data tracer study alumni.
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-5">
              {[
                {
                  icon: "document-text-outline" as const,
                  color: Brand.navy,
                  bg: "#E0E7FF",
                  title: "Tracer Study",
                  desc: "Bantu kampus meningkatkan kualitas pendidikan dengan mengisi data tracer study secara berkala.",
                },
                {
                  icon: "briefcase-outline" as const,
                  color: "#F59E0B",
                  bg: "#FEF3C7",
                  title: "Cari Lowongan",
                  desc: "Dapatkan akses ke peluang kerja dari berbagai perusahaan yang telah bermitra dengan kami.",
                },
                {
                  icon: "person-outline" as const,
                  color: "#10B981",
                  bg: "#D1FAE5",
                  title: "Profil & CV",
                  desc: "Bangun profil profesional dan buat CV digital untuk menarik perhatian rekruter.",
                },
                {
                  icon: "bar-chart-outline" as const,
                  color: "#8B5CF6",
                  bg: "#EDE9FE",
                  title: "Statistik Karir",
                  desc: "Lihat data sebaran alumni dan tren peluang kerja berdasarkan program studi.",
                },
                {
                  icon: "newspaper-outline" as const,
                  color: "#EF4444",
                  bg: "#FEE2E2",
                  title: "Berita & Acara",
                  desc: "Dapatkan informasi terkini seputar kegiatan akademik dan program pengembangan alumni.",
                },
                {
                  icon: "shield-checkmark-outline" as const,
                  color: "#0EA5E9",
                  bg: "#E0F2FE",
                  title: "Mitra Terverifikasi",
                  desc: "Semua lowongan berasal dari perusahaan mitra yang kredibel dan terpercaya.",
                },
              ].map((f, i) => (
                <View
                  key={i}
                  className="bg-gray-50 rounded-2xl p-7 flex-1 min-w-[300px] max-w-[380px] border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <View
                    className="w-14 h-14 rounded-xl items-center justify-center mb-5"
                    style={{ backgroundColor: f.bg }}
                  >
                    <Ionicons name={f.icon} size={28} color={f.color} />
                  </View>
                  <Text className="text-gray-900 text-lg font-bold mb-2">
                    {f.title}
                  </Text>
                  <Text className="text-gray-500 text-sm leading-relaxed">
                    {f.desc}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ────────────────── LOWONGAN TERBARU ────────────────── */}
        <View className="px-6 py-20 items-center bg-gray-50">
          <View className="max-w-[1200px] w-full">
            <View className="flex-row justify-between items-end mb-10">
              <View>
                <Text className="text-navy text-3xl md:text-4xl font-extrabold mb-3">
                  Lowongan Terbaru
                </Text>
                <Text className="text-gray-500 max-w-[480px] text-base leading-relaxed">
                  Jelajahi berbagai peluang karir dari perusahaan yang mencari 
                  talenta unggul lulusan UNUHA.
                </Text>
              </View>
              <Pressable
                onPress={() => router.push("/lowongan")}
                className="hidden md:flex px-5 py-2.5 rounded-xl flex-row items-center gap-2 border border-gray-200 hover:bg-gray-50 active:scale-[0.97] transition-all"
              >
                <Text className="text-navy font-semibold text-sm">
                  Lihat Semua
                </Text>
                <Ionicons name="arrow-forward" size={16} color={Brand.navy} />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-center gap-5">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>

            <Pressable
              onPress={() => router.push("/lowongan")}
              className="mt-8 md:hidden bg-navy py-3.5 rounded-xl flex-row justify-center items-center gap-2 active:scale-[0.97] transition-all"
            >
              <Text className="text-white font-bold text-sm">
                Lihat Semua Lowongan
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* ────────────────── CTA ────────────────── */}
        <View className="px-6 py-16 items-center bg-white">
          <View className="max-w-[800px] w-full bg-navy rounded-3xl p-10 md:p-14 items-center relative overflow-hidden">
            <View className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
            <View className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5" />

            <View className="z-10 items-center">
              <Ionicons name="school-outline" size={44} color={Brand.orange} />
              <Text className="text-white text-2xl md:text-3xl font-extrabold text-center mt-5 mb-3 leading-tight">
                Mulai Perjalanan Karirmu
              </Text>
              <Text className="text-gray-300 text-center text-base mb-8 max-w-[480px] leading-relaxed">
                Bergabunglah dengan jaringan alumni yang solid. Daftar sekarang
                untuk mengakses fitur penuh layanan karir kami.
              </Text>

              <View className="flex-row flex-wrap gap-3 justify-center">
                <Pressable
                  onPress={() => router.push("/daftar")}
                  className="bg-orange px-7 py-3.5 rounded-xl flex-row items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
                >
                  <Ionicons name="person-add-outline" size={18} color="#fff" />
                  <Text className="text-white font-bold text-base">
                    Daftar Sekarang
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/masuk")}
                  className="border border-white/30 px-7 py-3.5 rounded-xl flex-row items-center gap-2 hover:bg-white/10 active:scale-[0.97] transition-all"
                >
                  <Ionicons name="log-in-outline" size={18} color="#fff" />
                  <Text className="text-white font-bold text-base">Masuk</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
