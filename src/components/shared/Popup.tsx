import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { FiX } from "react-icons/fi";

interface PopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: React.ReactNode;
  subHeading?: string;
  heading: string;
  maxW?: string;
}

const Popup: React.FC<PopupProps> = ({
  open,
  setOpen,
  children,
  subHeading,
  heading,
  maxW = "max-w-2xl",
}) => {
  if (!open) return null;

  return (
    // <div className="fixed inset-0 z-999999 overflow-y-auto">
    //   {/* Overlay */}
    //   <div
    //     className="absolute inset-0 bg-black/50"
    //     onClick={() => setOpen(false)}
    //   />

    //   {/* Wrapper */}
    //   <div className="relative min-h-screen overflow-y-hidden flex items-center justify-center p-6">
    //     {/* Modal */}
    //     <div className="relative z-10 w-200 max-w-full rounded-3xl">
    //       <button
    //         onClick={() => setOpen(false)}
    //         className="absolute top-3 right-3 text-gray-500"
    //       >
    //         ✕
    //       </button>

    //       {children}
    //     </div>
    //   </div>
    // </div>

    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
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
            className={`w-full ${maxW} overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_25px_80px_rgba(0,0,0,0.45)] light:border-black/8 light:bg-white`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/6 px-5 py-4 light:border-black/6">
              <div>
                {subHeading && (
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                    {subHeading}
                  </p>
                )}
                <h2 className="text-sm font-semibold leading-5 text-zinc-100 light:text-black">
                  {heading}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200 light:hover:bg-black/5 light:hover:text-black"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
