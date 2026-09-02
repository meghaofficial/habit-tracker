import type { TaskI } from "../../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks } from "../../../api/dashboard.api";
import { InputData } from "./InputData";
import { axiosPrivate } from "../../../api/axios";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import CustomButton from "../../shared/CutomButton";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Popup from "../../shared/Popup";
import PopupBox from "../../shared/PopupBox";
import { FiTrash2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import CircleLoader from "../../loaders/CircleLoader";
import axios from "axios";
import { notify } from "../../../helper";

const HabitSection = ({
  loading,
  dashboardID,
  month,
  year,
}: {
  loading: boolean;
  dashboardID: string;
  month: number;
  year: number;
}) => {
  const [makeDisable, setMakeDisable] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const taskListData = useQuery({
    queryKey: ["tasks", dashboardID],
    queryFn: () => getTasks(dashboardID),
    enabled: !!dashboardID,
  });

  const taskList: TaskI[] = taskListData?.data?.tasks;
  const [prevTotalTasks, setPrevTotalTasks] = useState(0);
  const [prevDashID, setPrevDashID] = useState("");

  const lastMonth = async () => {
    setDisableLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/last-month?month=${month}&year=${year}`,
      );
      setMakeDisable(!res?.data?.success);
      setPrevTotalTasks(res?.data?.totalTasks);
      setPrevDashID(res?.data?.monthDashID);
    } catch (error) {
      console.error(error);
    } finally {
      setDisableLoading(false);
    }
  };

  useEffect(() => {
    lastMonth();
  }, []);

  return (
    <div>
      <div className="relative border-b border-black">
        <p
          className="smText p-5.5 text-center"
          style={{ fontWeight: "bolder" }}
        >
          DAILY HABITS
        </p>

        <button
          onClick={() => setOpenPopup(true)}
          title="Reset dashboard"
          disabled={makeDisable}
          className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors duration-200 absolute right-2 top-1/4
    ${
      makeDisable
        ? "bg-yellow-500/5 border-yellow-500/10 text-yellow-400/40 cursor-not-allowed opacity-50"
        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 cursor-pointer"
    }`}
        >
          <MdOutlineCalendarMonth size={12} />
        </button>
      </div>

      <p
        className="smText p-2.5 text-center text-white border-b border-darkBg bg-darkPrimary light:bg-lightPrimary"
        style={{ fontWeight: "bold" }}
      >
        HABITS
      </p>

      {loading ? (
        <div className="p-2 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-gray-500/50 h-7 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        taskList?.map((task, index) => (
          <div key={task._id}>
            <InputData
              index={index}
              taskId={task._id}
              taskName={task.taskName}
            />
          </div>
        ))
      )}
      <div className="h-10 flex items-center justify-between px-2"></div>
      {openPopup && (
        <AddTaskListPopupSection
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          monthDashID={prevDashID}
          currMonthID={dashboardID}
        />
      )}
    </div>
  );
};

const AddTaskListPopupSection = ({
  openPopup,
  setOpenPopup,
  monthDashID,
  currMonthID,
}: {
  openPopup: boolean;
  setOpenPopup: Dispatch<SetStateAction<boolean>>;
  monthDashID: string;
  currMonthID: string;
}) => {
  const [list, setList] = useState<TaskI[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const queryClient = useQueryClient();

  const getListMonthList = async () => {
    // setDisableLoading(true);
    try {
      const res = await axiosPrivate.get(
        `/api/task-list?monthDashID=${monthDashID}`,
      );
      setList(res?.data?.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      // setDisableLoading(false);
    }
  };

  const handleRemove = (taskID: string) => {
    setList((prev) => prev.filter((task) => task._id !== taskID));
  };

  const handleAddTaskList = async () => {
    setAddLoading(true);
    try {
      const res = await axiosPrivate.put(
        `/api/task-list?monthDashID=${currMonthID}`,
        list,
      );
      if (res?.data?.success) {
        notify.success("Task has been added");
        setOpenPopup(false);
        await queryClient.invalidateQueries({ queryKey: ["tasks", currMonthID] });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          notify.error(error.response.data.message);
        } else {
          console.error(
            `HTTP Error (${error.response?.status}):`,
            error.response?.data,
          );
          notify.error("Something went wrong please try again later");
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    getListMonthList();
  }, []);

  return (
    <PopupBox open={openPopup} setOpen={setOpenPopup}>
      <div className="relative">
        {/* Header */}
        <div className="pr-10 mb-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-2">
            Previous Tasks
          </p>
          <h2 className="text-xl font-semibold text-white">
            Bring your tasks forward
          </h2>
          <p className="mt-2 text-[11px] text-gray-400">
            We've found tasks from your previous list. Remove anything you don't
            want to continue with.
          </p>
        </div>
        {/* Task List */}
        <div className="space-y-2 max-h-75 overflow-y-auto pr-1 hide-scrollbar">
          {list.length > 0 ? (
            list.map((task, index) => (
              <div
                key={task._id}
                className=" group flex items-center justify-between gap-4 px-4 py-2 bg-white/2.5 border border-white/6 rounded-xl transition-all duration-200 hover:bg-indigo-500/6 hover:border-indigo-500/15 "
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Number */}
                  <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold ">
                    {index + 1}
                  </span>
                  {/* Task Name */}
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {task.taskName}
                  </span>
                </div>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(task._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer "
                  title="Remove task"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500"> No tasks selected </p>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              {list.length} {list.length === 1 ? "task" : "tasks"} selected
            </p>
            <button
              type="button"
              disabled={list.length === 0}
              onClick={handleAddTaskList}
              className={`min-w-25 flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${addLoading ? "bg-indigo-600/30 text-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"}  text-[11px] font-semibold shadow-lg shadow-indigo-500/10 transition-all duration-200`}
            >
              {addLoading ? (
                <CircleLoader />
              ) : (
                <span className="flex items-center gap-2">
                  <IoAdd size={18} /> Add to List
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </PopupBox>
  );
};

export default HabitSection;
