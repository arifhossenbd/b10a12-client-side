import { useEffect, useState, useMemo } from "react";
import { useDatabaseData } from "./useDatabaseData";
import { useAuth } from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState({});

  const { data, isLoading, error, refetch } = useDatabaseData(
    !authLoading && user?.email ? `/users/find?email=${user?.email}` : null,
    {}
  );

  useEffect(() => {
    if (data?.data) {
      setUserData(data?.data);
      if (data?.data?.role) {
        setRole(data?.data?.role);
      }
    }
  }, [data]);

  return useMemo(
    () => ({
      user,
      userData,
      role,
      loading: authLoading || isLoading,
      error,
      logout,
      refetch,
    }),
    [user, userData, role, authLoading, isLoading, error, logout, refetch]
  );
};

export default useUserRole;
