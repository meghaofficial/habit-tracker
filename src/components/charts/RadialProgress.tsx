import { motion } from "framer-motion";

interface RadialProgressProps {
  progress: string;
  monthName: string;
}

const RadialProgress = ({ progress, monthName }: RadialProgressProps) => {
  const radius = 60;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const percentage = Math.min(100, Math.max(0, Number(progress) || 0));

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-white/1 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all duration-500" />

      <div className="relative">
        <svg width={radius * 2} height={radius * 2} className="-rotate-90">
          <defs>
            <linearGradient
              id="yellowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
          />

          {/* Progress */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="url(#yellowGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: circumference,
            }}
            animate={{
              strokeDashoffset,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-white">{percentage}%</span>
        </div>
      </div>

      <span className="mt-4 text-xs font-medium text-gray-300 text-center">
        Overall completion rate for {monthName}
      </span>
    </div>
  );
};

export default RadialProgress;
