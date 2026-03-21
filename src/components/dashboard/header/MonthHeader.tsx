import { useEffect, useState } from "react";
import Gauge from "./Gauge";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { months } from "../../../staticData";
import { useParams } from "react-router-dom";

const MonthHeader = () => {

  const [currMon, setCurrMon] = useState("");
  const { month } = useParams();
  const [currYear, setCurrYear] = useState(0);
  const [subscriptionUpto, setSubscriptionUpto] = useState(4); //years
  const [totalYears, setTotalYears] = useState<number[]>([]);
  const progress = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    const date = new Date();
    setCurrMon(month || "");
    setCurrYear(date.getFullYear());
  }, [month]);

  useEffect(() => {
    if (subscriptionUpto !== undefined && subscriptionUpto !== null) {
      const arr = Array.from(
        { length: subscriptionUpto },
        (_, index) => currYear + index + 1
      );
      setTotalYears([currYear, ...arr]);
    }
  }, [subscriptionUpto, currYear]);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex flex-col items-center justify-center">
          {/* upper */}
          <div className="flex items-center justify-center flex-col gap-2">
            <span className="text-3xl playfair-display">{months?.[currMon]}</span>
            <span className="text-[10px] tracking-wider">HABIT TRACKER DASHBOARD</span>
          </div>
          {/* down */}
          <div className="mt-3 border flex items-center text-[12px] flex-col">
            {/* month */}
            <div className="flex items-center text-[12px]">
              <p className="min-w-32 text-center py-1 px-2 bg-headerBg text-headerText font-semibold border-r border-gray-600">MONTH</p>
              <select className="cursor-pointer outline-none min-w-25 px-2" value={currMon} onChange={(e) => setCurrMon(e.target.value)}>
                {Object.keys(months).map((month, index) => (
                  <option value={month} key={index}>{month}</option>
                ))}
              </select>
            </div>
            {/* year */}
            <div className="flex items-center text-[12px] border-t border-gray-600">
              <p className="min-w-32 text-center py-1 px-2 bg-headerBg text-headerText font-semibold border-r border-gray-600">YEAR</p>
              <select className="cursor-pointer outline-none min-w-25 px-2" value={currYear} onChange={(e) => setCurrYear(+e.target.value)}>
                {totalYears.map((year, index) => (
                  <option value={year} key={index}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* mid */}
        <div className="h-full relative -top-10">
          <span className="text-[10px] tracking-wider font-light">DAILY PERCENTAGE PROGRESS</span>
        </div>
        <div className="relative border border-mutedLavender bg-lightPink flex items-center justify-center gap-5 p-2 px-7">
          <div className="flex items-center justify-center flex-col w-18">
            <span className="tracking-wider text-xs">PROGRESS</span>
            <span className="text-headerText font-semibold mt-1">{progress?.progressPercent}%</span>
          </div>
          <span className="absolute right-13 text-xs text-[#AB6466] font-semibold">{progress?.totalDaysWorked} / {progress?.totalDays}</span>
          <div className="flex items-center justify-center h-25 w-20 bg-transparent">
            <Gauge value={0.2} />
          </div>
        </div>
      </div>
    </>
  )
}

export default MonthHeader