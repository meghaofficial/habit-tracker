import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CalandarDataI } from "../../../types";
import Card from "../../shared/Card";
import SectionIcon from "../../shared/SectionIcon";
import { FaCalendarDays } from "react-icons/fa6";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { monMap, week } from "../../../staticData";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

type RightCalandarProps = {
  setCurrentViewDate: Dispatch<SetStateAction<Date>>;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  setFormData: Dispatch<SetStateAction<CalandarDataI>>;
  currentViewDate: Date;
  selectedDate: Date;
  dataList: CalandarDataI[];
  setActiveData: Dispatch<SetStateAction<CalandarDataI>>;
  loading: boolean;
  setToggleUpdate: Dispatch<SetStateAction<boolean>>;
};

const RightCalandar = ({
  setCurrentViewDate,
  setSelectedDate,
  setFormData,
  currentViewDate,
  selectedDate,
  dataList,
  setActiveData,
  loading,
  setToggleUpdate,
}: RightCalandarProps) => {
  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const monthStr = monMap[month + 1];
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const realToday = new Date();
  const isLookingAtCurrentMonth =
    year === realToday.getFullYear() && month === realToday.getMonth();
  const highlightedTodayDate = isLookingAtCurrentMonth
    ? realToday.getDate()
    : null;

  const handleChangeDate = (addYearVal: number, addMonthVal: number) => {
    setCurrentViewDate((prev) => {
      const updated = new Date(
        prev.getFullYear() + addYearVal,
        prev.getMonth() + addMonthVal,
        1,
      );
      setSelectedDate(updated);
      return updated;
    });
    setFormData({
      title: "",
      description: "",
      tag: "",
      color: "",
    });
    setActiveData({
      id: "",
      date: null,
      tag: "",
      color: "",
      title: "",
      description: "",
      updatedAt: "",
    });
  };

  const [openDateMenu, setOpenDateMenu] = useState<"month" | "year" | null>(
    null,
  );

  const dateMenuRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const startYear = Math.min(currentYear - 10, year);
  const endYear = Math.max(currentYear + 10, year);

  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dateMenuRef.current &&
        !dateMenuRef.current.contains(event.target as Node)
      ) {
        setOpenDateMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDateMenu(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="w-full lg:w-[72%] flex flex-col gap-4">
      {/* Header Top */}
      <div className="sm:block hidden">
        <Card heading="" cardWidth="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
            <div className="flex items-center gap-3">
              <SectionIcon h="40px" w="40px" size={18} Icon={FaCalendarDays} />
              <div>
                <h1 className="text-lg font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Timeline
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Manage your monthly schedule
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Month Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={() => handleChangeDate(0, -1)}
                >
                  <MdKeyboardArrowLeft size={18} />
                </button>
                <span className="w-fit text-center text-purple-100">
                  {monthStr}
                </span>
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={() => handleChangeDate(0, 1)}
                >
                  <MdKeyboardArrowRight size={18} />
                </button>
              </div>

              {/* Year Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={() => handleChangeDate(-1, 0)}
                >
                  <MdKeyboardArrowLeft size={18} />
                </button>
                <span className="w-10 text-center text-blue-100">{year}</span>
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={() => handleChangeDate(1, 0)}
                >
                  <MdKeyboardArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Calandar Bottom */}
      <Card heading="" cardWidth="w-full">
        <div className="w-full min-w-0 p-0.5 sm:p-2">
          <div
            ref={dateMenuRef}
            className="relative z-30 mb-4 border-b border-white/6 pb-3 sm:hidden light:border-black/6"
          >
            {/* Dropdown triggers */}
            <div className="flex items-center justify-between gap-3">
              {(["month", "year"] as const).map((type) => {
                const isOpen = openDateMenu === type;

                return (
                  <button
                    key={type}
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`Choose ${type}`}
                    onClick={() =>
                      setOpenDateMenu((prev) => (prev === type ? null : type))
                    }
                    className={` flex h-10 items-center justify-between gap-3 rounded-xl border px-3 text-xs transition-colors ${type === "month" ? "min-w-0 flex-1 font-semibold" : "w-28 shrink-0 font-medium tabular-nums"} ${isOpen ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-300 light:text-indigo-600" : "border-white/8 bg-white/3 text-white/75 light:border-black/8 light:bg-black/2 light:text-black/70"} `}
                  >
                    <span className="truncate">
                      {type === "month" ? monthNames[month] : year}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="shrink-0 opacity-60"
                    >
                      <FiChevronDown size={14} />
                    </motion.span>
                  </button>
                );
              })}
            </div>

            {/* Custom dropdown */}
            <AnimatePresence mode="wait">
              {openDateMenu && (
                <motion.div
                  key={openDateMenu}
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className=" absolute inset-x-0 top-full z-50 origin-top overflow-hidden rounded-2xl border border-white/10 bg-[#16161c] p-3 shadow-[0_12px_35px_rgba(0,0,0,0.3)] light:border-black/10 light:bg-white "
                >
                  <p className="mb-3 px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 light:text-black/40">
                    {openDateMenu === "month" ? "Choose month" : "Choose year"}
                  </p>

                  <div className="grid max-h-56 grid-cols-3 gap-1.5 overflow-y-auto overscroll-contain">
                    {(openDateMenu === "month" ? monthNames : yearOptions).map(
                      (value, index) => {
                        const selected =
                          openDateMenu === "month"
                            ? index === month
                            : value === year;

                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            ref={(element) => {
                              if (
                                element &&
                                selected &&
                                openDateMenu === "year"
                              ) {
                                const container = element.parentElement;

                                if (container) {
                                  container.scrollTop =
                                    element.offsetTop -
                                    container.offsetTop -
                                    container.clientHeight / 2 +
                                    element.clientHeight / 2;
                                }
                              }
                            }}
                            onClick={() => {
                              if (openDateMenu === "month") {
                                handleChangeDate(0, index - month);
                              } else {
                                handleChangeDate(Number(value) - year, 0);
                              }

                              setOpenDateMenu(null);
                            }}
                            className={` flex min-h-10 items-center justify-center rounded-lg border px-1 text-[11px] transition-colors ${selected ? "border-indigo-400/25 bg-indigo-500/15 font-semibold text-indigo-300 light:text-indigo-600" : "border-transparent text-white/60 hover:bg-white/5 light:text-black/60 light:hover:bg-black/5"} `}
                          >
                            {value}
                          </button>
                        );
                      },
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Weekdays */}
          <div className="mb-2 grid grid-cols-7 gap-1 sm:mb-4 sm:gap-3">
            {Object.values(week).map((w, index) => (
              <div
                key={index}
                className=" min-w-0 rounded-lg py-2 text-center text-[9px] font-medium text-gray-400 sm:border sm:border-white/5 sm:bg-white/2 sm:text-[11px] sm:tracking-wider lg:text-[12px] lg:font-bold lg:uppercase light:text-gray-500 "
              >
                <span className="lg:hidden">{w.slice(0, 3)}</span>
                <span className="hidden lg:inline">{w}</span>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {Array.from({ length: totalDays + firstDay }).map((_, index) => {
              const isActualDay = index >= firstDay;

              if (!isActualDay) {
                return (
                  <div
                    key={`empty-${index}`}
                    className=" aspect-square min-w-0 rounded-xl sm:aspect-auto sm:h-14 lg:h-28 lg:rounded-2xl lg:border lg:border-white/2 lg:bg-white/1 "
                  />
                );
              }

              const dayNumber = index + 1 - firstDay;
              const cellDate = new Date(year, month, dayNumber);
              const isToday = dayNumber === highlightedTodayDate;
              const isSelected =
                cellDate.toDateString() === selectedDate.toDateString();

              const exists = dataList.find((item: CalandarDataI) => {
                if (!item.date) return false;

                const eventDate = new Date(item.date);

                return (
                  eventDate.getFullYear() === year &&
                  eventDate.getMonth() === month &&
                  eventDate.getDate() === dayNumber
                );
              });

              const eventColor = exists?.color || "#6366F1";

              if (loading) {
                return (
                  <div
                    key={`loading-${dayNumber}`}
                    className=" aspect-square min-w-0 animate-pulse rounded-xl bg-white/5 sm:aspect-auto sm:h-14 lg:h-28 lg:rounded-2xl light:bg-black/5 "
                  />
                );
              }

              return (
                <motion.button
                  key={`day-${dayNumber}`}
                  type="button"
                  aria-label={`${cellDate.toDateString()}${
                    exists?.title ? `: ${exists.title}` : ""
                  }`}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  onClick={() => {
                    setToggleUpdate(false);
                    setSelectedDate(cellDate);
                    setActiveData(
                      exists?.id
                        ? exists
                        : {
                            id: "",
                            date: null,
                            tag: "",
                            color: "",
                            title: "",
                            description: "",
                            updatedAt: "",
                          },
                    );
                  }}
                  className=" group relative flex aspect-square min-w-0 flex-col overflow-hidden rounded-xl border-[1.5px] border-white/10 text-left transition-colors sm:aspect-auto sm:h-14 lg:h-28 lg:rounded-2xl light:border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 "
                  style={{
                    borderColor: isSelected
                      ? "#6366F1"
                      : exists?.id
                        ? `${eventColor}66`
                        : undefined,
                  }}
                >
                  {/* Centered on mobile; original header on desktop */}
                  <div
                    className=" flex w-full flex-1 items-center justify-center bg-white/5 lg:flex-none lg:justify-between lg:border-b lg:border-white/5 lg:px-2 lg:py-2 light:bg-black/2.5 light:lg:border-black/5 "
                    style={{
                      backgroundColor: exists?.id
                        ? `${eventColor}1A`
                        : undefined,
                    }}
                  >
                    <span
                      title={exists?.tag}
                      className={` flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold sm:h-7 sm:w-7 sm:text-xs lg:h-6 lg:w-6 ${isToday ? "bg-indigo-500 text-white" : isSelected ? "text-indigo-300 light:text-indigo-600" : "text-white/50 light:text-black/55"} `}
                      style={{
                        color:
                          exists?.id && !isToday && !isSelected
                            ? eventColor
                            : undefined,
                      }}
                    >
                      {dayNumber}
                    </span>
                  </div>

                  {/* Desktop content */}
                  <div className="relative hidden min-h-0 flex-1 flex-col gap-1 overflow-hidden p-2 lg:flex">
                    {exists?.id ? (
                      <span className="line-clamp-3 wrap-break-word text-[10px] font-semibold text-white/80 light:text-black/75">
                        {exists.title}
                      </span>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-lg text-white/50 light:bg-black/5 light:text-black/40">
                          +
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RightCalandar;
