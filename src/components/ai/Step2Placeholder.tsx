import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Step2Props {
  onBack: () => void;
  onNext: () => void;
  primaryGoal: string;
}

export default function Step2Placeholder({ onBack, onNext, primaryGoal }: Step2Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white light:text-lightText google-sans">
          Analyze and Detail Your Goal
        </h2>
        <p className="mt-2 text-sm text-gray-400 light:text-lightSubText">
          Your primary goal: <span className="text-darkPrimary light:text-lightPrimary font-semibold">{primaryGoal}</span>
        </p>
      </div>

      <div className="bg-black/10 light:bg-black/5 border border-white/10 light:border-black/10 rounded-3xl p-8 space-y-6">
        <p className="text-gray-300 light:text-lightSubText leading-relaxed">
          [Placeholder for Step 2]
          <br />
          Here you will add details for: <span className="font-bold text-white light:text-lightText">"{primaryGoal}"</span>.
          Once you provide the options for this question, we will replace this screen with real options!
        </p>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 light:border-black/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border border-white/10 light:border-black/10 text-gray-400 hover:text-white light:text-lightSubText light:hover:text-lightText hover:bg-white/5 light:hover:bg-black/5 transition-all duration-300 cursor-pointer"
          >
            <FiArrowLeft /> Back
          </button>
          
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-darkPrimary light:bg-lightPrimary text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_10px_20px_rgba(99,102,241,0.3)] cursor-pointer"
          >
            Continue <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
