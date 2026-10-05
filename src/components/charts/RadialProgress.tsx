import { useId } from "react";
import { motion } from "framer-motion";

interface RadialProgressProps {
  progress: string;
  monthName: string;
  compact?: boolean;
}

const RadialProgress = ({
  progress,
  monthName,
  compact = false,
}: RadialProgressProps) => {
  const gradientId = useId();

  const size = compact ? 88 : 120;
  const center = size / 2;
  const stroke = compact ? 7 : 10;
  const radius = center - stroke / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min(100, Math.max(0, Number(progress) || 0));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${
        compact
          ? "gap-2"
          : "group overflow-hidden rounded-2xl border border-indigo-400/10 bg-indigo-500/3 p-5"
      }`}
    >
      {!compact && (
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-colors duration-500 group-hover:bg-indigo-500/15" />
      )}

      <div
        className="relative"
        role="progressbar"
        aria-label={`Overall completion for ${monthName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#A5B4FC" />
            </linearGradient>
          </defs>

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(99, 102, 241, 0.12)"
            strokeWidth={stroke}
          />

          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap={percentage === 0 ? "butt" : "round"}
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-indigo-100 tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      <span
        className={
          compact
            ? "text-[9px] font-medium text-indigo-300/70"
            : "mt-4 text-center text-xs font-medium text-gray-400"
        }
      >
        {compact ? "Completion" : `Overall completion rate for ${monthName}`}
      </span>
    </div>
  );
};

export default RadialProgress;
