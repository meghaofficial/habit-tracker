import { useEffect, useState } from "react"
import { months, week, weekColors, weekColorsDark } from "../../../../staticData"
import { statusColors } from "../../../../types";
import { getDaysInMonth, getFirstDayOfMonth } from "../../../../helper";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import RightDrawer from "./RightDrawer";

const Calendar = ({ activeMon, currYear }: { activeMon: string, currYear: string }) => {

  const [todayDate, setTodayDate] = useState(1);
  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(1);
  const dateData = useSelector(
    (state: RootState) => state.dateData
  );
  const year = Number(currYear);
  const month = Object.keys(months).indexOf(activeMon);
  const theme = localStorage.getItem("theme");

  const getStatusColor = (date: number | null): Record<string, string> => {
    const key = `${date}-${Object.keys(months)[month]}-${year}`;
    if (key in dateData && dateData[key].status !== 'default') {
      return {
        color: statusColors[dateData[key]?.status]?.dot,
        status: dateData[key].status
      };
    }
    return {
      color: 'transparent',
      status: ''
    };
  }

  useEffect(() => {
    const res = getDaysInMonth(year, month);
    setTotalD(res);
    const firstDayNo = getFirstDayOfMonth(year, month);
    setFirstDay(firstDayNo);
  }, [month]);

  useEffect(() => {
    const date = new Date();
    const d = date.getDate();
    setTodayDate(d);
  }, []);

  return (
    <>
      <div>
        <p className="p-3 text-[40px] font-extrabold playfair-display text-center">{activeMon}</p>


        {/* Month */}
        <div className="px-1.5">
          <div className="grid grid-cols-7 google-sans text-[12px] mt-2 text-gray-400">
            {Object.values(week).map((w, index) => (
              <span key={index} className="text-center">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 google-sans mt-2 gap-1.5">
            {Array.from({ length: totalD + firstDay }).map((_, index) => (
              <div
                key={index}
                className={`text-center py-5 relative rounded-md ${todayDate === index + 1 - firstDay && 'bg-darkPrimary light:bg-lightPrimary text-white'}`}
                style={{
                  backgroundColor:
                    todayDate === index + 1 - firstDay ? //todays date
                      theme === "dark" ? "#6366f1" : "#4f46e5" :
                      index + 1 > firstDay ?
                        theme === "dark" ?
                          weekColorsDark[Math.floor((index - firstDay) / 7)] :
                          weekColors[Math.floor((index - firstDay) / 7)] :
                        theme === "dark" ? "#1e293b" : "#ffffff"
                }}
                onClick={() => {
                  if (index + 1 <= firstDay) return;
                  setOpen(prev => !prev);
                  setActiveDate(index + 1 > firstDay ? index + 1 - firstDay : -1);
                }}
              >
                <div className='h-2 w-2 rounded-full absolute top-2 left-2'
                  style={{ backgroundColor: getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.color }}
                  title={getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.status} />
                <div className="flex items-center justify-evenly">
                  <span className={``} style={{
                    fontSize: todayDate === index + 1 - firstDay ? '20px' : '',
                    fontWeight: todayDate === index + 1 - firstDay ? 'bold' : ''
                  }}>
                    {index + 1 > firstDay ? index + 1 - firstDay : ""}
                  </span>
                  {/* {index + 1 > firstDay && (
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-10 rounded-sm bg-green-500"></div>
                      <div className="h-3 w-10 rounded-sm bg-yellow-500"></div>
                      <div className="h-3 w-10 rounded-sm bg-red-500"></div>
                    </div>
                  )} */}
                  {/* <span className="text-2xl">&#128512;</span> */}
                </div>
              </div>
            ))}
          </div>
          <RightDrawer open={open} setOpen={setOpen} activeDate={activeDate} year={year} month={month} />
        </div>
      </div>
    </>
  )
}

export default Calendar
