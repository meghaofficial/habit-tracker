import { useEffect, useState } from "react";
import { monMap, week } from "../../../staticData";
import { statusColors, type CalandarDataI } from "../../../types";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import Card from "../../shared/Card";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { formatTimestamp, notify } from "../../../helper";
import { axiosPrivate } from "../../../api/axios";
import CircleLoader from "../../loaders/CircleLoader";
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
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        const newTask = res.data.data;
        setDataResList((prev) => [...prev, newTask]);
        setActiveDataList(newTask);
        setFormData({
          status: "default",
          title: "",
          description: "",
        });
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
      const res = await axiosPrivate.patch("/api/calandar", {
        id: activeDataList?.id,
        status: formData.status,
        title: formData.title,
        description: formData.description,
      });

      if (res?.data?.success) {
        const updatedTask = res.data.data;
        setDataResList((prev) =>
          prev.map((item) => (item.id === updatedTask.id ? updatedTask : item))
        );
        setActiveDataList(updatedTask);
        setToggleUpdate(false);
        return notify.success("Successfully Updated");
      }
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeleteLoading(true);
    try {
      const res = await axiosPrivate.delete("/api/calandar", {
        data: { id: activeDataList?.id },
      });

      if (res?.data?.success) {
        setDataResList((prev) => prev.filter((item) => item.id !== activeDataList.id));
        setActiveDataList({
          id: "", date: null, status: "", title: "", description: "", updatedAt: "",
        });
        return notify.success("Successfully Deleted");
      }
    } catch (error) {
      console.error(error);
      notify.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    handleGetRes();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-start mt-4 mb-3 gap-4 lg:gap-6 w-full">
      {/* Left */}
      <Card
        heading=""
        cardWidth="w-full lg:w-[28%]"
        bodyHeight="h-auto lg:h-[702px]"
      >
        <div className="space-y-6 overflow-y-auto overflow-x-hidden p-2">
          {activeDataList?.id && !toggleUpdate ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="border-b border-white/10 light:border-black/10 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20">
                    Task Details
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center justify-center rounded-xl p-2 text-red-400 hover:text-red-300 transition-all hover:scale-105 active:scale-95 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      title="Delete Task"
                    >
                      {deleteLoading ? <CircleLoader /> : <span>🗑️</span>}
                    </button>
                    <button
                      className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 bg-white/5 hover:bg-white/10 border border-white/10"
                      onClick={() => setToggleUpdate(true)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {activeDataList.title}
                </h2>
              </div>

              {/* Body */}
              <div className="space-y-6 py-6 flex-grow">
                {/* Status */}
                <div className="group">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] opacity-50 uppercase tracking-wider font-semibold group-hover:opacity-80 transition-opacity">
                      Status
                    </p>
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg"
                      style={{
                        background: theme === "dark" ? statusColors[activeDataList.status]?.dbg : statusColors[activeDataList.status]?.bg,
                        border: `1px solid ${theme === "dark" ? statusColors[activeDataList.status]?.ddot : statusColors[activeDataList.status]?.dot}40`,
                      }}
                    >
                      <div
                        className="h-2 w-2 rounded-full shadow-sm animate-pulse"
                        style={{ background: theme === "dark" ? statusColors[activeDataList.status]?.ddot : statusColors[activeDataList.status]?.dot }}
                      />
                      <span className="text-[11px] font-bold tracking-wide capitalize" style={{ color: theme === "dark" ? statusColors[activeDataList.status]?.ddot : statusColors[activeDataList.status]?.dot }}>
                        {activeDataList.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="group bg-white/[0.02] rounded-2xl p-4 border border-white/5 transition-all hover:bg-white/[0.04]">
                  <p className="text-[11px] opacity-50 uppercase tracking-wider font-semibold mb-3 group-hover:opacity-80 transition-opacity">
                    Description
                  </p>
                  <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap font-medium">
                    {activeDataList.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/10 text-[11px] font-medium text-gray-400">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  Last Updated
                </span>
                <span className="bg-white/5 px-2.5 py-1 rounded-md">
                  {activeDataList?.updatedAt && formatTimestamp(activeDataList?.updatedAt?.toString())}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-blue-500/20">
                  {activeDataList?.id ? "Edit Task" : "New Task"}
                </span>
                <span className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  {formatTimestamp(selectedDate.toString()).split("|")[0]}
                </span>
              </div>

              {/* Status Selection */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
                  Select Status
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {Object.entries(statusColors).map(([key, value], index) => {
                    const currentStatus = activeDataList?.id ? activeDataList.status : activeStatus;
                    const selected = currentStatus === key;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (activeDataList?.id) {
                            setActiveDataList((prev) => prev ? { ...prev, status: key } : prev);
                          } else {
                            setActiveStatus(key);
                            setFormData((prev) => ({ ...prev, status: key }));
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-300 ${selected ? "scale-105 shadow-lg ring-1 ring-white/20" : "hover:scale-105 hover:bg-white/5 opacity-70 hover:opacity-100"}`}
                        style={{
                          backgroundColor: selected ? (theme === "dark" ? value.dbg : value.bg) : "transparent",
                          border: `1px solid ${selected ? (theme === "dark" ? value.ddot : value.dot) : (theme === "dark" ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)")}`,
                          boxShadow: selected ? `0 4px 12px ${theme === "dark" ? value.ddot + "40" : value.dot + "30"}` : "none",
                        }}
                      >
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${selected ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: theme === "dark" ? value.ddot : value.dot }}
                        />
                        <span className="capitalize">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
                  Title
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder={activeDataList?.id ? activeDataList?.title : "What do you want to accomplish?"}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-500"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold opacity-60 tracking-wider uppercase">
                  Description
                </label>
                <textarea
                  placeholder={activeDataList?.id ? activeDataList?.description : "Add some details about this task..."}
                  className="h-40 resize-none w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-500"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {activeDataList?.id && (
                  <button
                    disabled={createLoading}
                    className="flex-1 px-6 py-3.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all active:scale-95"
                    onClick={() => setToggleUpdate(false)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  disabled={activeDataList?.id ? updateLoading : createLoading}
                  className="flex-[2] px-6 py-3.5 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 border border-purple-500/50"
                  onClick={activeDataList?.id ? handleUpdate : handleCreate}
                >
                  {createLoading || updateLoading ? (
                    <CircleLoader />
                  ) : (
                    <>
                      <span>{activeDataList?.id ? "Save Changes" : "Create Task"}</span>
                      {!activeDataList?.id && <span className="text-lg leading-none">+</span>}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Right */}
      <div className="w-full lg:w-[72%] flex flex-col gap-4">
        {/* Timeline Header */}
        <Card heading="" cardWidth="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Timeline
                </h1>
                <p className="text-xs text-gray-400 font-medium">Manage your monthly schedule</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Month Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={handlePrevMonth}
                >
                  <MdKeyboardArrowLeft size={18} />
                </button>
                <span className="w-16 text-center text-purple-100">{monthStr}</span>
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={handleNextMonth}
                >
                  <MdKeyboardArrowRight size={18} />
                </button>
              </div>

              {/* Year Selector */}
              <div className="bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider p-1.5 flex items-center gap-3 backdrop-blur-md">
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={handlePrevYear}
                >
                  <MdKeyboardArrowLeft size={18} />
                </button>
                <span className="w-10 text-center text-blue-100">{year}</span>
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                  onClick={handleNextYear}
                >
                  <MdKeyboardArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Calandar */}
        <Card heading="" cardWidth="w-full">
          <div className="w-full p-2">
            <div className="grid grid-cols-7 text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              {Object.values(week).map((w, index) => (
                <div key={index} className="text-center py-2 bg-white/[0.02] rounded-lg mx-1 border border-white/5">
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
                const isSelected = isActualDay && new Date(year, month, dayNumber).toDateString() === selectedDate.toDateString();

                const exists = dataResList.find((r: CalandarDataI) => {
                  if (r.date) return new Date(r.date).toISOString() === target;
                });

                if (!isActualDay) {
                  return <div key={index} className="h-14 lg:h-28 rounded-2xl bg-white/[0.01] border border-white/[0.02]"></div>;
                }

                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`group overflow-hidden relative h-14 lg:h-28 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col ${isSelected
                      ? "bg-purple-500/10 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                      }`}
                    onClick={() => {
                      setSelectedDate(new Date(year, month, dayNumber));
                      setFormData({ status: "default", title: "", description: "" });
                      if (exists?.id) {
                        setActiveDataList(exists);
                        setToggleUpdate(false);
                      } else {
                        setActiveDataList({
                          id: "", date: null, status: "", title: "", description: "", updatedAt: "",
                        });
                        setToggleUpdate(false);
                      }
                    }}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-b border-white/5">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${isToday
                          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                          : isSelected
                            ? "bg-purple-500/20 text-purple-300"
                            : "text-gray-400 group-hover:text-white group-hover:bg-white/10"
                          } transition-colors`}
                      >
                        {dayNumber}
                      </div>

                      {exists?.id && (
                        <div
                          className="h-2 w-2 rounded-full sm:block hidden shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          style={{
                            backgroundColor: theme === "dark" ? statusColors[exists.status]?.ddot : statusColors[exists.status]?.dot,
                            boxShadow: `0 0 10px ${theme === "dark" ? statusColors[exists.status]?.ddot : statusColors[exists.status]?.dot}80`
                          }}
                        />
                      )}
                    </div>

                    {/* Day Content */}
                    <div className="hidden lg:flex flex-1 p-2 flex-col gap-1 overflow-hidden relative">
                      {exists?.id ? (
                        <>
                          <div
                            className="text-[11px] font-bold truncate px-1.5 py-0.5 rounded border"
                            style={{
                              color: theme === "dark" ? statusColors[exists.status]?.ddot : statusColors[exists.status]?.dot,
                              backgroundColor: `${theme === "dark" ? statusColors[exists.status]?.ddot : statusColors[exists.status]?.dot}15`,
                              borderColor: `${theme === "dark" ? statusColors[exists.status]?.ddot : statusColors[exists.status]?.dot}30`,
                            }}
                          >
                            {exists.title}
                          </div>
                          <p className="text-[10px] sm:block hidden text-gray-400 line-clamp-2 px-1 mt-0.5 leading-tight group-hover:text-gray-300 transition-colors">
                            {exists.description}
                          </p>
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
      </div>
    </div>
  );
};

export default Calendar;
