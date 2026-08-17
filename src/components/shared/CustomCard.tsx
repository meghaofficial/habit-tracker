import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FramerTypes = {
  initialOpacity: number;
  initialY: number;
  animateOpacity: number;
  animateY: number;
  duration: number;
  delay: number;
};

type CardHeaderTypes = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subTitle: string;
};

type CustomCardTypes = {
  children: ReactNode;
} & Partial<FramerTypes> &
  CardHeaderTypes;

const CustomCard = ({
  initialOpacity,
  initialY,
  animateOpacity,
  animateY,
  duration,
  delay,
  icon: Icon,
  title,
  subTitle,
  children,
}: CustomCardTypes) => {
  return (
    <motion.div
      initial={{ opacity: initialOpacity, y: initialY }}
      animate={{ opacity: animateOpacity, y: animateY }}
      transition={{ duration: duration, delay: delay }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
    >
      <div className="absolute bottom-0 right-0 w-44 h-28 sm:w-56 sm:h-36 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 left-0 w-36 h-36 sm:w-44 sm:h-44 bg-indigo-500/5 rounded-full blur-3xl" />
      <div>
        {/* Card Header */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Icon size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-[10px] text-gray-500">{subTitle}</p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
};

export default CustomCard;
