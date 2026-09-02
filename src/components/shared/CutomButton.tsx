import type { ReactNode } from "react";

type CustomButtonProps = {
  children: ReactNode;
  type?: "default" | "white" | "transparent" | "success" | "cancel";
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
  
  const baseStyles =
    `relative overflow-hidden ${rounded} ${!disabled && "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow"} px-3 py-1.5 text-[18px] font-semibold`;

    // shadow-[0_4px_20px_rgba(91,92,246,0.45)]
  const variants: Record<string, string> = {
    default:
      "text-white bg-linear-to-r from-[#5B5CF6] via-[#4F8CFF] to-[#9B5CFF]",
    white: `${disabled ? "bg-white/60 text-black/90" : "bg-white text-black"}`,
    transparent:
      "text-violet-500 bg-linear-to-r from-[#5B5CF6]/20 via-[#4F8CFF]/20 to-[#9B5CFF]/20",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[type]} ${styling}`}
      disabled={disabled}
      title={title}
      style={{
        cursor: disabled ? "default" : "pointer"
      }}
    >
      <div
        className="relative z-10 pb-px"
        style={{ fontSize: textSize }}
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
    success: `${disabled ? "bg-darkSuccess/50" : "bg-darkSuccess hover:scale-[1.02]"} text-black`,
    cancel: `${disabled ? "text-white/50" : "hover:bg-white/10 text-white"} bg-white/5 border border-white/10`
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${disabled ? "cursor-default" : "cursor-pointer"} w-full rounded-xl text-[${textSize}] py-2 font-semibold transition-all duration-300 ${colorStyling[type]} ${styling}`}
    >
      {children}
    </button>
  );
};
