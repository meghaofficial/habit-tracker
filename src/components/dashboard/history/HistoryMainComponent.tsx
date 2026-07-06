import { useState } from "react";
import Card from "../../shared/Card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArchive, 
  FiCheck, 
  FiX, 
  FiMinus, 
  FiTrendingUp, 
  FiTarget, 
  FiFileText, 
  FiCalendar, 
  FiAward, 
  FiAlertCircle, 
  FiBarChart2 
} from "react-icons/fi";

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
    }
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
      { week: "Week 4", rate: 87 }
    ],
    monthlyTargets: [
      "Maintain a 75%+ overall completion score",
      "Get a perfect week for 'Gym Workout'",
      "Read at least 15 pages every single day"
    ],
    monthlyNotes: "June was a strong month overall. Hydration and Gym workouts were very consistent, but reading dipped in Week 3 due to working late on the dashboard redesign project. Recovered well in Week 4 with a solid streak.",
    habits: [
      { id: "h1", name: "Drink 3L Water", category: "Health", icon: "💧", completionRate: 93 },
      { id: "h2", name: "Gym Workout", category: "Fitness", icon: "🏋️‍♂️", completionRate: 80 },
      { id: "h3", name: "Read Books", category: "Mind", icon: "📚", completionRate: 60 },
      { id: "h4", name: "8 Hours Sleep", category: "Health", icon: "😴", completionRate: 83 },
      { id: "h5", name: "Coding Practice", category: "Career", icon: "💻", completionRate: 70 }
    ],
    dailyMatrix: Array.from({ length: 30 }).reduce<PastMonthData["dailyMatrix"]>((acc, _, index) => {
      const day = index + 1;
      // Generate realistic daily patterns for 5 habits
      acc[day] = {
        h1: day % 15 === 0 ? "missed" : "completed",
        h2: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30].includes(day) 
          ? "completed" 
          : ([6, 13, 20, 27].includes(day) ? "missed" : "skipped"),
        h3: day < 15 ? (day % 3 === 0 ? "missed" : "completed") : (day % 2 === 0 ? "completed" : "missed"),
        h4: day % 6 === 0 ? "missed" : "completed",
        h5: [1, 2, 3, 5, 8, 9, 10, 12, 15, 16, 17, 19, 22, 23, 24, 26, 29, 30].includes(day) ? "completed" : "missed"
      };
      return acc;
    }, {})
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
      { week: "Week 4", rate: 81 }
    ],
    monthlyTargets: [
      "Keep 'Meditation' above 90%",
      "Limit fast food to twice a month",
      "No missed sleep tasks"
    ],
    monthlyNotes: "Excellent focus in May. Meditation habit is starting to feel natural. Sleep schedule was highly regular, which positively affected daytime energy and focus during gym workouts.",
    habits: [
      { id: "h1", name: "Drink 3L Water", category: "Health", icon: "💧", completionRate: 90 },
      { id: "h2", name: "Gym Workout", category: "Fitness", icon: "🏋️‍♂️", completionRate: 75 },
      { id: "h4", name: "8 Hours Sleep", category: "Health", icon: "😴", completionRate: 93 },
      { id: "h6", name: "Daily Meditation", category: "Mind", icon: "🧘‍♂️", completionRate: 87 }
    ],
    dailyMatrix: Array.from({ length: 31 }).reduce<PastMonthData["dailyMatrix"]>((acc, _, index) => {
      const day = index + 1;
      acc[day] = {
        h1: day % 10 === 0 ? "missed" : "completed",
        h2: day % 3 === 0 ? "completed" : (day % 7 === 0 ? "missed" : "skipped"),
        h4: day % 15 === 0 ? "missed" : "completed",
        h6: day % 8 === 0 ? "missed" : "completed"
      };
      return acc;
    }, {})
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
      { week: "Week 4", rate: 65 }
    ],
    monthlyTargets: [
      "Establish routine in the new apartment",
      "Drink water consistently",
      "Workout at least 3 times a week"
    ],
    monthlyNotes: "A chaotic month due to moving apartments. Hard to keep up with daily habits in the first two weeks, but settled down towards the middle. Focus for May will be rebuilding consistency.",
    habits: [
      { id: "h1", name: "Drink 3L Water", category: "Health", icon: "💧", completionRate: 77 },
      { id: "h2", name: "Gym Workout", category: "Fitness", icon: "🏋️‍♂️", completionRate: 50 },
      { id: "h4", name: "8 Hours Sleep", category: "Health", icon: "😴", completionRate: 63 },
      { id: "h6", name: "Daily Meditation", category: "Mind", icon: "🧘‍♂️", completionRate: 70 }
    ],
    dailyMatrix: Array.from({ length: 30 }).reduce<PastMonthData["dailyMatrix"]>((acc, _, index) => {
      const day = index + 1;
      acc[day] = {
        h1: day % 4 === 0 ? "missed" : "completed",
        h2: day % 4 === 0 ? "completed" : "missed",
        h4: day % 3 === 0 ? "missed" : "completed",
        h6: day % 5 === 0 ? "missed" : "completed"
      };
      return acc;
    }, {})
  }
];

const HistoryMainComponent = () => {
  const [selectedMonthId, setSelectedMonthId] = useState(mockHistoryData[0].id);

  const selectedData = mockHistoryData.find(data => data.id === selectedMonthId) || mockHistoryData[0];
  const daysInMonth = Object.keys(selectedData.dailyMatrix).length;

  // Compile list of missed tasks
  const missedTasksList: { day: number; habitName: string; icon: string; category: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayData = selectedData.dailyMatrix[d];
    if (dayData) {
      Object.entries(dayData).forEach(([habitId, status]) => {
        if (status === "missed") {
          const habit = selectedData.habits.find(h => h.id === habitId);
          if (habit) {
            missedTasksList.push({
              day: d,
              habitName: habit.name,
              icon: habit.icon,
              category: habit.category
            });
          }
        }
      });
    }
  }

  // Radial progress constants
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (selectedData.overallProgress / 100) * circumference;

  return (
    <div className="flex flex-col lg:flex-row items-start mt-4 mb-6 gap-6 w-full text-white">
      {/* Left Sidebar: Month & Selector */}
      <div className="w-full lg:w-[28%] flex flex-col gap-6">
        {/* Selector Card */}
        <Card heading="" cardWidth="w-full">
          <div className="p-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                <FiArchive size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  History Archive
                </h2>
                <p className="text-xs text-gray-400 font-medium">Select a past month</p>
              </div>
            </div>

            <div className="space-y-3">
              {mockHistoryData.map((data) => {
                const isActive = data.id === selectedMonthId;
                return (
                  <button
                    key={data.id}
                    onClick={() => setSelectedMonthId(data.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 border ${
                      isActive 
                        ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-md" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiCalendar className={isActive ? "text-yellow-400" : "text-gray-500"} />
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-300"}`}>
                          {data.monthName} {data.year}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {data.totalHabits} Habits Tracked
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isActive 
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" 
                        : "bg-white/5 text-gray-400 border-white/5"
                    }`}>
                      {data.overallProgress}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Month Summary Statistics */}
        <Card heading="" cardWidth="w-full">
          <div className="p-1 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Performance Summary
            </h3>
            
            {/* Overall Radial Meter */}
            <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all duration-500" />
              
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  stroke="rgba(255, 255, 255, 0.05)"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                {/* Active Ring */}
                <motion.circle
                  stroke="url(#yellowGradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + " " + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{selectedData.overallProgress}%</span>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Score</p>
              </div>

              <span className="mt-4 text-xs font-medium text-gray-300 text-center">
                Overall completion rate for {selectedData.monthName}
              </span>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <FiCheck className="text-emerald-400 mx-auto mb-1.5" size={16} />
                <span className="text-sm font-bold block">{selectedData.completedTasksCount}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Done</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <FiX className="text-rose-400 mx-auto mb-1.5" size={16} />
                <span className="text-sm font-bold block">{selectedData.missedTasksCount}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Missed</span>
              </div>
            </div>

            {/* Week-wise Progress Bars */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiBarChart2 size={12} /> Week-wise Breakdown
              </h4>
              <div className="space-y-3">
                {selectedData.weekWiseProgress.map((w, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400 font-medium">{w.week}</span>
                      <span className="text-yellow-400 font-semibold">{w.rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${w.rate}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Content Area: Month Details */}
      <div className="w-full lg:w-[72%] flex flex-col gap-6">
        
        {/* Header Ribbon / Archived Notice */}
        <Card heading="" cardWidth="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {selectedData.monthName} {selectedData.year} Report
                </h1>
                <p className="text-xs text-gray-400 font-medium">Historical review of your habits and milestones</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold tracking-widest uppercase animate-pulse">
              <FiArchive size={12} className="inline mr-1" /> Archived • Read-Only
            </div>
          </div>
        </Card>

        {/* Goals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Targets */}
          <Card heading="" cardWidth="w-full">
            <div className="p-1 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiTarget className="text-yellow-400" /> Monthly Targets Set
              </h3>
              <ul className="space-y-3.5 mt-1">
                {selectedData.monthlyTargets.map((target, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-300 leading-tight">
                      {target}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Monthly Notes */}
          <Card heading="" cardWidth="w-full">
            <div className="p-1 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiFileText className="text-orange-400" /> Reflections & Notes
              </h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[160px] flex flex-col justify-between">
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{selectedData.monthlyNotes}"
                </p>
                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-4 border-t border-white/5 pt-3">
                  <span className="font-semibold flex items-center gap-1">
                    <FiAward className="text-yellow-500" />
                    Month Outcome
                  </span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    COMPLETED
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Daywise and Taskwise Progress Grid */}
        <Card heading="" cardWidth="w-full">
          <div className="p-1 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FiCalendar className="text-yellow-400" /> Daily Habits Matrix
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">Horizontal scrolling overview of all habits tracked day by day</p>
              </div>
              <div className="flex gap-4 text-[10px] text-gray-400 font-semibold">
                <span className="flex items-center gap-1"><FiCheck className="text-emerald-400" /> Done</span>
                <span className="flex items-center gap-1"><FiX className="text-rose-400" /> Missed</span>
                <span className="flex items-center gap-1"><FiMinus className="text-gray-500" /> Skipped</span>
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
                      <th key={index} className="px-2.5 py-3 text-center text-xs font-bold min-w-[36px]">
                        {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedData.habits.map((habit) => (
                    <tr key={habit.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="sticky left-0 bg-[#16161c] px-4 py-3 font-semibold text-sm border-r border-white/5 flex items-center justify-between gap-3 z-10">
                        <div className="flex items-center gap-2 truncate">
                          <span>{habit.icon}</span>
                          <span className="truncate text-gray-200">{habit.name}</span>
                        </div>
                        <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                          {habit.completionRate}%
                        </span>
                      </td>
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const status = selectedData.dailyMatrix[day]?.[habit.id] || "skipped";
                        
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
                <FiAlertCircle className="text-rose-400" /> Missed Tasks Analysis
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">Audit log of missed habits to help you spot behavioral blocks</p>
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
                  <p className="text-sm font-bold text-gray-300 mt-2">Zero Missed Tasks!</p>
                  <p className="text-xs text-gray-500 mt-1">You maintained absolute consistency this month.</p>
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
