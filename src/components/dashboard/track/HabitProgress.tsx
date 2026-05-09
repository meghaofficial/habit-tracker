const HabitProgress = ({ progress, total, count }: { progress: { id: string, count: number, progress: string | number }[], total: number, count: number }) => {

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center w-full p-3.5">
        <p className="smText text-center" style={{ fontWeight: "bolder" }}>PROGRESS</p>
        <p className="text-[12px] font-semibold text-center">{count} / {total*progress?.length}</p>
      </div>
      <p className="text-center bg-darkPrimary light:bg-lightPrimary flex items-center text-[8px]" style={{ fontWeight: "bold" }}>
        <span className="py-2.5 tracking-widest w-[70%] text-center">PERCENTAGE</span>
        <span className="py-2.5 tracking-widest w-[30%] text-center">COUNT</span>
      </p>
      {/* task input */}
      {progress?.map((p, index) => (
        <div className="text-[12px] flex items-center border-b border-gray-700 py-1.5" key={index}>
          <div className="w-[70%] flex items-center gap-4 px-1 ps-3" title={p?.progress?.toString()}>
            <span className="w-[10%] text-[8px]">{p?.progress}%</span>
            <div className="w-[90%]">
              <div className="h-5 bg-darkSuccess light:bg-lightSuccess rounded-sm" style={{ width: `${p?.progress}%` }}></div>
            </div>
          </div>
          <p className="w-[30%] px-2 p-1 text-center text-[10px]">{p?.count} / {total}</p>
        </div>
      ))}
    </div>
  )
}

export default HabitProgress