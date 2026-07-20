const HabitProgress = ({
  progress,
  total,
  count,
  loading,
}: {
  progress: { id: string; count: number; progress: string | number }[];
  total: number;
  count: number;
  loading: boolean;
}) => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center w-full p-3.5">
        <p className="smText text-center" style={{ fontWeight: "bolder" }}>
          PROGRESS
        </p>
        <p className="text-[12px] font-semibold text-center">
          {count} / {total * progress?.length}
        </p>
      </div>
      <p
        className="text-center bg-darkPrimary light:bg-lightPrimary flex items-center text-white text-[8px]"
        style={{ fontWeight: "bold" }}
      >
        <span className="py-2.5 tracking-widest w-[70%] text-center">
          PERCENTAGE
        </span>
        <span className="py-2.5 tracking-widest w-[30%] text-center">
          COUNT
        </span>
      </p>
      {/* task input */}
      {loading ? (
        <div className="p-2 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-gray-500/50 h-7 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        progress?.map((p, index) => (
          <div
            className={`text-[12px] flex items-center ${index < progress.length-1 && 'border-b'} border-darkBox/50 light:border-lightBorder py-[5.6px]`}
            key={index}
          >
            <div
              className="w-[70%] flex items-center gap-3 px-1 ps-3"
              title={p?.progress?.toString()}
            >
              <span className="w-[25%] text-[8px]">
                {p?.progress === "100.00" ? "100" : p?.progress}%
              </span>
              <div className="w-full">
                <div
                  className="h-5 bg-darkSuccess light:bg-lightSuccess shadow-[0_0_5px_rgba(74,222,128,0.5)] rounded-sm"
                  style={{ width: `${p?.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="w-[30%] px-2 p-1 text-center text-[10px]">
              {p?.count} / {total}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default HabitProgress;
