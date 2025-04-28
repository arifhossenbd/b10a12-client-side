import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from || "/";

  const register = async (email, password, name, image) => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!response?.user) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: image,
      });
      navigate(from, { replace: true });
      return response.user;
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("The email address is already in use.");
        navigate("/login");
        return;
      }
      toast.error("Registration failed. Please try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }
      navigate(from, { replace: true });
      return userCredential.user;
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email or register.");
        navigate("/register");
        return;
      }
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
        return;
      }
      toast.error("Login failed. Please try again.");
      return;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
