import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const MonthProgressSideSection = ({ rows }: { rows: number }) => {

  const taskwiseData = useSelector(
    (state: RootState) => state.taskwiseData
  );

  const calculatePercent = (index: number) => {
    const total = 31;
    const workedTill = taskwiseData[index]?.count || 0;
    return Math.floor((workedTill / total) * 100);
  }
  // const totalWorkedTill = useMemo(() => {
  //   return Object.values(taskwiseData).reduce((sum, val) => sum + val, 0);
  // }, [taskwiseData]);

  return (
    <div className="border">
      <div className="flex flex-col items-center justify-center w-full bg-orchidPetal border-b border-black p-3.5">
        <p className="smText text-white text-center" style={{ fontWeight: "bolder" }}>PROGRESS</p>
        {/* <p className="text-[12px] text-white text-center">{totalWorkedTill} / 620</p> */}
      </div>
      <p className="smText p-[8.5px] text-center bg-mauveShadow border-b border-orchidPetal flex items-center" style={{ fontWeight: "bold" }}>
        <span className="w-[30%]">GOAL</span>
        <span className="w-[40%]">PERCENTAGE</span>
        <span className="w-[30%]">COUNT</span>
      </p>
      {/* task input */}
      {Array.from({ length: rows }).map((_, index) => (
        <div className="text-[12px] flex items-center gap-2 border-b border-gray-300" key={index}>
          <input type="text" className="outline-none w-[30%] h-full px-2 p-1 border-r border-gray-300" title="value" />
          <div className="w-[40%] border-r border-gray-300 flex items-center pe-1 gap-1">
            <span>{calculatePercent(index)}%</span>
            <div className="h-5 bg-electricBlue rounded" style={{ width: `${calculatePercent(index)}%` }}></div>
          </div>
          {/* <p className="w-[30%] px-2 p-1 text-center">{taskwiseData[index] || 0} / 31</p> */}
        </div>
      ))}
    </div>
  )
}

export default MonthProgressSideSection