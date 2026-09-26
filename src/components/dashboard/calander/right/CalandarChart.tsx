import { week } from "../../../../staticData";
import Card from "../../../shared/Card";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { CalandarDataI } from "../../../../types";

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
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

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
                // whileHover={{ y: -4, scale: 1.02 }}
                className={`group overflow-hidden relative h-14 lg:h-28 rounded-2xl cursor-pointer transition-all duration-50 flex flex-col`}
                onClick={() => {
                  setSelectedDate(new Date(year, month, dayNumber));
                  setFormData({
                    color: "",
                    tag: "",
                    title: "",
                    description: "",
                  });
                  if (exists?.id) {
                    setActiveData(exists);
                  } else {
                    setActiveData({
                      id: "",
                      date: null,
                      tag: "",
                      color: "",
                      title: "",
                      description: "",
                      updatedAt: "",
                    });
                  }
                }}
                style={{
                  border: `1.5px solid ${isSelected ? "#6366F1" : exists ? `${exists?.color}66` : "#ffffff1a"}`,
                }}
              >
                {/* Day Header */}

                <div
                  className="flex items-center justify-between px-2 py-2 bg-black/20 border-b border-white/5"
                  style={{
                    backgroundColor: `${exists?.color}0D`,
                  }}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      !isSelected &&
                      "text-white/40 group-hover:text-white group-hover:bg-white/10"
                    } transition-colors`}
                    style={{
                      backgroundColor: isToday ? "#6366F1" : ``,
                      color: isToday || isSelected ? "white" : "#FFFFFF66",
                    }}
                    title={exists?.tag}
                  >
                    {dayNumber}
                  </div>
                </div>

                {/* Day Content */}
                <div className="hidden lg:flex flex-1 p-2 flex-col gap-1 overflow-hidden relative">
                  {exists?.id ? (
                    <>
                      <div className="text-[10px] font-semibold h-13 overflow-y-auto hide-scrollbar">
                        {exists.title}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-50">
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
