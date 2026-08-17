import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaBrain, FaCode, FaRocket, FaHeartbeat, FaWeight, FaDumbbell, FaMusic, FaPiggyBank, FaLanguage, FaPen } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

interface Step1Props {
  onSelect: (goal: string) => void;
  initialValue?: string;
}

const PREDEFINED_GOALS = [
  { id: "upsc", label: "Crack UPSC", icon: FaGraduationCap, color: "from-[#F59E0B] to-[#D97706]" },
  { id: "jee", label: "Crack JEE", icon: FaBrain, color: "from-[#3B82F6] to-[#2563EB]" },
  { id: "swe", label: "Become a software engineer", icon: FaCode, color: "from-[#10B981] to-[#059669]" },
  { id: "startup", label: "Build a startup", icon: FaRocket, color: "from-[#EC4899] to-[#DB2777]" },
  { id: "fit", label: "Become fit", icon: FaHeartbeat, color: "from-[#EF4444] to-[#DC2626]" },
  { id: "weight", label: "Lose weight", icon: FaWeight, color: "from-[#06B6D4] to-[#0891B2]" },
  { id: "muscle", label: "Gain muscle", icon: FaDumbbell, color: "from-[#8B5CF6] to-[#7C3AED]" },
  { id: "singing", label: "Learn singing", icon: FaMusic, color: "from-[#F43F5E] to-[#E11D48]" },
  { id: "finance", label: "Become financially independent", icon: FaPiggyBank, color: "from-[#10B981] to-[#059669]" },
  { id: "language", label: "Learn a language", icon: FaLanguage, color: "from-[#6366F1] to-[#4F46E5]" },
];

export default function Step1PrimaryGoal({ onSelect, initialValue = "" }: Step1Props) {
  const [customGoal, setCustomGoal] = useState(initialValue);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handlePredefinedSelect = (label: string) => {
    onSelect(label);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoal.trim()) {
      onSelect(customGoal.trim());
    }
  };

  const handleCustomChange = (val: string) => {
    setCustomGoal(val);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white light:text-lightText google-sans">
          What is your Primary Goal?
        </h2>
        <p className="mt-2 text-sm text-gray-400 light:text-lightSubText">
          Choose a goal below or write a custom one to customize your AI coaching experience.
        </p>
      </div>

      {!isCustomMode ? (
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((d, index) => (
            <div className="rounded-2xl border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 hover:bg-white/10 p-2"> hii</div>
          ))}
          {/* <div className="flex flex-wrap gap-4">
            {PREDEFINED_GOALS.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => handlePredefinedSelect(goal.label)}
                  className="group relative flex items-center gap-4 p-3 rounded-2xl border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 hover:bg-white/10 light:hover:bg-black/10 text-left outline-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Accent glow on hover
                  <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${goal.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className={`flex h-6 w-6 items-center justify-center rounded-xl bg-linear-to-br ${goal.color} shadow-lg text-white`}>
                    <IconComponent />
                  </div>
                  <div>
                    <h3 className="text-sm text-white light:text-lightText group-hover:text-darkPrimary light:group-hover:text-lightPrimary transition-colors duration-300">
                      {goal.label}
                    </h3>
                  </div>
                </button>
              );
            })}

            Other Option Button
            <button
              onClick={() => setIsCustomMode(true)}
              className="group relative flex items-center gap-4 p-5 rounded-2xl border border-dashed border-white/20 light:border-dashed light:border-black/20 bg-transparent hover:border-darkPrimary light:hover:border-lightPrimary text-left outline-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 light:border-black/20 text-gray-400 group-hover:text-darkPrimary light:group-hover:text-lightPrimary transition-colors duration-300">
                <FaPen className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-gray-400 light:text-lightSubText group-hover:text-white light:group-hover:text-lightText transition-colors duration-300">
                  Other / Custom Goal
                </h3>
              </div>
            </button>
          </div> */}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="bg-black/10 light:bg-black/5 border border-white/10 light:border-black/10 rounded-3xl p-6 relative overflow-hidden"
        >
          <form onSubmit={handleCustomSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 light:text-lightSubText mb-2">
                Specify your goal
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g., Run a full marathon in 6 months, Learn oil painting..."
                  className="w-full rounded-2xl border border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 px-5 py-4 text-white light:text-lightText outline-none transition-all focus:border-darkPrimary light:focus:border-lightPrimary focus:bg-white/10 light:focus:bg-black/10"
                  value={customGoal}
                  onChange={(e) => handleCustomChange(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomGoal("");
                }}
                className="px-5 py-3 rounded-2xl text-sm font-semibold border border-white/10 light:border-black/10 text-gray-400 hover:text-white light:text-lightSubText light:hover:text-lightText hover:bg-white/5 light:hover:bg-black/5 transition-all duration-300 cursor-pointer"
              >
                Back to options
              </button>

              <AnimatePresence>
                {customGoal.trim().length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-darkPrimary light:bg-lightPrimary text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_10px_20px_rgba(99,102,241,0.3)] cursor-pointer"
                  >
                    Submit Goal <FiArrowRight />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
