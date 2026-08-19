import { useEffect, useState } from "react";
import Card from "../../shared/Card";
import { motion } from "framer-motion";
import {
  FiArchive,
  FiCheck,
  FiX,
  FiMinus,
  FiTarget,
  FiFileText,
  FiCalendar,
  FiAward,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";
import { axiosPrivate } from "../../../api/axios";
import PastMonthsData from "./PastMonthsData";
import PerformanceSummary from "./PerformanceSummary";
import type { DashboardI } from "../../../types";
import MonthlyTargets from "./MonthlyTargets";
import MonthlyNote from "./MonthlyNote";

interface PastHabit {
  id: string;
  name: string;
  category: string;
  icon: string;
  completionRate: number;
}

interface PastMonthData {
  id: string;
  monthName: string;
  year: number;
  overallProgress: number;
  totalHabits: number;
  completedTasksCount: number;
  missedTasksCount: number;
  weekWiseProgress: { week: string; rate: number }[];
  monthlyTargets: string[];
  monthlyNotes: string;
  habits: PastHabit[];
  dailyMatrix: {
    [day: number]: {
      [habitId: string]: "completed" | "missed" | "skipped";
    };
  };
}

// 3 Months of comprehensive mock history data
const mockHistoryData: PastMonthData[] = [
  {
    id: "2026-06",
    monthName: "June",
    year: 2026,
    overallProgress: 76,
    totalHabits: 5,
    completedTasksCount: 114,
    missedTasksCount: 26,
    weekWiseProgress: [
      { week: "Week 1", rate: 82 },
      { week: "Week 2", rate: 70 },
      { week: "Week 3", rate: 65 },
      { week: "Week 4", rate: 87 },
    ],
    monthlyTargets: [
      "Maintain a 75%+ overall completion score",
      "Get a perfect week for 'Gym Workout'",
      "Read at least 15 pages every single day",
    ],
    monthlyNotes:
      "June was a strong month overall. Hydration and Gym workouts were very consistent, but reading dipped in Week 3 due to working late on the dashboard redesign project. Recovered well in Week 4 with a solid streak.",
    habits: [
      {
        id: "h1",
        name: "Drink 3L Water",
        category: "Health",
        icon: "💧",
        completionRate: 93,
      },
      {
        id: "h2",
        name: "Gym Workout",
        category: "Fitness",
        icon: "🏋️‍♂️",
        completionRate: 80,
      },
      {
        id: "h3",
        name: "Read Books",
        category: "Mind",
        icon: "📚",
        completionRate: 60,
      },
      {
        id: "h4",
        name: "8 Hours Sleep",
        category: "Health",
        icon: "😴",
        completionRate: 83,
      },
      {
        id: "h5",
        name: "Coding Practice",
        category: "Career",
        icon: "💻",
        completionRate: 70,
      },
    ],
    dailyMatrix: Array.from({ length: 30 }).reduce<
      PastMonthData["dailyMatrix"]
    >((acc, _, index) => {
      const day = index + 1;
      // Generate realistic daily patterns for 5 habits
      acc[day] = {
        h1: day % 15 === 0 ? "missed" : "completed",
        h2: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30].includes(day)
          ? "completed"
          : [6, 13, 20, 27].includes(day)
            ? "missed"
            : "skipped",
        h3:
          day < 15
            ? day % 3 === 0
              ? "missed"
              : "completed"
            : day % 2 === 0
              ? "completed"
              : "missed",
        h4: day % 6 === 0 ? "missed" : "completed",
        h5: [
          1, 2, 3, 5, 8, 9, 10, 12, 15, 16, 17, 19, 22, 23, 24, 26, 29, 30,
        ].includes(day)
          ? "completed"
          : "missed",
      };
      return acc;
    }, {}),
  },
  {
    id: "2026-05",
    monthName: "May",
    year: 2026,
    overallProgress: 84,
    totalHabits: 4,
    completedTasksCount: 104,
    missedTasksCount: 16,
    weekWiseProgress: [
      { week: "Week 1", rate: 90 },
      { week: "Week 2", rate: 85 },
      { week: "Week 3", rate: 80 },
      { week: "Week 4", rate: 81 },
    ],
    monthlyTargets: [
      "Keep 'Meditation' above 90%",
      "Limit fast food to twice a month",
      "No missed sleep tasks",
    ],
    monthlyNotes:
      "Excellent focus in May. Meditation habit is starting to feel natural. Sleep schedule was highly regular, which positively affected daytime energy and focus during gym workouts.",
    habits: [
      {
        id: "h1",
        name: "Drink 3L Water",
        category: "Health",
        icon: "💧",
        completionRate: 90,
      },
      {
        id: "h2",
        name: "Gym Workout",
        category: "Fitness",
        icon: "🏋️‍♂️",
        completionRate: 75,
      },
      {
        id: "h4",
        name: "8 Hours Sleep",
        category: "Health",
        icon: "😴",
        completionRate: 93,
      },
      {
        id: "h6",
        name: "Daily Meditation",
        category: "Mind",
        icon: "🧘‍♂️",
        completionRate: 87,
      },
    ],
    dailyMatrix: Array.from({ length: 31 }).reduce<
      PastMonthData["dailyMatrix"]
    >((acc, _, index) => {
      const day = index + 1;
      acc[day] = {
        h1: day % 10 === 0 ? "missed" : "completed",
        h2: day % 3 === 0 ? "completed" : day % 7 === 0 ? "missed" : "skipped",
        h4: day % 15 === 0 ? "missed" : "completed",
        h6: day % 8 === 0 ? "missed" : "completed",
      };
      return acc;
    }, {}),
  },
  {
    id: "2026-04",
    monthName: "April",
    year: 2026,
    overallProgress: 65,
    totalHabits: 4,
    completedTasksCount: 78,
    missedTasksCount: 38,
    weekWiseProgress: [
      { week: "Week 1", rate: 58 },
      { week: "Week 2", rate: 62 },
      { week: "Week 3", rate: 75 },
      { week: "Week 4", rate: 65 },
    ],
    monthlyTargets: [
      "Establish routine in the new apartment",
      "Drink water consistently",
      "Workout at least 3 times a week",
    ],
    monthlyNotes:
      "A chaotic month due to moving apartments. Hard to keep up with daily habits in the first two weeks, but settled down towards the middle. Focus for May will be rebuilding consistency.",
    habits: [
      {
        id: "h1",
        name: "Drink 3L Water",
        category: "Health",
        icon: "💧",
        completionRate: 77,
      },
      {
        id: "h2",
        name: "Gym Workout",
        category: "Fitness",
        icon: "🏋️‍♂️",
        completionRate: 50,
      },
      {
        id: "h4",
        name: "8 Hours Sleep",
        category: "Health",
        icon: "😴",
        completionRate: 63,
      },
      {
        id: "h6",
        name: "Daily Meditation",
        category: "Mind",
        icon: "🧘‍♂️",
        completionRate: 70,
      },
    ],
    dailyMatrix: Array.from({ length: 30 }).reduce<
      PastMonthData["dailyMatrix"]
    >((acc, _, index) => {
      const day = index + 1;
      acc[day] = {
        h1: day % 4 === 0 ? "missed" : "completed",
        h2: day % 4 === 0 ? "completed" : "missed",
        h4: day % 3 === 0 ? "missed" : "completed",
        h6: day % 5 === 0 ? "missed" : "completed",
      };
      return acc;
    }, {}),
  },
];

const HistoryMainComponent = ({ monthDashID } : { monthDashID: string }) => {

  const [monthsData, setMonthsData] = useState<DashboardI[]>([]); 
  const [selectedMonthId, setSelectedMonthId] = useState<string>(monthDashID);
  const [selectedMonth, setSelectedMonth] = useState<DashboardI>({
      _id: "",
  userID: "",
  month: 0,
  year: 0,
  totalCount: 0,
  totalTasks: 0,
  totalDays: 0,
  firstDay: 0,
  progress: "0"
  });

  const [loading, setLoading] = useState(false);

  const getPastMonthsData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/past-months-data`);
      if (res?.data?.success) {
        setMonthsData(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPastMonthsData();
  }, []);

  useEffect(() => {
    const foundMonth = monthsData.find(d => d._id === selectedMonthId);
  if (foundMonth) {
    setSelectedMonth(foundMonth);
  }
  }, [selectedMonthId, monthsData]);













  const selectedData =
    mockHistoryData.find((data) => data.id === selectedMonthId) ||
    mockHistoryData[0];
  const daysInMonth = Object.keys(selectedData.dailyMatrix).length;

  // Compile list of missed tasks
  const missedTasksList: {
    day: number;
    habitName: string;
    icon: string;
    category: string;
  }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayData = selectedData.dailyMatrix[d];
    if (dayData) {
      Object.entries(dayData).forEach(([habitId, status]) => {
        if (status === "missed") {
          const habit = selectedData.habits.find((h) => h.id === habitId);
          if (habit) {
            missedTasksList.push({
              day: d,
              habitName: habit.name,
              icon: habit.icon,
              category: habit.category,
            });
          }
        }
      });
    }
  }

  const getHistory = async () => {
    try {
      const res = await axiosPrivate.get(
        `/api/get-history?monthDashID=${`6a00185a0524d5acf66776ec`}`,
      );
      if (res?.data?.success) {
        // const fetchedNote = res?.data?.note?.note || "";
        // serverNoteRef.current = fetchedNote;
        // setMonthlyNote(fetchedNote);
        // setLastUpdates(res?.data?.note?.updatedAt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllSubs = async () => {
    // setAllSubsLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/all-subscriptions?type=expired`);
      if (res?.data?.success) {
        const list = res?.data?.subscriptions || [];
        // const sch = list?.filter((d: SubsList) => d?.status === "scheduled");
        // const exp = list?.filter((d: SubsList) => d?.status === "expired");
        // setScheduledList(sch);
        // setExpiredList(exp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setAllSubsLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
    getAllSubs();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-start mt-4 mb-6 gap-6 w-full text-white">
      {/* Left Sidebar: Month & Selector */}
      <div className="w-full lg:w-[28%] flex flex-col gap-4">
        <PastMonthsData selectedMonthId={selectedMonthId} setSelectedMonthId={setSelectedMonthId} data={monthsData} />
        <PerformanceSummary selectedMonth={selectedMonth} monthDashID={selectedMonthId} />
      </div>

      {/* Right Content Area: Month Details */}
      <div className="w-full lg:w-[72%] flex flex-col gap-4">
        {/* Header Ribbon / Archived Notice */}
        <Card heading="" cardWidth="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <h1 className="text-xl font-black bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {selectedData.monthName} {selectedData.year} Report
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Historical review of your habits and milestones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-widest uppercase animate-pulse">
              <FiArchive size={12} className="inline mr-1" /> Archived •
              Read-Only
            </div>
          </div>
        </Card>

        {/* Goals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MonthlyTargets monthDashID={selectedMonthId} />
          <MonthlyNote monthDashID={selectedMonthId} />
        </div>

        {/* Daywise and Taskwise Progress Grid */}
        <Card heading="" cardWidth="w-full">
          <div className="p-1 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiCalendar className="text-yellow-400" /> Daily Habits Matrix
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Horizontal scrolling overview of all habits tracked day by day
                </p>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-400 font-semibold">
                <span className="flex items-center gap-1">
                  <FiCheck className="text-emerald-400" /> Done
                </span>
                <span className="flex items-center gap-1">
                  <FiX className="text-rose-400" /> Missed
                </span>
                <span className="flex items-center gap-1">
                  <FiMinus className="text-gray-500" /> Skipped
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20 text-gray-400">
                    <th className="sticky left-0 bg-[#16161c] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r border-white/5 min-w-[160px] z-10">
                      Habits
                    </th>
                    {Array.from({ length: daysInMonth }).map((_, index) => (
                      <th
                        key={index}
                        className="px-2.5 py-3 text-center text-xs font-bold min-w-[36px]"
                      >
                        {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedData.habits.map((habit) => (
                    <tr
                      key={habit.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="sticky left-0 bg-[#16161c] px-4 py-3 font-semibold text-sm border-r border-white/5 flex items-center justify-between gap-3 z-10">
                        <div className="flex items-center gap-2 truncate">
                          <span>{habit.icon}</span>
                          <span className="truncate text-gray-200">
                            {habit.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                          {habit.completionRate}%
                        </span>
                      </td>
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const status =
                          selectedData.dailyMatrix[day]?.[habit.id] ||
                          "skipped";

                        return (
                          <td key={index} className="px-1.5 py-3 text-center">
                            <div className="flex items-center justify-center">
                              {status === "completed" && (
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs shadow-sm shadow-emerald-500/5">
                                  <FiCheck />
                                </div>
                              )}
                              {status === "missed" && (
                                <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xs shadow-sm shadow-rose-500/5">
                                  <FiX />
                                </div>
                              )}
                              {status === "skipped" && (
                                <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs">
                                  <FiMinus />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Missed Tasks Analysis / Log */}
        <Card heading="" cardWidth="w-full">
          <div className="p-1 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiAlertCircle className="text-rose-400" /> Missed Tasks
                Analysis
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Audit log of missed habits to help you spot behavioral blocks
              </p>
            </div>

            <div className="max-h-[280px] overflow-y-auto border border-white/5 rounded-2xl bg-white/[0.01]">
              {missedTasksList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4">
                  {missedTasksList.map((miss, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3.5 bg-rose-500/[0.02] border border-rose-500/10 hover:border-rose-500/25 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-xl bg-white/5 w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                          {miss.icon}
                        </span>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-gray-200 truncate leading-snug">
                            {miss.habitName}
                          </p>
                          <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
                            {miss.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-bold font-mono">
                          Day {miss.day}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="text-2xl">🎉</span>
                  <p className="text-sm font-bold text-gray-300 mt-2">
                    Zero Missed Tasks!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    You maintained absolute consistency this month.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HistoryMainComponent;
