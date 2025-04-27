import { Outlet } from "react-router";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";

const Main = () => {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Main;
