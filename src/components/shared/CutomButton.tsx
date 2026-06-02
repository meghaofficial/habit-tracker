import type { ReactNode } from "react";

type CustomButtonProps = {
  children: ReactNode;
  type?: "default" | "white" | "transparent" | "success" | "cancel"; // Restricts types to exact choices
  textSize?: string;
  onClick?: () => void;
  styling?: string;
  disabled?: boolean;
  title?: string;
  rounded?: string;
};

export default function CustomButton({
  type = "default",
  textSize = "12px",
  children,
  onClick,
  styling,
  disabled=false,
  title,
  rounded="rounded-full"
}: CustomButtonProps) {
  // Base styles shared by all button variants
  const baseStyles =
    `relative overflow-hidden ${rounded} px-3 py-1.5 text-[18px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`;

  // Variant specific styles
  const variants: Record<string, string> = {
    default:
      "text-white bg-linear-to-r from-[#5B5CF6] via-[#4F8CFF] to-[#9B5CFF] shadow-[0_4px_20px_rgba(91,92,246,0.45)]",
    white: "bg-white text-black shadow-[0_4px_20px_rgba(91,92,246,0.45)]",
    transparent:
      "text-violet-500 bg-linear-to-r from-[#5B5CF6]/20 via-[#4F8CFF]/20 to-[#9B5CFF]/20",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[type]} ${styling}`}
      disabled={disabled}
      title={title}
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
export const CustomButtonForm = ({
  type = "default",
  textSize = "14px",
  children,
  onClick,
  styling,
  disabled=false,
  title
}: CustomButtonProps) => {

  const colorStyling: Record<string, string> = {
    success: "bg-darkSuccess text-black hover:scale-[1.02]",
    cancel: "bg-white/5 border border-white/10 hover:bg-white/10"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-full rounded-2xl text-[${textSize}] py-3 font-semibold transition-all duration-300 ${colorStyling[type]} ${styling}`}
    >
      {children}
    </button>
  );
};
