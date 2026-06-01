// type CustomButtonProps = {
//   children: ReactNode; // Allows passing elements between the tags
//   type?: string;
//   textSize?: string;
//   onClick?: () => void;
// };

import type { ReactNode } from "react";

// export default function CustomButton({
//   type = "default",
//   textSize = "12px",
//   children,
//   onClick,
// }: CustomButtonProps) {
//   return (
//     <>
//       {type === "default" && (
//         <button
//           onClick={onClick}
//           className="
//         relative overflow-hidden
//         rounded-full
//         px-3 py-1.5
//         text-[18px] font-semibold text-white
//         bg-linear-to-r from-[#5B5CF6] via-[#4F8CFF] to-[#9B5CFF]
//         shadow-[0_4px_20px_rgba(91,92,246,0.45)]
//         transition-all duration-300
//         hover:scale-[1.02]
//         active:scale-[0.98]
//       "
//         >
//           <p className={`relative z-10 pb-px text-[${textSize}]`}>{children}</p>
//         </button>
//       )}
//       {type === "white" && (
//         <button
//           onClick={onClick}
//           className="
//         relative overflow-hidden
//         rounded-full
//         px-3 py-1.5
//         text-[18px] font-semibold
//         bg-white
//         shadow-[0_4px_20px_rgba(91,92,246,0.45)]
//         transition-all duration-300
//         hover:scale-[1.02]
//         active:scale-[0.98]
//       "
//         >
//           <div className={`relative z-10 pb-px text-[${textSize}]`}>{children}</div>
//         </button>
//       )}
//       {type === "transparent" && (
//         <button
//           onClick={onClick}
//           className="
//         relative overflow-hidden
//         rounded-full
//         px-3 py-1.5
//         text-[18px] font-semibold text-violet-500
//         bg-linear-to-r from-[#5B5CF6]/20 via-[#4F8CFF]/20 to-[#9B5CFF]/20
//         transition-all duration-300
//         hover:scale-[1.02]
//         active:scale-[0.98]
//       "
//         >
//           <p className={`relative z-10 pb-px text-[${textSize}]`}>{children}</p>
//         </button>
//       )}
//     </>
//   );
// }

type CustomButtonProps = {
  children: ReactNode;
  type?: "default" | "white" | "transparent"; // Restricts types to exact choices
  textSize?: string;
  onClick?: () => void;
  styling?: string;
};

export default function CustomButton({
  type = "default",
  textSize = "12px",
  children,
  onClick,
  styling
}: CustomButtonProps) {
  
  // Base styles shared by all button variants
  const baseStyles = "relative overflow-hidden rounded-full px-3 py-1.5 text-[18px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";

  // Variant specific styles
  const variants = {
    default: "text-white bg-linear-to-r from-[#5B5CF6] via-[#4F8CFF] to-[#9B5CFF] shadow-[0_4px_20px_rgba(91,92,246,0.45)]",
    white: "bg-white text-black shadow-[0_4px_20px_rgba(91,92,246,0.45)]",
    transparent: "text-violet-500 bg-linear-to-r from-[#5B5CF6]/20 via-[#4F8CFF]/20 to-[#9B5CFF]/20",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[type]} ${styling}`}
    >
      {/* Replaced <p> with <div> to prevent invalid HTML nesting */}
      <div 
        className="relative z-10 pb-px" 
        style={{ fontSize: textSize }} // Fixed: Dynamic values must use the style prop
      >
        {children}
      </div>
    </button>
  );
}
