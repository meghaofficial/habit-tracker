import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const RotatingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const shouldAnimate = words.length > 1;

  useEffect(() => {
    if (!shouldAnimate) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative h-7 sm:h-9 overflow-hidden flex-1">
      <AnimatePresence mode="wait">
        {shouldAnimate ? (
          <motion.div
            key={words[index]}
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 w-full text-[16px] sm:text-[22px] leading-none font-black text-white google-sans line-clamp-1"
            title={words[index]}
          >
            {words[index]}
          </motion.div>
        ) : (
          <div
            className="absolute left-0 w-full text-[16px] sm:text-[22px] leading-none font-black text-white google-sans line-clamp-1"
            title={words[0]}
          >
            {words[0]}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
