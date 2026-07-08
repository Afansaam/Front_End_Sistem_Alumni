/**
 * Pengaturan Alumni — stub.
 */
import { View, Text, StyleSheet } from "react-native";
import { Brand } from "@/constants/theme";

export default function PengaturanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaturan</Text>
      <Text style={styles.subtitle}>[Fase 2] Ganti password, pengaturan akun.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FA", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", color: Brand.navy, fontFamily: "Inter" },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginTop: 8, fontFamily: "Inter" },
});
