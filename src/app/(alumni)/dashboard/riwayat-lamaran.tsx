/**
 * Riwayat Lamaran — stub.
 */
import { View, Text, StyleSheet } from "react-native";
import { Brand } from "@/constants/theme";

export default function RiwayatLamaranScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Lamaran</Text>
      <Text style={styles.subtitle}>[Fase 2] Daftar status lamaran kerja.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FA", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: Brand.navy, fontFamily: "Inter" },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginTop: 8, fontFamily: "Inter" },
});
