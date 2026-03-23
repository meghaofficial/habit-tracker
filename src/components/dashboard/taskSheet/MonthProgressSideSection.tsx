import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useParams } from "react-router-dom";

const MonthProgressSideSection = ({ rows }: { rows: number }) => {

  const { year, month } = useParams<{ year: string, month: string }>();
    const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );

  return (
    <div className="border">
      <div className="flex flex-col items-center justify-center w-full text-subHeaderText bg-subHeaderBg border-b p-3.5">
        <p className="smText text-center" style={{ fontWeight: "bolder" }}>PROGRESS</p>
        <p className="text-[12px] font-semibold text-center">{year && month && monthlyData[year][month].progress.totalDaysWorked} / {year && month && monthlyData[year][month].overallTotalDays}</p>
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
            <span className="w-[10%] text-[8px]">{year && month && monthlyData[year][month].taskwise[index].progress}%</span>
            <div className="w-[90%]">
              <div className="h-5 bg-headerBg" style={{ width: `${year && month && monthlyData[year][month].taskwise[index].progress}%` }}></div>
            </div>
          </div>
          <p className="w-[30%] px-2 p-1 text-center">{year && month && monthlyData[year][month].taskwise[index].count} / {year && month && monthlyData[year][month].totalDaysInMonth}</p>
        </div>
      ))}
    </div>
  )
}

export default MonthProgressSideSection