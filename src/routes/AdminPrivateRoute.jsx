import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../component/Loading/Loading";
import useUserRole from "../hooks/useUserRole";

const AdminPrivateRoute = () => {
  const { user, loading, role } = useUserRole();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user && !role === "admin") return <Navigate to="/login" state={{ from: location }} replace />;
  
  return <Outlet />;
};

export default AdminPrivateRoute;