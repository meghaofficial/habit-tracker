import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store/store";
import { week } from "../../../../staticData";
import { statusColors, type CalandarDataI } from "../../../../types";
import Card from "../../../shared/Card";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type CalandarChartProps = {
  currentViewDate: Date;
  selectedDate: Date;
  dataList: CalandarDataI[];
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
};

const CalandarChart = ({
  currentViewDate,
  selectedDate,
  dataList,
  setSelectedDate,
  setFormData,
  setActiveData,
}: CalandarChartProps) => {
  const theme = useSelector((state: RootState) => state.theme).theme;
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
    const [toggleUpdate, setToggleUpdate] = useState(false);

  const realToday = new Date();
  const isLookingAtCurrentMonth =
    year === realToday.getFullYear() && month === realToday.getMonth();
  const highlightedTodayDate = isLookingAtCurrentMonth
    ? realToday.getDate()
    : null;

  return (
    <Card heading="" cardWidth="w-full">
      <div className="w-full p-2">
        <div className="grid grid-cols-7 text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          {Object.values(week).map((w, index) => (
            <div
              key={index}
              className="text-center py-2 bg-white/2 rounded-lg mx-1 border border-white/5"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {Array.from({ length: totalDays + firstDay }).map((_, index) => {
            const isActualDay = index >= firstDay;
            const dayNumber = isActualDay ? index + 1 - firstDay : -1;
            const isToday = dayNumber === highlightedTodayDate;
            const target = new Date(year, month, dayNumber).toISOString();
            const isSelected =
              isActualDay &&
              new Date(year, month, dayNumber).toDateString() ===
                selectedDate.toDateString();

            const exists = dataList.find((r: CalandarDataI) => {
              if (r.date) return new Date(r.date).toISOString() === target;
            });

            if (!isActualDay) {
              return (
                <div
                  key={index}
                  className="h-14 lg:h-28 rounded-2xl bg-white/1 border border-white/2"
                ></div>
              );
            }

            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`group overflow-hidden relative h-14 lg:h-28 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col ${
                  isSelected
                    ? ""
                    : "bg-white/3 hover:bg-white/6 hover:border-white/20"
                }`}
                onClick={() => {
                  setSelectedDate(new Date(year, month, dayNumber));
                  setFormData({
                    status: "default",
                    title: "",
                    description: "",
                  });
                  if (exists?.id) {
                    setActiveData(exists);
                    setToggleUpdate(false);
                  } else {
                    setActiveData({
                      id: "",
                      date: null,
                      status: "",
                      title: "",
                      description: "",
                      updatedAt: "",
                    });
                    setToggleUpdate(false);
                  }
                }}
                style={{
                  border: `1.5px solid ${
                    exists && isSelected ?
                      statusColors[exists.status]?.ddot :
                      exists && !isSelected ?
                        `color-mix(in srgb, ${statusColors[exists.status]?.dbg} 50%, transparent)` :
                        !exists && isSelected ? "#fff" :
                          "#ffffff1a"
                  }`,
                  background: isToday
                    ? "#00000033"
                    : exists
                      ? `color-mix(in srgb, ${statusColors[exists.status]?.dbg} 50%, transparent)`
                      : isSelected
                        ? "#ffffff1a"
                        : "#ffffff1a",
                }}
              >
                {/* Day Header */}

                <div className="flex items-center justify-between px-2 py-2 bg-black/20 border-b border-white/5">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isToday
                        ? "text-white"
                        : isSelected
                          ? "text-white"
                          : "text-white/40 group-hover:text-white group-hover:bg-white/10"
                    } transition-colors`}
                  >
                    {dayNumber}
                  </div>
                </div>

                {/* Day Content */}
                <div className="hidden lg:flex flex-1 p-2 flex-col gap-1 overflow-hidden relative">
                  {exists?.id ? (
                    <>
                      <div
                        className="text-[10px] font-semibold h-13 overflow-y-auto hide-scrollbar"
                        style={{
                          color:
                            theme === "dark"
                              ? statusColors[exists.status]?.ddot
                              : statusColors[exists.status]?.dot,
                        }}
                      >
                        {exists.title}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-lg">
                        +
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default CalandarChart;
