import { FiHelpCircle, FiMail } from "react-icons/fi";

const Help = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 light:border-black/10 pb-4">
        <h3 className="text-xl font-bold text-white light:text-black">
          Help & Support
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Need help? We're here for you.
        </p>
      </div>

      <div className="max-w-md bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10 rounded-2xl p-6 mt-4 space-y-4">
        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center">
          <FiHelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-white light:text-black text-base">
            Contact Our Team
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Have questions, bug reports, or feature suggestions? Send us an
            email and we'll get back to you as soon as possible.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="mailto:habitify@habitflow.ai"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            <FiMail className="w-4 h-4" />
            <span>support@habitflow.in</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
