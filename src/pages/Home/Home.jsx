import Banner from "./Banner";
import Featured from "./Featured";
import Contact from "./Contact";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../../component/Loading/Loading";

const Home = () => {
  const { loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  return (
    <section className="bg-base-100">
      <div className="w-full overflow-x-hidden space-y-5 pb-8 md:pb-12 lg:pb-24">
        <Banner />
        <div className="px-4 lg:w-11/12 mx-auto">
          <Featured />
          <Contact />
        </div>
      </div>
    </section>
  );
};

export default Home;
