import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (!isDark) {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-darkBg light:bg-lightBg text-darkText light:text-lightText">
      <div className="w-[90%] max-w-300 m-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
        {/* Navbar */}
        <nav className="flex justify-between items-center py-5">
          <h1 className="text-[32px]/[0.5px] font-bold text-darkPrimary light:text-lightPrimary">Habitify</h1>

          <div className="flex gap-2.5">
            {/* Theme Toggle */}
            <button
            className="border-none py-2.5 px-4 bg-darkCard light:bg-lightCard text-darkText light:text-lightText rounded-lg"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Login Button */}
            <button  className="border-none py-2.5 px-4 bg-darkPrimary light:bg-lightPrimary text-white rounded-lg">
              Login
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex items-center justify-between py-15 flex-wrap">
          <div className="max-w-125">
            <h2 className="text-[42px] mb-5">Build habits that actually stick.</h2>
            <p className="mb-5 text-darkSubText light:text-lightSubText">
              Track your daily habits, visualize progress, and stay consistent effortlessly.
            </p>
            <div>
              <button className="mr-2.5 py-3 px-5 rounded-lg border-none cursor-pointer text-white bg-darkPrimary light:bg-lightPrimary">
                Get Started
              </button>
              <Link to="/demo"
              className="border border-darkPrimary light:border-lightPrimary text-darkPrimary light:text-lightPrimary cursor-pointer bg-transparent py-3 px-5 rounded-lg"
              >
                View Demo
              </Link>
            </div>
          </div>

          <div className="bg-darkCard light:bg-lightCard p-5 rounded-lg grid gap-2" style={{ gridTemplateColumns: "repeat(7, 30px)" }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="w-7.5 h-7.5 rounded-md"
                style={{
                  background: Math.random() > 0.5 ? "#22c55e" : "#334155",
                }}
              />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-5 my-15" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {features.map((f, i) => (
            <div key={i} className="bg-darkCard light:bg-lightCard p-5 rounded-lg">
              <h3>{f.title}</h3>
              <p className="text-darkSubText light:text-lightSubText">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Pricing Section */}
        <section className="my-20">
          <h2 className="text-[32px] font-semibold mb-7.5 text-center">Choose Your Plan</h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {plans.map((plan, i) => (
              <div key={i} className="bg-darkCard light:bg-lightCard p-5 rounded-lg text-center">
                <h3>{plan.title}</h3>
                <p style={{ fontSize: "22px", margin: "10px 0" }}>{plan.price}</p>
                <p className="text-darkSubText light:text-lightSubText text-[14px] mb-3.75">
                  {plan.desc}
                </p>
                <button className="mr-2.5 py-3 px-5 rounded-lg border-none cursor-pointer text-white bg-darkPrimary light:bg-lightPrimary">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Extend Plan Section */}
        <section className="text-center my-15">
          <h2>Extend Your Plan</h2>
          <p className="text-darkSubText light:text-lightSubText mb-3.75">
            Already have a plan? Extend it anytime.
          </p>
          <button className="py-3 px-6.25 border-none rounded-lg text-white cursor-pointer bg-darkSuccess light:bg-lightSuccess">
            Extend Plan
          </button>
        </section>

        {/* CTA */}
        <section className="text-center my-20">
          <h2>Ready to take control of your habits?</h2>
          <button className="py-3 px-6.25 border-none rounded-lg text-white cursor-pointer bg-darkSuccess light:bg-lightSuccess">
            Start Free
          </button>
        </section>

        {/* Footer */}
        <footer className="text-center p-5 border-t border-darkBorder light:border-lightBorder">
          <p>© 2026 Habitify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const features = [
  { title: "📅 Daily Tracking", desc: "Mark habits daily with a clean interface." },
  { title: "📊 Progress", desc: "Track streaks and completion rates." },
  { title: "🎯 Goals", desc: "Set weekly and monthly targets." },
  { title: "🔔 Reminders", desc: "Never miss a habit again." },
];

const plans = [
  {
    title: "1 Month",
    price: "Free",
    desc: "Valid for the current month only, regardless of remaining days."
  },
  {
    title: "3 Months",
    price: "₹50",
    desc: "Covers current month + next 2 months."
  },
  {
    title: "6 Months",
    price: "₹80",
    desc: "Covers current month + next 5 months."
  },
  {
    title: "12 Months",
    price: "₹150",
    desc: "Covers current month + next 11 months."
  },
  {
    title: "Current Year",
    price: "₹20/month",
    desc: "Pay ₹20 per month for the remaining months of the current year (including this month)."
  }
];

export default HomePage;