import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiRefreshCw, FiAward } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import Step1PrimaryGoal from "./Step1PrimaryGoal";
import Step2Placeholder from "./Step2Placeholder";
import Step3Placeholder from "./Step3Placeholder";

const STEPS = [
  { number: 1, label: "Primary Goal" },
  { number: 2, label: "Goal Analysis" },
  { number: 3, label: "Review & Start" },
];

export default function AiCoachMainComponent() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBackStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectGoal = (goal: string) => {
    setPrimaryGoal(goal);
    handleNextStep();
  };

  const handleSubmitForm = () => {
    setIsCompleted(true);
  };

  const handleReset = () => {
    setStep(1);
    setPrimaryGoal("");
    setIsCompleted(false);
    setDirection(-1);
  };

  // Slide transition animation variants
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Background glow effects */}
      <div className="relative w-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        {!isCompleted ? (
          <div className="relative z-10 space-y-8">
            {/* Custom Stepper */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-between relative">
                {/* Connector Line behind steps */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 light:bg-black/10 -translate-y-1/2 z-0" />

                {/* Active progress color line */}
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
                  style={{
                    width: `${((step - 1) / (STEPS.length - 1)) * 100}%`
                  }}
                />

                {STEPS.map((s, index) => {
                  const isActive = step === s.number;
                  const isDone = step > s.number;

                  return (
                    <div key={s.number} className="relative z-10 flex flex-col items-center">
                      <button
                        onClick={() => {
                          // Allow jumping back to completed steps
                          if (s.number < step) {
                            setDirection(-1);
                            setStep(s.number);
                          }
                        }}
                        disabled={s.number >= step}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 cursor-pointer ${isDone
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                          : isActive
                            ? "bg-darkCard light:bg-white text-white light:text-lightPrimary border-2 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                            : "bg-darkCard light:bg-white text-gray-500 border border-white/10 light:border-black/10"
                          }`}
                      >
                        {isDone ? <FiCheck className="text-base" /> : s.number}
                      </button>
                      <span
                        className={`absolute top-12 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${isActive
                          ? "text-indigo-400 light:text-lightPrimary"
                          : isDone
                            ? "text-white light:text-lightText"
                            : "text-gray-500"
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Step Container */}
            <div className="relative mt-8 rounded-4xl border border-white/10 light:border-black/10 bg-black/20 light:bg-lightCard p-6 sm:p-8 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  // variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  {step === 1 && (
                    <Step1PrimaryGoal
                      onSelect={handleSelectGoal}
                      initialValue={primaryGoal}
                    />
                  )}
                  {step === 2 && (
                    <Step2Placeholder
                      primaryGoal={primaryGoal}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                    />
                  )}
                  {step === 3 && (
                    <Step3Placeholder
                      primaryGoal={primaryGoal}
                      onBack={handleBackStep}
                      onSubmit={handleSubmitForm}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Finished State Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 max-w-2xl mx-auto rounded-[32px] border border-white/10 light:border-black/10 bg-black/20 light:bg-lightCard p-8 text-center backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] space-y-6"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl text-white">
              <LuSparkles className="text-4xl animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-white light:text-lightText google-sans">
                Setup Complete!
              </h2>
              <p className="text-gray-400 light:text-lightSubText">
                Your custom habit-building path is ready.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 light:bg-black/5 border border-white/5 light:border-black/5 max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <FiAward className="text-xl" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 light:text-lightSubText">Selected primary goal</span>
                  <p className="text-base font-bold text-white light:text-lightText leading-5">{primaryGoal}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-center gap-4 border-t border-white/10 light:border-black/10">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <FiRefreshCw /> Restart Setup
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
