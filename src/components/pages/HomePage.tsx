import PlanSection from "../home/PlanSection";
import NavigationBar from "../shared/NavigationBar";
import VideoDemoImages from "../home/VideoDemoImages";
import Features from "../home/Features"; 
import Footer from "../home/Footer";
import HeroSection from "../home/HeroSection";

const HomePage = () => {
  // const [dark, setDark] = useState(false);
  // const [showNavbar, setShowNavbar] = useState(false);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme === "dark") {
  //     setDark(true);
  //   } else {
  //     setDark(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowNavbar(window.scrollY > 80);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <>
      <div className="min-h-screen sm:px-0 px-4">
        <div
          className="w-[90%] max-w-300 m-auto"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <nav className="flex justify-between items-center py-5 sm:pt-10 pt-7">
            <NavigationBar />
          </nav>
          {/* <nav
            className={`fixed left-1/2 top-0 z-30 flex w-full -translate-x-1/2 items-center justify-between bg-[#121212] px-5 py-4 transition-all duration-500 ease-out ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"} light:bg-white/70 `}
          >
            <NavigationBar />
          </nav> */}

          <HeroSection />
          <VideoDemoImages />
          <Features />
          <PlanSection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
