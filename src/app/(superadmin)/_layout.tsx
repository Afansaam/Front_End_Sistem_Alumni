/**
 * (superadmin) route group layout — ProtectedRoute guard for role=super_admin.
 */
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SuperAdminLayout() {
  return <ProtectedRoute allowedRoles={["super_admin"]} />;
}
