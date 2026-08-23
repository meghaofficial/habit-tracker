import type { TaskI, TopLevelAnalysisI } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../api/dashboard.api";
import TopLevelMatrics from "./TopLevelMatrics";
import WeeklyActivity from "./WeeklyActivity";
import MonthlyActivity from "./MonthlyActivity";
import Targets from "./Targets";
import HabitInsights from "./insights/HabitInsights";
import InsightUpperHeader from "./InsightUpperHeader";
import { axiosPrivate } from "../../../api/axios";
import { useEffect, useState } from "react";
import axios from "axios";

const AnalysisMainComponent = ({ monthDashID }: { monthDashID: string }) => {
  const [loading, setLoading] = useState(false);
  const [topLevelData, setTopLevelData] = useState<TopLevelAnalysisI>({
    consistencyRate: "0",
    perfectDays: 0,
    totalDaysInMonth: 0,
    avgPerDay: 0,
    timeElapsed: 0,
    streak: 0,
    perfectStreak: 0,
    mostConsistentHabits: [],
    leastConsistentHabits: [],
  });

  const getTopLevelData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/analysis?monthDashID=${monthDashID}`,
      );
      setTopLevelData(res?.data?.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setTopLevelData({
            consistencyRate: "0",
            perfectDays: 0,
            totalDaysInMonth: 0,
            avgPerDay: 0,
            timeElapsed: 0,
            streak: 0,
            perfectStreak: 0,
            mostConsistentHabits: [],
            leastConsistentHabits: [],
          });
          console.log("404 message:", error.response?.data?.data);
        }
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopLevelData();
  }, []);

  const taskListData = useQuery({
    queryKey: ["tasks", monthDashID],
    queryFn: () => getTasks(monthDashID),
    enabled: !!monthDashID,
  });
  const taskList: TaskI[] = taskListData?.data?.tasks;

  return (
    <div className="flex flex-col gap-4 w-full text-white mt-4">
      <InsightUpperHeader />

      <TopLevelMatrics
        topLevelData={topLevelData}
        loading={loading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WeeklyActivity
          topLevelData={topLevelData}
          numHabits={taskList?.length}
          monthDashID={monthDashID}
        />
        <HabitInsights topLevelData={topLevelData} monthDashID={monthDashID} />
      </div>

      <MonthlyActivity
        topLevelData={topLevelData}
        numHabits={taskList?.length}
        monthDashID={monthDashID}
      />

      <Targets monthDashID={monthDashID} />
    </div>
  );
};

export default AnalysisMainComponent;
