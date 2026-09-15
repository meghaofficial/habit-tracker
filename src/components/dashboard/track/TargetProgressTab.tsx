import { motion } from "framer-motion";

type TargetProgressTabProps = {
  label: string;
  total: number;
  completed: number;
  active: boolean;
  onClick: () => void;
  buttonRef?: (element: HTMLButtonElement | null) => void;
  variant?: "daily" | "week" | "monthly";
};

export const TargetProgressTab = ({
  label,
  total,
  completed,
  active,
  onClick,
  buttonRef,
  variant = "daily",
}: TargetProgressTabProps) => {
  const hasTargets = total > 0;

  const progress = hasTargets ? Math.min(completed / total, 1) : 0;

  const isComplete = hasTargets && completed === total;

  const svgWidth = variant === "daily" ? 32 : variant === "week" ? 64 : 72;

  console.log();

  return (
    <div className="relative shrink-0 group">
      {/* Tooltip */}
      {hasTargets && (
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            -top-9
            z-50
            -translate-x-1/2
            whitespace-nowrap
            rounded-md
            border border-white/10
            bg-[#111116]
            px-2.5
            py-1.5
            text-[10px]
            font-medium
            text-gray-300
            opacity-0
            shadow-xl
            transition-all duration-200
            group-hover:-top-10
            group-hover:opacity-100
          "
        >
          {isComplete ? (
            <rect
              x="1"
              y="1"
              width={svgWidth - 2}
              height="30"
              rx="6"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
            />
          ) : (
            <motion.rect
              x="1"
              y="1"
              width={svgWidth - 2}
              height="30"
              rx="6"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: progress,
              }}
              transition={{
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          )}
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={onClick}
        className={`
    relative
    flex
    h-8
    shrink-0
    items-center
    justify-center
    rounded-lg
    whitespace-nowrap
    text-[11px]
    font-semibold
    cursor-pointer
    transition-colors
    duration-200

    ${
      variant === "daily"
        ? "w-8"
        : variant === "week"
          ? "min-w-16 px-3"
          : "min-w-18 px-3"
    }

    ${
      active
        ? "bg-indigo-500/10 text-indigo-300"
        : "bg-transparent text-gray-500 hover:bg-white/2.5 hover:text-gray-300"
    }
  `}
      >
        {!hasTargets && (
          <span className="absolute inset-0 rounded-lg border border-white/5" />
        )}

        {hasTargets && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${svgWidth} 32`}
            fill="none"
          >
            {/* Base border */}
            <rect
              x="1"
              y="1"
              width={svgWidth - 2}
              height="30"
              rx="6"
              stroke={
                isComplete
                  ? "rgba(52, 211, 153, 0.20)"
                  : "rgba(99, 102, 241, 0.22)"
              }
              strokeWidth="2"
            />

            {/* Progress / completed border */}
            {isComplete ? (
              <rect
                x="1"
                y="1"
                width={svgWidth - 2}
                height="30"
                rx="6"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
              />
            ) : (
              <motion.rect
                x="1"
                y="1"
                width={svgWidth - 2}
                height="30"
                rx="6"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: progress,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            )}
          </svg>
        )}

        {active && hasTargets && (
          <motion.span
            className="
        pointer-events-none
        absolute
        inset-0
        rounded-lg
        bg-indigo-500/2.5
      "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        <span className="relative z-10">{label}</span>
      </button>
    </div>
  );
};
