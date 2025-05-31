import { useEffect, useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import useDatabaseData from "./useDatabaseData";

const useUserRole = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState({});

  const { data, isLoading, error, refetch } = useDatabaseData(
    !authLoading && user ? `/users/find?email=${user?.email}&name=${user?.displayName}` : null,
    {}
  );

  useEffect(() => {
    if (data?.data) {
      setUserData(data?.data);
      if (data?.data?.role) {
        setRole(data?.data?.role);
      }
      if (data?.data?.email) {
        setEmail(data?.data?.email);
      }
    }
  }, [data]);

  return useMemo(
    () => ({
      user,
      userData,
      role,
      email,
      loading: authLoading || isLoading,
      error,
      logout,
      refetch,
    }),
    [user, userData, role, email, authLoading, isLoading, error, logout, refetch]
  );
};

export default useUserRole;
