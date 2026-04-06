import { useEffect, useState } from "react"
import { months, week, weekColors } from "../../../../staticData"
import { useNavigate } from "react-router-dom";
import { RxExternalLink } from "react-icons/rx";
import { statusColors } from "../../../../types";
import { getDaysInMonth, getFirstDayOfMonth } from "../../../../helper";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import RightDrawer from "./RightDrawer";

const Calendar = () => {

  const [selectedMon, setSelectedMon] = useState<string>("");
  const [currYear, setCurrYear] = useState(0);
  const [todayDate, setTodayDate] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    setSelectedMon(Object.keys(months)[m]);
    setCurrYear(y);
    setTodayDate(d);
  }, []);


  const [totalD, setTotalD] = useState(0);
  const [firstDay, setFirstDay] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(1);
  const dateData = useSelector(
    (state: RootState) => state.dateData
  );
  const year = currYear;
  const month = Object.keys(months).indexOf(selectedMon);

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
    <>
      <div className="h-screen flex">
        <div className="w-[30%] bg-[#333f5e] h-full flex flex-col items-center justify-center overflow-y-auto">
          <p className="font-bold text-white text-[80px] mb-5 playfair-display">{currYear}</p>
          <div className="grid grid-cols-4 text-white gap-6 gap-y-10 playfair-display">
            {Object.keys(months).map((m, index) => (
              <span key={index} className={`cursor-pointer text-center px-2 py-1 rounded ${selectedMon === m && 'bg-[#e9f0f3] text-black'}`} onClick={() => setSelectedMon(m)}>{m}</span>
            ))}
          </div>
        </div>
        <div className="w-[70%] overflow-y-auto">
          <div className="flex items-center justify-center relative">
            <p className="p-3 text-[40px] font-extrabold playfair-display">{months?.[selectedMon]}</p>
            <RxExternalLink className="cursor-pointer" onClick={() => navigate(`/${currYear}/${selectedMon}`)} />
            <div className="absolute right-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="rounded p-1 flex items-center justify-center cursor-pointer shadow" style={{ backgroundColor: weekColors[index] }} onClick={() => navigate(`/week-${index + 1}`)}>
                  <span className="text-[8px]">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>


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
                  className={`text-center p-5 relative rounded-md ${todayDate === index + 1 - firstDay && 'bg-[#4b5d8b] text-white'}`}
                  style={{ backgroundColor: todayDate !== index + 1 - firstDay && index + 1 > firstDay ? weekColors[Math.floor((index - firstDay) / 7)] : "" }}
                  onClick={() => {
                    setOpen(prev => !prev);
                    setActiveDate(index + 1 > firstDay ? index + 1 - firstDay : -1);
                  }}
                >
                  <div className='h-2 w-2 rounded-full absolute top-2 left-2'
                    style={{ backgroundColor: getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.color }}
                    title={getStatusColor(index + 1 > firstDay ? index + 1 - firstDay : null)?.status} />
                  <div className="flex items-center justify-center flex-col">
                    <span className={``} style={{
                      fontSize: todayDate === index + 1 - firstDay ? '20px' : '',
                      fontWeight: todayDate === index + 1 - firstDay ? 'bold' : ''
                    }}>
                      {index + 1 > firstDay ? index + 1 - firstDay : ""}
                    </span>
                    {/* <span className="text-2xl">&#128512;</span> */}
                  </div>
                </div>
              ))}
            </div>
            <RightDrawer open={open} setOpen={setOpen} activeDate={activeDate} year={year} month={month} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Calendar
