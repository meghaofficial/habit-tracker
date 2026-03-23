import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TaskData } from "../../../types";

const TopTen = () => {

  const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );
  const { year, month } = useParams();
  const [top, setTop] = useState<TaskData[]>([]);

  useEffect(() => {
    if (!year || !month) return;
    const curr = monthlyData[year][month];
    const sorted = Object.entries(curr.taskwise)
      .sort(([, a], [, b]) => b.count - a.count)
      .reduce((acc, [_, value], index) => {
        acc[index] = value;
        return acc;
      }, {} as typeof curr.taskwise);
      
    Object.values(sorted).length > 5 ?
      setTop(Object.values(sorted).slice(0, 5)) : setTop(Object.values(sorted));
  }, [monthlyData]);

  return (
    <>
      <div className="border">
        <p className="smText text-center p-3.5 text-subHeaderText bg-subHeaderBg border-b" style={{ fontWeight: "bolder" }}>TOP 5 MOST CONSISTENT HABITS</p>
        <p className="text-center bg-smHeaderBg border-b border-subHeaderText flex items-center text-[8px] font-semibold">
          <span className="py-[9.5px] tracking-widest w-[70%] text-center">HABIT</span>
          <span className="py-[9.5px] tracking-widest w-[30%] text-center">PERCENTAGE</span>
        </p>
        {/* task input */}
        {top?.length > 0 && top?.map((d, index) => (
          <div className="text-[10px] flex items-center border-b border-gray-300" key={index}>
            <p className="w-[70%] px-1 border-r border-gray-300 text-center">
              {d.task}
            </p>
            <p className="w-[30%] px-2 p-1 text-center">{d.progress}%</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default TopTen
