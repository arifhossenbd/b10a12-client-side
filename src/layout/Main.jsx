import { Outlet } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";
import AuthProvider from "../context/AuthContext/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Main = () => {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <nav>
          <Navbar />
        </nav>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default Main;
