const CircleLoader = ({ className = "h-5 w-5" }: { className?: string }) => {
  return (
    <div className="flex items-center justify-center bg-transparent">
      <div
        className={`${className} border-2 border-[#D4C9BE] border-t-[#123458] rounded-full animate-spin`}
      />
    </div>
  );
};

export default CircleLoader;
