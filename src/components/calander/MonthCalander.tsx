import { useEffect, useState } from "react";
import { week } from "../../staticData";
import { getDaysInMonth, getFirstDayOfMonth } from "../../helper";

const MonthCalander = ({ year, month }: { year: number; month: number }) => {

  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);

  useEffect(() => {
    const res = getDaysInMonth(year, month);
    setTotalD(res);
    const firstDayNo = getFirstDayOfMonth(year, month);
    setFirstDay(firstDayNo);
  }, [month]);

  return (
    <>
      <div className="grid grid-cols-7 google-sans text-[12px] mt-2 text-gray-400">
        {Object.values(week).map((w, index) => (
          <span key={index} className="text-center">{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 google-sans mt-2">
        {Array.from({ length: totalD+firstDay }).map((_, index) => (
          <span key={index} className="text-center p-5">{index+1 > firstDay ? index+1-firstDay : ""}</span>
        ))}
      </div>
    </>
  )
}

export default MonthCalander
