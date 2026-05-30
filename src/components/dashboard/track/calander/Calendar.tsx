import { useEffect, useState } from "react"
import { monMap, week, weekColors, weekColorsDark } from "../../../../staticData"
import { statusColors } from "../../../../types";
import { getDaysInMonth, getFirstDayOfMonth } from "../../../../helper";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import RightDrawer from "./RightDrawer";

interface MonthsI { _id: string, planID: string, startDate: Date | string, endDate: Date | string, status: string }

const months: Record<string, string> = {
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
  Dec: "December",
};

const Calendar = ({ month, year, setActiveMonth, subsMonths, activeStartDate }: { 
  month: number, 
  year: number,
  setActiveMonth?: React.Dispatch<React.SetStateAction<MonthsI>>,
  subsMonths?: MonthsI[],
  activeStartDate?: string
}) => {

  const [todayDate, setTodayDate] = useState(1);
  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(1);
  const theme = localStorage.getItem("theme");

  // const getStatusColor = (date: number | null): Record<string, string> => {
  //   const key = `${date}-${Object.keys(months)[month]}-${year}`;
  //   if (key in dateData && dateData[key].status !== 'default') {
  //     return {
  //       color: statusColors[dateData[key]?.status]?.dot,
  //       status: dateData[key].status
  //     };
  //   }
  //   return {
  //     color: 'transparent',
  //     status: ''
  //   };
  // }

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

// const handleNext = () => {
//   const currentIndex = subsMonths?.findIndex(m => m?.startDate === activeStartDate);
//   if (currentIndex !== -1 && currentIndex < subsMonths.length - 1) {
//     const nextMonth = subsMonths[currentIndex + 1];
//     setActiveMonth(nextMonth);
//   }
// };

// const handlePrev = () => {
//   const currentIndex = subsMonths?.findIndex(m => m?.startDate === activeStartDate);
//   if (currentIndex > 0) {
//     const prevMonth = subsMonths[currentIndex - 1];
//     setActiveMonth(prevMonth);
//   }
// };


  return (
    <>
      <div className="relative w-full">
        <p className="mt-2 text-[40px] font-extrabold playfair-display text-center">{monMap[month+1]} {year}</p>

{/* <div className="absolute right-5 top-10 flex items-center justify-center gap-2">
  <div className={`bg-darkCard p-2 rounded-full cursor-pointer hover:bg-darkBox`} onClick={handlePrev}>
    <MdKeyboardArrowLeft size={20} />
  </div>
  <div className={`bg-darkCard p-2 rounded-full cursor-pointer hover:bg-darkBox`} onClick={handleNext}>
    <MdKeyboardArrowRight size={20} />
  </div>
</div> */}

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
                className={`text-center py-1 relative rounded-md ${todayDate === index + 1 - firstDay && 'bg-darkPrimary light:bg-lightPrimary text-white'}`}
                style={{
                  backgroundColor:
                    todayDate === index + 1 - firstDay ? //todays date
                      theme === "dark" ? "#6366f1" : "#4f46e5" :
                      index + 1 > firstDay ?
                        theme === "dark" ?
                          weekColorsDark[Math.floor((index - firstDay) / 7)] :
                          weekColors[Math.floor((index - firstDay) / 7)] :
                        "transparent"
                }}
                onClick={() => {
                  if (index + 1 <= firstDay) return;
                  setOpen(prev => !prev);
                  setActiveDate(index + 1 > firstDay ? index + 1 - firstDay : -1);
                }}
              >
                {/* <div className='h-2 w-2 rounded-full absolute top-2 left-2'
                  style={{ backgroundColor: getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.color }}
                  title={getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.status} />
                <div className="flex items-center justify-center">
                  <span style={{
                    fontSize: todayDate === index + 1 - firstDay ? '20px' : '',
                    fontWeight: todayDate === index + 1 - firstDay ? 'bold' : ''
                  }}>
                    {index + 1 > firstDay ? index + 1 - firstDay : ""}
                  </span>
                </div> */}
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
