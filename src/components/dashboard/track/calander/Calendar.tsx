import { useEffect, useState } from "react";
import { monMap, week } from "../../../../staticData";
import { statusColors, type CalandarDataI } from "../../../../types";
import type { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import Card from "../../../shared/Card";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { formatTimestamp, notify } from "../../../../helper";
import { axiosPrivate } from "../../../../api/axios";
import CircleLoader from "../../../loaders/CircleLoader";
import { motion } from "framer-motion";

const Calendar = () => {
  const theme = useSelector((state: RootState) => state.theme).theme;

  const realToday = new Date();
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  const month = currentViewDate.getMonth();
  const year = currentViewDate.getFullYear();
  const monthStr = monMap[month + 1];
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const [activeStatus, setActiveStatus] = useState("default");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [createLoading, setCreateLoading] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // I will send the date, year and month, it will going to tell me the list of notes.
  const [formData, setFormData] = useState<CalandarDataI>({
    status: "default",
    title: "",
    description: "",
  });
  const [dataResList, setDataResList] = useState<CalandarDataI[]>([]);
  const [activeDataList, setActiveDataList] = useState<CalandarDataI>({
    id: "",
    date: null,
    status: "",
    title: "",
    description: "",
    updatedAt: "",
  });

  const isLookingAtCurrentMonth =
    year === realToday.getFullYear() && month === realToday.getMonth();
  const highlightedTodayDate = isLookingAtCurrentMonth
    ? realToday.getDate()
    : null;

  const handlePrevMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handleNextMonth = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handlePrevYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handleNextYear = () => {
    setCurrentViewDate(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
    );
    setSelectedDate(new Date());
    setFormData({
      status: "default",
      title: "",
      description: "",
    });
  };

  const handleCreate = async () => {
    setCreateLoading(true);
    try {
      const res = await axiosPrivate.post("/api/calandar", {
        day: Number(selectedDate.getDate()),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        status: formData.status,
        title: formData.title,
        description: formData.description,
      });

      if (res?.data?.success) {
        return notify.success("Successfully Added");
      }
    } catch (error) {
      console.error(error);
      if ((error as any).response?.status === 409) {
        notify.error((error as any).response.data.message);
      } else {
        notify.error("Something went wrong");
      }
    } finally {
      setCreateLoading(false);
    }
  };
  const handleGetRes = async () => {
    // setCreateLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/calandar?month=${month}&year=${year}`,
      );

      if (res?.data?.success) {
        const data = res?.data?.data;
        setDataResList(data);
        const initialState = data.find((r: CalandarDataI) =>
          r.date
            ? new Date(r.date).getDate() === new Date()?.getDate()
            : {
                id: "",
                date: null,
                status: "",
                title: "",
                description: "",
                updatedAt: "",
              },
        );
        setActiveDataList(initialState);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setCreateLoading(false);
    }
  };
  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      // const res = await axiosPrivate.post("/api/calandar", {
      //   day: Number(selectedDate.getDate()),
      //   month: selectedDate.getMonth(),
      //   year: selectedDate.getFullYear(),
      //   status: formData.status,
      //   title: formData.title,
      //   description: formData.description,
      // });
      // if (res?.data?.success) {
      //   return notify.success("Successfully Added");
      // }
    } catch (error) {
      console.error(error);
      if ((error as any).response?.status === 409) {
        notify.error((error as any).response.data.message);
      } else {
        notify.error("Something went wrong");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    handleGetRes();
  }, []);

  return (
    <div className="flex items-start mt-4 mb-3 gap-3">
      {/* Left */}
      <Card
        heading=""
        cardWidth="w-1/4"
        bodyHeight="h-[702px]"
      >
        <div className="space-y-5 overflow-y-auto overflow-x-hidden">
          {activeDataList?.id && !toggleUpdate ? (
            <>
              <div className="">
                {/* Header */}
                <div className="border-b border-white/10 light:border-black/10 pb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] opacity-60 tracking-wider uppercase">
                      Task Details
                    </p>
                    <button
                      className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs transition-all hover:scale-105"
                      style={{
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,.05)"
                            : "rgba(0,0,0,.05)",
                      }}
                      onClick={() => setToggleUpdate(true)}
                    >
                      Update
                    </button>
                  </div>
                  <h2 className="text-lg font-semibold mt-1">
                    {activeDataList.title}
                  </h2>
                </div>

                {/* Body */}
                <div className="space-y-5 py-5">
                  {/* Title */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] opacity-60 uppercase tracking-wider">
                        Title
                      </p>
                      <div
                        className="flex items-center gap-2 px-3 py-1 -mt-1 rounded-full"
                        style={{
                          background:
                            theme === "dark"
                              ? statusColors[activeDataList.status].dbg
                              : statusColors[activeDataList.status].bg,

                          border: `1px solid ${
                            theme === "dark"
                              ? statusColors[activeDataList.status].ddot
                              : statusColors[activeDataList.status].dot
                          }`,
                        }}
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            background:
                              theme === "dark"
                                ? statusColors[activeDataList.status].ddot
                                : statusColors[activeDataList.status].dot,
                          }}
                        />

                        <span className="text-[10px] tracking-wide capitalize">
                          {activeDataList.status}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {activeDataList.title}
                    </p>
                  </div>
                  {/* Description */}
                  <div>
                    <p className="text-[11px] opacity-60 uppercase tracking-wider">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-7 opacity-90 whitespace-pre-wrap">
                      {activeDataList.description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between py-4 border-t border-white/10 light:border-black/10 text-[11px] opacity-60">
                  <span>Updated At</span>

                  <span>
                    {activeDataList?.updatedAt &&
                      formatTimestamp(activeDataList?.updatedAt?.toString())}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-[12px]">
                {formatTimestamp(selectedDate.toString()).split("|")[0]}
              </p>
              {/* Status */}
              <div className="">
                <p className="text-[11px] font-medium mb-2 opacity-70 tracking-wide uppercase">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusColors).map(([key, value], index) => {
                    const currentStatus = activeDataList
                      ? activeDataList.status
                      : activeStatus;
                    const selected = currentStatus === key;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (activeDataList) {
                            setActiveDataList((prev) =>
                              prev ? { ...prev, status: key } : prev,
                            );
                          } else {
                            setActiveStatus(key);
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] transition-all duration-300 ${selected ? "scale-105 shadow-lg" : "hover:scale-105 hover:shadow-md"}`}
                        style={{
                          backgroundColor:
                            theme === "dark"
                              ? selected
                                ? value.dbg
                                : "rgba(255,255,255,.04)"
                              : selected
                                ? value.bg
                                : "rgba(0,0,0,.04)",

                          border: `1px solid ${
                            selected
                              ? theme === "dark"
                                ? value.ddot
                                : value.dot
                              : theme === "dark"
                                ? "rgba(255,255,255,.08)"
                                : "rgba(0,0,0,.08)"
                          }`,

                          boxShadow: selected
                            ? `0 0 12px ${
                                theme === "dark"
                                  ? value.ddot + "55"
                                  : value.dot + "33"
                              }`
                            : "none",
                        }}
                      >
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              theme === "dark" ? value.ddot : value.dot,
                          }}
                        />
                        <span className="font-medium">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-medium opacity-70 tracking-wide uppercase">
                  Title
                </label>

                <input
                  type="text"
                  placeholder={
                    activeDataList?.id
                      ? activeDataList?.title
                      : "Enter task title..."
                  }
                  className="mt-2 w-full rounded-xl bg-white/5 light:bg-black/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[12px] outline-none transition-all duration-300 focus:ring-2"
                  style={{
                    borderColor:
                      theme === "dark"
                        ? statusColors[activeStatus].ddot + "40"
                        : statusColors[activeStatus].dot + "40",
                    boxShadow: `0 0 0 1px transparent`,
                  }}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-medium opacity-70 tracking-wide uppercase">
                  Description
                </label>

                <textarea
                  placeholder={
                    activeDataList?.id
                      ? activeDataList?.description
                      : "Describe your task..."
                  }
                  className="mt-2 h-36 resize-none w-full rounded-2xl bg-white/5 light:bg-black/5 px-4 py-3 text-[12px] outline-none transition-all duration-300"
                  style={{
                    border: `1px solid ${theme === "dark" ? statusColors[activeStatus].ddot + "55" : statusColors[activeStatus].dot + "55"}`,
                    boxShadow: `0 0 15px ${theme === "dark" ? statusColors[activeStatus].ddot + "15" : statusColors[activeStatus].dot + "15"}`,
                  }}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                {activeDataList?.id && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={createLoading}
                    className="px-6 py-3 text-sm bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center w-full"
                    onClick={() => setToggleUpdate(false)}
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={activeDataList?.id ? updateLoading : createLoading}
                  className="px-6 py-3 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/25 transition cursor-pointer flex items-center justify-center w-full"
                  onClick={activeDataList?.id ? handleUpdate : handleCreate}
                >
                  {createLoading || updateLoading ? (
                    <CircleLoader />
                  ) : activeDataList?.id ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </motion.button>
              </div>
            </>
          )}
        </div>
      </Card>
      {/* Right */}
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
                    const target = new Date(
                      year,
                      month,
                      dayNumber,
                    ).toISOString();

                    const exists = dataResList.find((r: CalandarDataI) => {
                      if (r.date)
                        return new Date(r.date).toISOString() === target;
                    });
                    return (
                      <div
                        key={index}
                        className={`overflow-hidden relative h-28 rounded-xl ${index >= firstDay && `bg-white/5 border ${new Date(year, month, dayNumber).toDateString() === selectedDate.toDateString() ? "border-pink-500" : "border-white/10 light:bg-black/5 light:border-black/10"} `}`}
                        onClick={() => {
                          setSelectedDate(new Date(year, month, dayNumber));
                          setFormData({
                            status: "default",
                            title: "",
                            description: "",
                          });
                          if (exists?.id) setActiveDataList(exists);
                          else
                            setActiveDataList({
                              id: "",
                              date: null,
                              status: "",
                              title: "",
                              description: "",
                              updatedAt: "",
                            });
                        }}
                      >
                        <div
                          className={`
                            ${isToday && "text-white light:text-black"}
                            ${exists?.id && `bg-[${statusColors[exists?.status]}]`}
                            ${!isToday && !exists?.id && "text-gray-400"} 
                            px-2.5 py-1`}
                          style={{
                            backgroundColor: isToday
                              ? "#6366f1"
                              : exists?.id
                                ? statusColors?.[exists?.status]?.dot
                                : "transparent",
                          }}
                        >
                          <div className="text-[12px] py-1 flex gap-1">
                            <span>
                              {index + 1 > firstDay ? index + 1 - firstDay : ""}
                            </span>
                            {exists?.id && (
                              <span className="text-[12px] ms-1 line-clamp-1 font-bold text-white">
                                {exists.title}
                              </span>
                            )}
                          </div>
                        </div>
                        {exists?.id && (
                          <div className="h-20 overflow-y-hidden overflow-x-hidden">
                            <p className="text-[12px] text-white p-2">
                              {exists.description}
                            </p>
                          </div>
                        )}
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
