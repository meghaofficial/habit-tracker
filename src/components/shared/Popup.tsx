import React from "react";

interface PopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ open, setOpen, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999999 overflow-y-auto">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Wrapper */}
      <div className="relative min-h-screen overflow-y-hidden flex items-center justify-center p-6">
        {/* Modal */}
        <div className="relative z-10 w-200 max-w-full rounded-3xl">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500"
          >
            ✕
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
