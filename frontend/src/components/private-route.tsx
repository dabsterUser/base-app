import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
