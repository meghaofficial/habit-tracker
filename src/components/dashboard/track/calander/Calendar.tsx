import { useEffect, useState } from "react";
import {
  monMap,
  week,
  weekColors,
  weekColorsDark,
} from "../../../../staticData";
import { statusColors } from "../../../../types";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import RightDrawer from "./RightDrawer";
import Card from "../../../shared/Card";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface MonthsI {
  _id: string;
  planID: string;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
}

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

const Calendar = () => {
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(1);
  const theme = useSelector((state: RootState) => state.theme);

  const realToday = new Date();
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  // const currDate = new Date();
  // const month = currDate.getUTCMonth();
  // const monthStr = monMap[month+1];
  // const year = currDate.getFullYear();
  // const todayDate = currDate.getDate();
  // const totalDays = new Date(year, month + 1, 0).getDate();
  // const firstDay = new Date(year, month, 1).getDay();

  const month = currentViewDate.getMonth(); // Using local month to keep consistency with local year/date
  const year = currentViewDate.getFullYear();
  const todayDate = currentViewDate.getDate();
  const monthStr = monMap[month + 1];
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isLookingAtCurrentMonth =
    year === realToday.getFullYear() && month === realToday.getMonth();
  const highlightedTodayDate = isLookingAtCurrentMonth
    ? realToday.getDate()
    : null;

  const handlePrevMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handlePrevYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
    );
  };

  const handleNextYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
    );
  };

  return (
    <div className="flex items-start mt-4 mb-3 gap-3">
      <Card heading="Added Notes" cardWidth="w-1/4" bodyHeight="h-[702px]">
        <div className="flex items-center justify-center mt-3 overflow-y-auto">
          <div className="flex flex-col items-center justify-center py-20 px-1">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold google-sans">Coming Soon</h2>
            <p className="mt-3 text-center text-gray-500 max-w-md text-[14px]">
              We're working on something exciting. This feature will be
              available in the next few days.
            </p>
          </div>
        </div>
      </Card>
      <div className="w-3/4">
        <Card heading="" cardWidth="w-full">
          <div className="flex items-center justify-between">
            <span className="text-darkPrimary font-bold text-[14px]">
              TIMELINE
            </span>
            <div className="flex items-center gap-2">
              {/* Month Selector */}
              <div className="bg-white/10 light:bg-black/10 rounded-lg text-[10px] uppercase tracking-wider p-2 flex items-center gap-2">
                <MdKeyboardArrowLeft
                  size={18}
                  className="cursor-pointer hover:bg-white/5 rounded transition-colors"
                  onClick={handlePrevMonth}
                />
                <span>{monthStr}</span>
                <MdKeyboardArrowRight
                  size={18}
                  className="cursor-pointer hover:bg-white/5 rounded transition-colors"
                  onClick={handleNextMonth}
                />
              </div>

              {/* Year Selector */}
              <div className="bg-white/10 light:bg-black/10 rounded-lg text-[10px] uppercase tracking-wider p-2 flex items-center gap-2">
                <MdKeyboardArrowLeft
                  size={18}
                  className="cursor-pointer hover:bg-white/5 rounded transition-colors"
                  onClick={handlePrevYear}
                />
                <span>{year}</span>
                <MdKeyboardArrowRight
                  size={18}
                  className="cursor-pointer hover:bg-white/5 rounded transition-colors"
                  onClick={handleNextYear}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Main Calandar */}
        <Card heading="" cardWidth="w-full" styling="mt-3">
          <div className="relative w-full">
            <div className="px-1.5">
              <div className="grid grid-cols-7 google-sans text-[12px] mt-2 text-gray-400">
                {Object.values(week).map((w, index) => (
                  <span key={index} className="text-center">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 google-sans mt-2 gap-3">
                {Array.from({ length: totalDays + firstDay }).map(
                  (_, index) => {
                    const isActualDay = index >= firstDay;
                    const dayNumber = isActualDay ? index + 1 - firstDay : -1;
                    const isToday = dayNumber === highlightedTodayDate;
                    return (
                      <div
                        key={index}
                        className={`overflow-hidden relative h-28 rounded-xl ${index >= firstDay && "bg-white/5 border border-white/10 light:bg-black/5 light:border-black/10"}`}
                        // onClick={() => {
                        //               if (!isActualDay) return;
                        // setOpen((prev) => !prev);
                        // setActiveDate(dayNumber);
                        // }}
                      >
                        <div
                          className={`${isToday ? "bg-darkPrimary/50 text-white light:text-black" : "text-gray-400"} px-2.5 py-1`}
                        >
                          <span className="text-[12px]">
                            {index + 1 > firstDay ? index + 1 - firstDay : ""}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
              {/* <RightDrawer
                open={open}
                setOpen={setOpen}
                activeDate={activeDate}
                year={year}
                month={month}
              /> */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
