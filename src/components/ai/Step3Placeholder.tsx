import { FiArrowLeft, FiCheck } from "react-icons/fi";

interface Step3Props {
  onBack: () => void;
  onSubmit: () => void;
  primaryGoal: string;
}

export default function Step3Placeholder({ onBack, onSubmit, primaryGoal }: Step3Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white light:text-lightText google-sans">
          Review & Confirm
        </h2>
        <p className="mt-2 text-sm text-gray-400 light:text-lightSubText">
          We're ready to tailor your personal AI Coach dashboard.
        </p>
      </div>

      <div className="bg-black/10 light:bg-black/5 border border-white/10 light:border-black/10 rounded-3xl p-8 space-y-6">
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 light:text-lightSubText">
            Summary of selections
          </h4>
          <div className="p-5 rounded-2xl bg-white/5 light:bg-black/5 border border-white/5 light:border-black/5">
            <span className="text-xs text-gray-400 light:text-lightSubText">Primary Goal</span>
            <p className="text-lg font-bold text-white light:text-lightText mt-1">{primaryGoal}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 light:border-black/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border border-white/10 light:border-black/10 text-gray-400 hover:text-white light:text-lightSubText light:hover:text-lightText hover:bg-white/5 light:hover:bg-black/5 transition-all duration-300 cursor-pointer"
          >
            <FiArrowLeft /> Back
          </button>

          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <FiCheck /> Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}
