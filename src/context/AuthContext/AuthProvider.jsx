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
import useAxiosPublic from "../../hooks/useAxiosPublic";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { axiosPublic } = useAxiosPublic();

  const register = async (email, password, name, image) => {
    setLoading(true);
    try {
      // Create user in Firebase
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!response?.user) {
        throw new Error("User creation failed");
      }

      // Update profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: image,
      });

      // Update local state
      setUser({ ...auth.currentUser });

      return response.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
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
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        const user = { email: currentUser?.email };
        try {
          await axiosPublic.post("/jwt", user);
        } catch (error) {
          console.error("JWT Error:", error);
        }
      } else {
        try {
          await axiosPublic.post("/logout");
        } catch (error) {
          console.error("Logout Error:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
