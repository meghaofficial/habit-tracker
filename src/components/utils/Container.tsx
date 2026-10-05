import { motion } from "framer-motion";
import type { ReactNode } from "react";
import CardHeader from "../shared/CardHeader";

const Container = ({
  children,
  icon,
  title,
  subTitle,
}: {
  children: ReactNode;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subTitle?: string;
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 w-full flex flex-col justify-between h-auto"
      >
        <div className="h-full flex flex-col">
          {/* Header (styled like Monthly Notes) */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/8">
            <CardHeader icon={icon} title={title} subTitle={subTitle || ""} />
          </div>

          {/* Body wrapper */}
          {children}
        </div>
      </motion.div>
    </>
  );
};

export default Container;
