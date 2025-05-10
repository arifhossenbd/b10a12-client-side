import { Outlet } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";

const MainLayout = () => {
  return (
      <div>
        <nav>
          <Navbar />
        </nav>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
  );
};

export default MainLayout;
