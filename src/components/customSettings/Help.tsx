import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiChevronRight,
  FiClock,
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
}

const Help = () => {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Subscription Terms & Activation Policy",
      answer:
        "1. Instant Activation & Start Time:\nAll subscriptions—both free and paid—activate immediately upon completion, beginning on the exact day and time the transaction occurs.\n\n2. Expiration Timing:\nSubscriptions remain active through the final day of the applicable billing month according to your selected plan, aligned with Indian Standard Time (IST, UTC+05:30) for users located in India.\n\n3. Stacking & Scheduled Subscriptions:\nIf you purchase a new subscription while an existing subscription is already active, the new plan is safely queued. It will automatically begin on the first day of the month immediately following the expiration of your current active or previously scheduled billing period (aligned with UTC+05:30 for Indian users).",
    },
  ];

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
            Need help? We're here to help you get the most out of Habitify.
          </p>
        </div>
      </div>

      {/* Support Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/50 p-5 sm:p-6">
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
                Habitify better? We'd love to hear from you.
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

      {/* FAQ */}
      <div className=" border-t border-white/6 pt-6 light:border-black/6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
            <FiHelpCircle className="h-4 w-4 text-indigo-400" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-200 light:text-black">
              Frequently Asked Questions
            </h4>

            <p className="mt-1 text-[11px] text-zinc-600">
              Quick answers to common questions about Habitify.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/40 light:border-black/6 light:bg-white">
          {faqs.map((faq, index) => (
            <motion.button
              key={faq.question}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.025,
              }}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedFAQ(faq)}
              className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-indigo-500/[0.035] ${
                index !== faqs.length - 1
                  ? "border-b border-white/5 light:border-black/5"
                  : ""
              }`}
            >
              <span className="w-5 shrink-0 text-[9px] font-semibold text-zinc-700">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-[11px] font-medium text-zinc-400 transition-colors group-hover:text-indigo-300">
                {faq.question}
              </span>

              <FiChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAQ Modal */}
      <AnimatePresence>
        {selectedFAQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFAQ(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.98,
              }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_25px_80px_rgba(0,0,0,0.45)] light:border-black/8 light:bg-white"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/6 px-5 py-4 light:border-black/6">
                <div>
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                    Frequently Asked Question
                  </p>

                  <h2 className="text-sm font-semibold leading-5 text-zinc-100 light:text-black">
                    {selectedFAQ.question}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFAQ(null)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200 light:hover:bg-black/5 light:hover:text-black"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* Answer */}
              <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
                <p className="whitespace-pre-line text-xs leading-6 text-zinc-500">
                  {selectedFAQ.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Help;
