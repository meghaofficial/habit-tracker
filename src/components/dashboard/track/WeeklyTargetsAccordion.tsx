import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TargetsList from "./TargetsList";

export const WeeklyTargetsAccordion = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 mt-4 w-full">
      <div className="rounded-xl overflow-hidden bg-darkCard light:bg-lightCard shadow-sm w-full">
        {/* Header */}
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
        >
          Add Weekly Targets
          <span className="text-xl">
            {open ? "-" : "+"}
          </span>
        </button>

        {/* Content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="bg-darkCard light:bg-lightCard border border-gray-700 w-1/3 rounded-2xl p-2 min-w-80 min-h-80" key={index}>
                  <p className="font-semibold text-md px-5 py-3">Week {index+1} Targets</p>
                  <TargetsList />
                </div>
              ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};