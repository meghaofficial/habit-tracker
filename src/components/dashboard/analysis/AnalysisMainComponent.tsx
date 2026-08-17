import type { TaskI, TopLevelAnalysisI } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../api/dashboard.api";
import { getTopLevelAnalysis } from "../../../api/analysis.api";
import TopLevelMatrics from "./TopLevelMatrics";
import WeeklyActivity from "./WeeklyActivity";
import MonthlyActivity from "./MonthlyActivity";
import Targets from "./Targets";
import HabitInsights from "./insights/HabitInsights";
import InsightUpperHeader from "./InsightUpperHeader";

const AnalysisMainComponent = ({ monthDashID }: { monthDashID: string }) => {
  const topLevelAnalysisData = useQuery({
    queryKey: ["top_level_analysis", monthDashID],
    queryFn: () => getTopLevelAnalysis(monthDashID!),
    enabled: !!monthDashID,
  });
  const topLevelData: TopLevelAnalysisI = topLevelAnalysisData.data?.data;

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
        loading={topLevelAnalysisData?.isPending}
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
