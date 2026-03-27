import { useEffect, useState } from "react";
import { months, week, weekColors } from "../../staticData";
import { getDaysInMonth, getFirstDayOfMonth } from "../../helper";
import RightDrawer from "./RightDrawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { statusColors } from "../../types";

const MonthCalander = ({ year, month, todayDate }: { year: number; month: number, todayDate: number }) => {

  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(1);
  const dateData = useSelector(
    (state: RootState) => state.dateData
  );

  useEffect(() => {
    const res = getDaysInMonth(year, month);
    setTotalD(res);
    const firstDayNo = getFirstDayOfMonth(year, month);
    setFirstDay(firstDayNo);
  }, [month]);

  const getStatusColor = (date: number | null): Record<string, string> => {
    const key = `${date}-${Object.keys(months)[month]}-${year}`;
    if (key in dateData && dateData[key].status !== 'default') {
      return {
        color: statusColors[dateData[key].status].dot,
        status: dateData[key].status
      };
    }
    return {
        color: 'transparent',
        status: ''
      };
  }

  return (
    <div className="px-1">
      <div className="grid grid-cols-7 google-sans text-[12px] mt-2 text-gray-400">
        {Object.values(week).map((w, index) => (
          <span key={index} className="text-center">{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 google-sans mt-2 gap-1">
        {Array.from({ length: totalD + firstDay }).map((_, index) => (
          <div
            key={index}
            className='text-center p-5 relative'
            style={{ backgroundColor: index + 1 > firstDay ? weekColors[Math.floor((index - firstDay) / 7)] : "" }}
            onClick={() => {
              setOpen(prev => !prev);
              setActiveDate(index + 1 > firstDay ? index + 1 - firstDay : -1);
            }}
          >
            <div className='h-2 w-2 rounded-full absolute top-2 left-2' style={{ backgroundColor: getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.color }} title={getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.status}></div>
            <span style={{
              fontSize: todayDate === index + 1 - firstDay ? '20px' : '',
              fontWeight: todayDate === index + 1 - firstDay ? 'bold' : ''
            }}>
              {index + 1 > firstDay ? index + 1 - firstDay : ""}
            </span>
          </div>
        ))}
      </div>
      <RightDrawer open={open} setOpen={setOpen} activeDate={activeDate} year={year} month={month} />
    </div>
  )
}

export default MonthCalander
