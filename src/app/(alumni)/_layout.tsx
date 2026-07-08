/**
 * (alumni) route group layout — ProtectedRoute guard for role=alumni.
 */
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AlumniLayout() {
  return <ProtectedRoute allowedRoles={["alumni"]} />;
}
