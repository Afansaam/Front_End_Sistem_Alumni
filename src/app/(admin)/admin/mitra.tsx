/**
 * Verifikasi Perusahaan Mitra — UC-11 stub.
 */
import { View, Text, StyleSheet } from "react-native";
import { Brand } from "@/constants/theme";

export default function AdminMitraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifikasi Mitra — UC-11</Text>
      <Text style={styles.subtitle}>[Fase 3] Validasi perusahaan partner baru.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FA", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: Brand.navy, fontFamily: "Inter" },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginTop: 8, textAlign: "center", fontFamily: "Inter" },
});
