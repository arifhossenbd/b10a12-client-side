import Banner from "./Banner";
import Contact from "./Contact";
import Featured from "./Featured";

const Home = () => {
  return (
    <section className="bg-base-100">
      <div className="px-4 lg:w-11/12 mx-auto pb-8 pt-24 space-y-5">
        <Banner />
        <Featured/>
        <Contact/>
      </div>
    </section>
  );
};

export default Home;
