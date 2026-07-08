/**
 * ProtectedRoute — layout guard for role-based access control.
 *
 * Usage in route group _layout.tsx:
 *   <ProtectedRoute allowedRoles={['alumni']}>
 *     <Slot />
 *   </ProtectedRoute>
 */
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Brand } from "@/constants/theme";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/masuk");
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      router.replace("/403");
      return;
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, router]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.navy} />
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  // Not authenticated — redirect happening
  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.navy} />
      </View>
    );
  }

  // Wrong role — redirect happening
  if (role && !allowedRoles.includes(role)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.orange} />
      </View>
    );
  }

  // Authorized — render children or Slot
  return <>{children || <Slot />}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter",
  },
});
