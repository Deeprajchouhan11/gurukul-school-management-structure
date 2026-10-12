import { Navigate, Outlet } from "react-router-dom";
import useRole from "../hooks/useRole";

export default function RoleRoute({ allowedRoles = [] }) {
  const role = useRole();
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
