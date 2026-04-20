import React from "react";

interface PopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ open, setOpen, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-darkBg light:bg-lightBg rounded-2xl shadow-xl p-6 w-200 min-h-100">

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Content */}
        {children || <p>This is a popup</p>}
      </div>
    </div>
  );
};

export default Popup;