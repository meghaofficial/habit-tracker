import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";

const MonthProgressSideSection = ({ rows }: { rows: number }) => {

  const taskwiseData = useSelector(
    (state: RootState) => state.taskwiseData
  );
  const progress = useSelector((state: RootState) => state.progress);

  return (
    <div className="border">
      <div className="flex flex-col items-center justify-center w-full text-subHeaderText bg-subHeaderBg border-b border-black p-3.5">
        <p className="smText text-center" style={{ fontWeight: "bolder" }}>PROGRESS</p>
        <p className="text-[12px] font-semibold text-center">{progress?.totalDaysWorked} / {progress?.totalDays}</p>
      </div>
      <p className="text-center bg-smHeaderBg border-b border-subHeaderText flex items-center text-[8px]" style={{ fontWeight: "bold" }}>
        <span className="py-[9.5px] tracking-widest w-[30%] text-center">GOAL</span>
        <span className="py-[9.5px] tracking-widest w-[40%] text-center">PERCENTAGE</span>
        <span className="py-[9.5px] tracking-widest w-[30%] text-center">COUNT</span>
      </p>
      {/* task input */}
      {Array.from({ length: rows }).map((_, index) => (
        <div className="text-[12px] flex items-center border-b border-gray-300" key={index}>
          <input type="text" className="outline-none w-[30%] h-full px-2 p-1 border-r border-gray-300" title="value" />
          <div className="w-[40%] border-r border-gray-300 flex items-center gap-3 px-1">
            <span className="w-[10%] text-[8px]">{taskwiseData?.[index]?.progress}%</span>
            <div className="w-[90%]">
              <div className="h-5 bg-headerBg" style={{ width: `${taskwiseData?.[index]?.progress}%` }}></div>
            </div>
          </div>
          <p className="w-[30%] px-2 p-1 text-center">{taskwiseData?.[index]?.count} / 31</p>
        </div>
      ))}
    </div>
  )
}

export default MonthProgressSideSection