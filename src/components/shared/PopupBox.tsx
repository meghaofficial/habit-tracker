import React from "react";
import { IoClose } from "react-icons/io5";

interface PopupBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function PopupBox({
  open,
  setOpen,
  children,
}: PopupBoxProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-full max-w-lg
          overflow-hidden
          bg-[#111321]
          border border-indigo-500/15
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
          rounded-2xl
        "
      >
        {/* Subtle top glow */}
        <div
          className="
            absolute -top-24 left-1/2
            h-48 w-48
            -translate-x-1/2
            rounded-full
            bg-indigo-500/10
            blur-3xl
            pointer-events-none
          "
        />

        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="
            absolute right-4 top-4 z-20
            flex h-9 w-9 items-center justify-center
            rounded-xl
            text-gray-400
            transition-all duration-200
            hover:bg-white/5
            hover:text-white
            hover:rotate-90
            cursor-pointer
          "
        >
          <IoClose size={21} />
        </button>

        {/* Content */}
        <div className="relative p-6 sm:p-7 h-screen overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}