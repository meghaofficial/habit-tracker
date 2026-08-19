import { motion } from "framer-motion";

const RadialProgress = ({ progress, monthName }: { progress: string, monthName: string }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (Number(progress) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-white/1 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all duration-500" />

      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background Ring */}
        <circle
          stroke="rgba(255, 255, 255, 0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active Ring */}
        <motion.circle
          stroke="url(#yellowGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
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
      </svg>

      <div className="absolute text-center">
        <span className="text-2xl font-black text-white">
          {progress}%
        </span>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
          Score
        </p>
      </div>

      <span className="mt-4 text-xs font-medium text-gray-300 text-center">
        Overall completion rate for {monthName}
      </span>
    </div>
  );
};

export default RadialProgress;
