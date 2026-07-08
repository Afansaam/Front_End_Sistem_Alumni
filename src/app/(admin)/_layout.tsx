/**
 * (admin) route group layout — ProtectedRoute guard for role=admin.
 */
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminLayout() {
  return <ProtectedRoute allowedRoles={["admin"]} />;
}
