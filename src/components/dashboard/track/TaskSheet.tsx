import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask, removeTask, resetDateLogs } from "../../../api/dashboard.api";
import type { DashboardI, DateLogI, ProgressI, TaskI } from "../../../types";
import { useEffect, useState } from "react";
import { notify } from "../../../helper";
import { useIsMobile } from "../../hooks/mobileHook";
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet";
import MobileDailyTaskSheet from "./mobile_view/MobileDailyTaskSheet";
import { socket } from "../../../socket/socket";

const TaskSheet = ({
  dashboardData,
  monthStatus,
  progress,
  setProgress,
  taskList,
  logsLoading,
  dateLogs,
}: {
  dashboardData: DashboardI;
  monthStatus: string;
  progress: ProgressI;
  setProgress: React.Dispatch<React.SetStateAction<ProgressI>>;
  taskList: TaskI[];
  logsLoading: boolean;
  dateLogs: DateLogI[];
}) => {
  const queryClient = useQueryClient();
  const [removeRowID, setRemoveRowID] = useState<string | null>(null);
  const rowLimit = 10;
  const isMobile = useIsMobile();

  // React Query Mutations
  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      const pr = data.progress;
      setProgress((prev) => ({
        ...prev,
        overallProgress: pr.overallProgress,
        dateLogProgress: prev.dateLogProgress.map((d, index) => ({
          ...d,
          progress: pr.dateLogProgress[index].progress,
        })),
        taskProgress: [
          ...prev.taskProgress,
          { id: data.task._id, count: 0, progress: "0" },
        ],
      }));
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: removeTask,
    onSuccess: (data) => {
      const pr = data.progress;
      setProgress((prev) => ({
        ...prev,
        overallProgress: pr.overallProgress,
        dateLogProgress: prev.dateLogProgress.map((d, index) => ({
          ...d,
          progress: pr.dateLogProgress[index].progress,
        })),
        taskProgress: prev.taskProgress.filter((d) => d?.id !== removeRowID),
      }));
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    },
    onError: () => {
      notify.error("Please try again.");
    },
  });

  const resetDateLogsMutation = useMutation({
    mutationFn: resetDateLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["date_logs", dashboardData?._id],
      });
    },
    onError: () => {
      notify.error("Please try again.");
    },
  });

  // Functions
  const handleDeleteRow = (taskID: string) => {
    setRemoveRowID(taskID);

    deleteTaskMutation.mutate(
      {
        taskID,
        dashboardID: dashboardData!._id,
      },
      {
        onSettled: () => {
          setRemoveRowID(null);
        },
      },
    );
  };

  const handleAddRow = () => {
    if (taskList?.length >= rowLimit) return;
    if (monthStatus === "scheduled") {
      alert(
        "Can not add task as the subscription for this month is not active",
      );
      return;
    }
    addTaskMutation.mutate({
      dashboardID: dashboardData!._id,
      socketID: socket?.id || "",
    });
  };

  const handleReset = () => {
    const con = confirm("Are you sure you want to reset the dashboard?");
    if (!con) return;

    resetDateLogsMutation.mutate(dashboardData!._id);
  };

  useEffect(() => {
    const handleTaskAdded = (data: any) => {
      // console.log("Task added event received", data);
      // console.log("socketID", socket.id);
      const pr = data.progress;
      setProgress((prev) => ({
        ...prev,
        overallProgress: pr.overallProgress,
        dateLogProgress: prev.dateLogProgress.map((d, index) => ({
          ...d,
          progress: pr.dateLogProgress[index].progress,
        })),
        taskProgress: [
          ...prev.taskProgress,
          { id: data.task._id, count: 0, progress: "0" },
        ],
      }));
      queryClient.invalidateQueries({
        queryKey: ["tasks", dashboardData?._id],
      });
    };

    socket.on("add-task", handleTaskAdded);

    return () => {
      socket.off("add-task", handleTaskAdded);
    };
  }, [socket]);

  return isMobile ? (
    <MobileDailyTaskSheet
      dashboardData={dashboardData}
      taskList={taskList}
      setProgress={setProgress}
      handleDeleteRow={handleDeleteRow}
      dateLogs={dateLogs || []}
      logsLoading={logsLoading}
      handleAddRow={handleAddRow}
    />
  ) : (
    <DailyCalanderTaskSheet
      totalDays={dashboardData?.totalDays}
      firstDay={dashboardData?.firstDay}
      monthDashID={dashboardData?._id}
      progress={progress}
      setProgress={setProgress}
      taskList={taskList}
      handleDeleteRow={handleDeleteRow}
      handleReset={handleReset}
      addTaskLoading={addTaskMutation.isPending}
      handleAddRow={handleAddRow}
      removeRowID={removeRowID}
      dateLogs={dateLogs || []}
      logsLoading={logsLoading}
    />
  );
};

export default TaskSheet;
