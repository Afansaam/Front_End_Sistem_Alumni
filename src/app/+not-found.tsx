/**
 * 404 Not Found page.
 */
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Brand } from "@/constants/theme";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.title}>Halaman Tidak Ditemukan</Text>
        <Text style={styles.description}>
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Kembali ke Halaman Utama</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    maxWidth: 420,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  errorCode: {
    fontSize: 80,
    fontWeight: "800",
    color: Brand.navy,
    fontFamily: "Inter",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Brand.navy,
    marginTop: 8,
    fontFamily: "Inter",
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    fontFamily: "Inter",
  },
  button: {
    marginTop: 28,
    backgroundColor: Brand.navy,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter",
  },
});
