import { useState } from "react";
import Gauge from "./Gauge";

const MonthHeader = () => {

  const [currMon, setCurrMon] = useState(Object.keys(months)[0]);

  // const taskwiseData = useSelector(
  //   (state: RootState) => state.taskwiseData
  // );
  // const progress = useAppSelector((state) => state.progress);

  // const [data, setData] = useState({
  //   totalDays: 620,
  //   totalDaysWorked: 12,
  //   progreePercent: 20,
  // });

  // const totalWorkedTill = useMemo(() => {
  //   return Object.values(taskwiseData).reduce((sum, val) => sum + val, 0);
  // }, [taskwiseData]);

  // const totalDays = useMemo(() => {
  //   return Object.keys(taskwiseData).length;
  // }, [taskwiseData]);

  // const totalDaysWorked = useMemo(() => {
  //   return Object.values(taskwiseData).reduce((sum, val) => sum + val, 0);
  // }, [taskwiseData]);

  // dispatch(setTotalDaysWorked(25));

  return (
    <>
      <div className="flex items-center justify-between">
        {/* left */}
        <div className="flex flex-col items-center justify-center">
          {/* upper */}
          <div className="flex items-center justify-center flex-col gap-2">
            <span className="text-3xl playfair-display">MARCH</span>
            <span className="text-[10px] tracking-wider font-light">HABIT TRACKER DASHBOARD</span>
          </div>
          {/* down */}
          <div className="mt-3 border flex items-center text-[12px] flex-col">
            {/* month */}
            <div className="flex items-center text-[12px]">
              <p className="min-w-25 text-center p-2 bg-tropicalAqua text-white border-r border-gray-600">MONTH</p>
              <select className="cursor-pointer outline-none min-w-25 p-2" value={currMon} onChange={(e) => setCurrMon(e.target.value)}>
                {Object.keys(months).map((month, index) => (
                  <option value={month} key={index}>{month}</option>
                ))}
              </select>
            </div>
            {/* year */}
            <div className="flex items-center text-[12px] border-t border-gray-600">
              <p className="min-w-25 text-center p-2 bg-tropicalAqua text-white border-r border-gray-600">YEAR</p>
              <select className="cursor-pointer outline-none min-w-25 p-2">
                {years.map((year, index) => (
                  <option value={year} key={index}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* mid */}
        <div className="h-full">
          <span className="text-[10px] tracking-wider font-light">DAILY PERCENTAGE PROGRESS</span>
        </div>
        <div className="border border-mutedLavender bg-periwinkleLight flex items-center justify-center gap-5 p-2 px-7">
          <div className="flex items-center justify-center flex-col w-20">
            <span className="smText">PROGRESS</span>
            <span className="text-electricBlue">0.2%</span>
          </div>
          <div className="flex items-center justify-center h-30 w-35 bg-gray-100">
            <Gauge value={0.2} />
          </div>
        </div>
      </div>
    </>
  )
}

const months = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  June: "June",
  July: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
};
const years = [2026, 2027, 2028, 2029, 2030];

export default MonthHeader