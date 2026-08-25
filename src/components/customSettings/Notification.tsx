import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
  FaBell,
  FaCalendarCheck,
  FaCreditCard,
  FaStar,
  FaTrophy,
  FaShieldAlt,
  FaBrain,
  FaCheck,
  FaLock,
} from "react-icons/fa";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  locked?: boolean;
}

interface NotificationSection {
  title: string;
  items: NotificationItem[];
}

const Notification = () => {
  const [notifications, setNotifications] =
    useState<NotificationSection[]>([
      {
        title: "REMINDERS",
        items: [
          {
            id: "daily-reminders",
            title: "Daily Reminders",
            description:
              "Get reminded about your daily tasks and habits.",
            icon: FaCalendarCheck,
            enabled: true,
          },
          {
            id: "weekly-summary",
            title: "Weekly Progress Summary",
            description:
              "Receive a summary of your weekly progress.",
            icon: FaBell,
            enabled: false,
          },
        ],
      },

      {
        title: "PRODUCTIVITY",
        items: [
          {
            id: "task-updates",
            title: "Task & Habit Updates",
            description:
              "Stay informed about important task and habit updates.",
            icon: FaCheck,
            enabled: false,
          },
          {
            id: "achievements",
            title: "Achievements & Milestones",
            description:
              "Celebrate streaks, milestones and personal achievements.",
            icon: FaTrophy,
            enabled: true,
          },
        ],
      },

      {
        title: "AI COACH",
        items: [
          {
            id: "ai-coach",
            title: "AI Coach Updates",
            description:
              "Receive personalized insights, recommendations and motivation.",
            icon: FaBrain,
            enabled: true,
          },
        ],
      },

      {
        title: "ACCOUNT",
        items: [
          {
            id: "payments",
            title: "Payments",
            description:
              "Payment confirmations, receipts and payment alerts.",
            icon: FaCreditCard,
            enabled: true,
            locked: true,
          },
          {
            id: "subscription",
            title: "Subscription",
            description:
              "Important subscription changes, renewals and expiry alerts.",
            icon: FaStar,
            enabled: true,
            locked: true,
          },
          {
            id: "security",
            title: "Security & System",
            description:
              "Important security, account and system notifications.",
            icon: FaShieldAlt,
            enabled: true,
            locked: true,
          },
        ],
      },
    ]);

  const [showSaved, setShowSaved] = useState(false);

  const toggleNotification = (
    sectionIndex: number,
    itemId: string
  ) => {
    setNotifications((prev) =>
      prev.map((section, sIndex) => {
        if (sIndex !== sectionIndex) return section;

        return {
          ...section,
          items: section.items.map((item) => {
            if (item.id !== itemId || item.locked) {
              return item;
            }

            return {
              ...item,
              enabled: !item.enabled,
            };
          }),
        };
      })
    );

    setShowSaved(true);

    setTimeout(() => {
      setShowSaved(false);
    }, 1800);
  };

  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            {/* Notification icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10">
              <FaBell className="h-4 w-4 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-zinc-600">
                Stay informed about what matters to you.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Choose which notifications you want to receive.
          </p>
        </div>

        {/* Saved Indicator */}
        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{
                opacity: 0,
                y: -6,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -6,
                scale: 0.95,
              }}
              transition={{
                duration: 0.2,
              }}
              className="flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3.5 py-2 text-xs font-medium text-emerald-400"
            >
              <FaCheck className="h-3 w-3" />
              Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================
          NOTIFICATION SECTIONS
      ====================================================== */}
      <div className="space-y-7">
        {notifications.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: sectionIndex * 0.06,
            }}
          >
            {/* =================================================
                SECTION TITLE
            ================================================== */}
            <div className="mb-3 flex items-center gap-3 px-1">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-600">
                {section.title}
              </span>

              <div className="h-px flex-1 bg-white/4" />
            </div>

            {/* =================================================
                SECTION CARD
            ================================================== */}
            <div className="overflow-hidden rounded-2xl border border-white/6 bg-zinc-950/50">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{
                      backgroundColor:
                        "rgba(255,255,255,0.018)",
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className={`flex items-center justify-between gap-5 px-5 py-4.5 transition-colors ${
                      itemIndex !== section.items.length - 1
                        ? "border-b border-white/4.5"
                        : ""
                    }`}
                  >
                    {/* =================================================
                        LEFT CONTENT
                    ================================================== */}
                    <div className="flex min-w-0 items-center gap-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{
                          scale: item.locked ? 1 : 1.04,
                        }}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          item.locked
                            ? "border-zinc-800 bg-zinc-900 text-zinc-600"
                            : item.enabled
                              ? "border-indigo-400/10 bg-indigo-500/8 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.04)]"
                              : "border-zinc-800 bg-zinc-900/70 text-zinc-600"
                        }`}
                      >
                        <Icon className="h-4.25 w-4.25" />
                      </motion.div>

                      {/* Text */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-medium transition-colors ${
                              item.enabled
                                ? "text-zinc-200"
                                : "text-zinc-400"
                            }`}
                          >
                            {item.title}
                          </h3>

                          {/* Locked badge */}
                          {item.locked && (
                            <span className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600">
                              <FaLock className="h-2 w-2" />
                              Required
                            </span>
                          )}
                        </div>

                        <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-600">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      type="button"
                      disabled={item.locked}
                      onClick={() =>
                        toggleNotification(
                          sectionIndex,
                          item.id
                        )
                      }
                      aria-label={`${
                        item.enabled
                          ? "Disable"
                          : "Enable"
                      } ${item.title}`}
                      className={`relative h-6 w-11 shrink-0 rounded-full border transition-all duration-300 ${
                        item.locked
                          ? "cursor-not-allowed border-zinc-800 bg-zinc-900"
                          : item.enabled
                            ? "border-indigo-400/30 bg-indigo-500/20"
                            : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      <motion.span
                        animate={{
                          x: item.enabled ? 21.5 : 2,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className={`absolute left-0.5 top-[3.5px] h-4 w-4 rounded-full transition-colors ${
                          item.enabled
                            ? "bg-indigo-400"
                            : "bg-zinc-600"
                        }`}
                      />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* =====================================================
          INFORMATION FOOTER
      ====================================================== */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.4,
        }}
        className="mt-8 flex items-start gap-3 rounded-xl border border-white/5 bg-white/1.5 px-4 py-3.5"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
          <FaShieldAlt className="h-3 w-3 text-zinc-600" />
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-500">
            Important notifications
          </p>

          <p className="mt-1 text-[11px] leading-5 text-zinc-600">
            Payments, subscription and security notifications
            are always enabled to keep you informed about
            important account activity.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Notification;