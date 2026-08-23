import { useEffect, useState, useRef } from "react";
import { IoStatsChart } from "react-icons/io5";
import { FaCalendarAlt, FaBell, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import PlanSection from "../home/PlanSection";
import NavigationBar from "../shared/NavigationBar";

const features = [
  {
    title: "Daily Tracking",
    desc: "Mark habits daily with a clean interface.",
    icon: <FaCalendarAlt className="text-yellow-500" />,
  },
  {
    title: "Progress",
    desc: "Track streaks and completion rates.",
    icon: <IoStatsChart className="text-blue-500" />,
  },
  {
    title: "Goals",
    desc: "Set weekly and monthly targets.",
    icon: <GoGoal className="text-red-500" />,
  },
  {
    title: "Reminders",
    desc: "Never miss a habit again.",
    icon: <FaBell className="text-green-500" />,
  },
];

const HomePage = () => {
  const [dark, setDark] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Video play failed:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handlePlayEvent = () => setIsPlaying(true);
  const handlePauseEvent = () => setIsPlaying(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    } else {
      setDark(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen sm:px-0 px-4">
        <div
          className="w-[90%] max-w-300 m-auto"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {/* Navbar */}
          <nav className="flex justify-between items-center py-5 sm:pt-10 pt-7">
            <NavigationBar />
          </nav>
          {/* <nav
            className={`fixed left-1/2 top-0 z-30 flex w-full -translate-x-1/2 items-center justify-between bg-[#121212] px-5 py-4 transition-all duration-500 ease-out ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"} light:bg-white/70 `}
          >
            <NavigationBar />
          </nav> */}

          {/* Hero */}
          <section className="flex sm:flex-row flex-col sm:items-center justify-between py-15">
            <div className="w-full flex flex-col items-center">
              <p className=" text-violet-500 font-semibold uppercase">
                Build habits that actually stick.
              </p>
              <div className="flex sm:flex-row flex-col sm:items-center gap-3 playfair-display">
                <p className="sm:text-[7em] text-[22vw] font-bold">Habit</p>
                <p className="sm:text-[7em] text-[22vw] sm:mt-0 -mt-5 font-bold leading-none bg-linear-to-r from-[#5B5CF6] via-[#3B82F6] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]">
                  Tracker
                </p>
              </div>
              <p className="text-gray-500 sm:mt-0 mt-5 text-center w-[60%]">
                Track your daily habits, build lasting routines, and visualize
                your progress with beautifully organized insights. Stay
                motivated, maintain consistency effortlessly, and transform
                small daily actions into meaningful long-term growth.
              </p>
              <div className="mt-10 flex sm:flex-nowrap flex-wrap gap-10 google-sans">
                {[
                  ["STREAKS", "Daily Consistency"],
                  ["TRACKING", "Smart Insights"],
                  ["GOALS", "Habit Milestones"],
                  ["SYNC", "Cloud Connected"],
                ].map(([title, value], index) => (
                  <div
                    key={title}
                    className="animate__animated animate__fadeInUp"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#6B7280]">
                      {title}
                    </p>

                    <p className="mt-0.5 text-nowrap text-[14px] font-bold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

           
          </section>

          {/* Video Demo Section */}
          <section className="mt-15 mb-24 flex flex-col items-center animate__animated animate__fadeIn">

            {/* Mock Browser Container */}
            <div 
              className="w-full max-w-5xl rounded-3xl border border-white/10 light:border-black/10 bg-black/40 light:bg-white overflow-hidden shadow-[0_30px_100px_rgba(99,102,241,0.15)] light:shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl relative transition-all duration-500 hover:scale-[1.01] hover:border-white/20 light:hover:border-black/20 hover:shadow-[0_45px_120px_rgba(99,102,241,0.22)] light:hover:shadow-[0_40px_100px_rgba(0,0,0,0.12)] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Browser Header Bar */}
              {/* <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 light:border-black/10 bg-white/5 light:bg-black/2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] transition-opacity duration-350 hover:opacity-85"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] transition-opacity duration-350 hover:opacity-85"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] transition-opacity duration-350 hover:opacity-85"></span>
                </div>
                <div className="bg-white/5 light:bg-black/5 border border-white/10 light:border-black/5 text-xs px-10 py-1.5 rounded-lg text-gray-400 light:text-gray-500 font-mono w-1/2 text-center truncate shadow-inner">
                  habitify.app/dashboard
                </div>
                <div className="w-12"></div>
              </div> */}

              {/* Video Content with Overlay Controls */}
              <div className="relative aspect-video w-full bg-black cursor-pointer" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  src="https://www.youtube.com/watch?v=F_jnqx14idY&t=1158s"
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  onPlay={handlePlayEvent}
                  onPause={handlePauseEvent}
                />

                {/* Big Center Play Overlay (when paused) */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center transition-all duration-300 ${!isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-white text-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/30 group/btn">
                    {/* Pulsing Outer Ring */}
                    <span className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-75"></span>
                    <FaPlay className="relative z-10 ml-1.5" />
                  </div>
                  <p className="mt-4 text-xs font-bold tracking-widest uppercase text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    Click to Play Demo
                  </p>
                </div>

                {/* Hover / Small Overlay Controls */}
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex justify-between items-center transition-all duration-300 z-10 ${isHovered || !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                  {/* Left Side: Play/Pause and Quick Status */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200 cursor-pointer"
                    >
                      {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
                    </button>
                    <span className="text-white text-xs font-semibold select-none bg-white/5 border border-white/5 rounded-md px-2 py-1 uppercase tracking-wider">
                      {isPlaying ? "Playing Demo" : "Paused"}
                    </span>
                  </div>

                  {/* Right Side: Sound Controls */}
                  <button 
                    onClick={toggleMute}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200 cursor-pointer"
                  >
                    {isMuted ? <FaVolumeMute className="text-base" /> : <FaVolumeUp className="text-base" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <div className="text-center mt-30">
            <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">
              Features
            </p>

            <h2 className="mt-3 text-[42px] font-black tracking-[-0.05em] text-white light:text-lightText">
              Build Better Habits
            </h2>

            <p className="mx-auto mt-4 max-w-155 text-[16px] leading-7 text-darkSubText light:text-lightSubText">
              Track habits, maintain streaks, set meaningful goals, and gain
              actionable insights to stay consistent and achieve lasting
              personal growth.
            </p>
          </div>
          <section
            className="my-15 grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(99,102,241,0.18)] light:bg-lightCard"
                >
                  {/* Glow BG */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6366F1]/10 blur-3xl transition-all duration-500 group-hover:bg-[#8B5CF6]/20" />

                  {/* Shine Overlay */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-linear-to-br from-white/[0.07] via-transparent to-transparent" />
                  </div>

                  {/* Icon */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-linear-to-br from-white/10 to-white/5 text-[28px] text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {Icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-6">
                    <h3 className="text-[22px] font-bold tracking-[-0.03em] text-white light:text-lightText">
                      {f.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-darkSubText light:text-lightSubText">
                      {f.desc}
                    </p>
                  </div>

                  {/* Bottom Line */}
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-linear-to-r from-transparent via-[#8B5CF6] to-transparent transition-all duration-500 group-hover:w-[80%]" />

                  {/* Floating Dot */}
                  <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#8B5CF6]/60 opacity-0 blur-[1px] transition-all duration-500 group-hover:opacity-100" />
                </div>
              );
            })}
          </section>

          {/* Pricing Section */}
          <PlanSection />

          {/* Footer */}
          <footer className="text-center p-5 border-t mt-20 border-darkBorder light:border-lightBorder">
            <p>© 2026 Habitify. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;
