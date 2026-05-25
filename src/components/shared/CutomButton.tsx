type CustomButtonProps = {
  title: string;
  onClick?: () => void;
};

export default function CustomButton({
  type = "default",
  textSize = "12px",
  title,
  onClick,
}: CustomButtonProps) {
  return (
    <>
      {type === "default" && (
        <button
          onClick={onClick}
          className="
        relative overflow-hidden
        rounded-full
        px-3 py-1.5
        text-[18px] font-semibold text-white
        bg-linear-to-r from-[#5B5CF6] via-[#4F8CFF] to-[#9B5CFF]
        shadow-[0_4px_20px_rgba(91,92,246,0.45)]
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
      "
        >
          <p className={`relative z-10 pb-px text-[${textSize}]`}>{title}</p>
        </button>
      )}
      {type === "white" && (
        <button
          onClick={onClick}
          className="
        relative overflow-hidden
        rounded-full
        px-3 py-1.5
        text-[18px] font-semibold
        bg-white
        shadow-[0_4px_20px_rgba(91,92,246,0.45)]
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
      "
        >
          <p className={`relative z-10 pb-px text-[${textSize}]`}>{title}</p>
        </button>
      )}
      {type === "transparent" && (
        <button
          onClick={onClick}
          className="
        relative overflow-hidden
        rounded-full
        px-3 py-1.5
        text-[18px] font-semibold text-violet-500
        bg-linear-to-r from-[#5B5CF6]/20 via-[#4F8CFF]/20 to-[#9B5CFF]/20
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
      "
        >
          <p className={`relative z-10 pb-px text-[${textSize}]`}>{title}</p>
        </button>
      )}
    </>
  );
}