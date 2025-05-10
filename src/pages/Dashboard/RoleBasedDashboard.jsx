import { Navigate } from "react-router-dom";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../component/Loading/Loading";

const RoleBasedDashboard = () => {
  const { role, loading } = useUserRole();
  if (loading) {
    return <Loading />;
  }
  return (
    <Navigate to={role ? `/dashboard/${role?.toLowerCase()}` : "/"} replace />
  );
};
export default RoleBasedDashboard;
