import Banner from "./Banner";
import Featured from "./Featured";
import Contact from "./Contact"

const Home = () => {
  return (
    <section className="bg-base-100">
      <div className="w-full overflow-x-hidden space-y-5 pb-8 md:pb-12 lg:pb-24">
        <Banner />
        <div className="px-4 lg:w-11/12 mx-auto">
          <Featured />
          <Contact/>
        </div>
      </div>
    </section>
  );
};

export default Home;
