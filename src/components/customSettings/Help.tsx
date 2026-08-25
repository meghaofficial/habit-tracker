import {
  FiArrowUpRight,
  FiClock,
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";

const Help = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-white/6 pb-5 light:border-black/6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
          <FiHelpCircle className="h-4 w-4 text-indigo-400" />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white light:text-black">
            Help & Support
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Need help? We're here to help you get the most out of HabitFlow.
          </p>
        </div>
      </div>

      {/* Support Card */}
      <div className="relative max-w-xl overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/50 p-5 sm:p-6">

        <div className="relative z-10 space-y-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-400">
              <FiMessageCircle className="h-5 w-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-zinc-200 light:text-black">
                  Contact Our Team
                </h4>

                <span className="rounded-md border border-emerald-400/10 bg-emerald-500/5 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                  We're here to help
                </span>
              </div>

              <p className="mt-1.5 max-w-md text-[11px] leading-5 text-zinc-600">
                Have a question, found a bug, or have an idea that could make
                HabitFlow better? We'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Support Options */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-3.5 py-3 light:border-black/5 light:bg-black/2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/[0.07] text-indigo-400">
                <FiMail className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                  Email Support
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-zinc-400">
                  Reach us directly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-3.5 py-3 light:border-black/5 light:bg-black/2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/[0.07] text-indigo-400">
                <FiClock className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-700">
                  Response Time
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-zinc-400">
                  We'll get back to you
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 light:bg-black/5" />

          {/* Email CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                Get in touch
              </p>

              <p className="mt-1 truncate text-xs font-medium text-zinc-400">
                support@habitify.in
              </p>
            </div>

            <a
              href="mailto:support@habitify.in"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-300 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/15 hover:text-indigo-200"
            >
              <FiMail className="h-3.5 w-3.5" />

              <span>Send us an Email</span>

              <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
