import { useEffect, useState } from "react"
import { axiosPrivate } from "../../../api/axios"
import { MonthlyLineChart } from "../../charts/MonthlyLineChart"
import { ProgressPie } from "../../charts/ProgressPie"
import TodayAllTasks from "../../charts/TodayAllTasks"
import { WeeklyBarChart } from "../../charts/WeeklyBarChart"

const AnalysisMainComponent = ({ taskList, monthDashID }: {
  taskList: { _id: string, taskName: string, monthDashID: string }[], monthDashID: string
}) => {

  const [todayProgress, setTodayProgress] = useState("0");
  const [todayDate, setTodayDate] = useState("");
  const [weeklyAna, setWeeklyAna] = useState<{
    date: string, week: string, range: string, weekDays: string[], taskDone: number[]
  }>({
    date: "", week: "", range: "", weekDays: [], taskDone: []
  });
  const [monthlyAna, setMonthlyAna] = useState<{ dates: number[], tasks: number[] }>({
    dates: [], tasks: []
  });

  const lineValues = Array.from({ length: 31 }, () =>
    Math.floor(Math.random() * 100)
  );

  const getTodaysActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-today-activity`);
      if (res?.data?.success) {
        setTodayProgress(res?.data?.progress);
        setTodayDate(res?.data?.date);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getWeeklyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-weekly-activity?monthDashID=${monthDashID}`);
      if (res?.data?.success) {
        setWeeklyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  const getMonthlyActivity = async () => {
    // setDashLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/get-monthly-activity?monthDashID=${monthDashID}`);
      if (res?.data?.success) {
        setMonthlyAna(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setDashLoading(false);
    }
  }

  useEffect(() => {
    getTodaysActivity();
    getWeeklyActivity();
    getMonthlyActivity();
  }, []);

  return (
    <>
      {/* upper daywise, weekly, todays task */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div className="bg-darkCard light:bg-lightCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Activity</p>
            {/* 3 April 2026 */}
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{todayDate}</p>
          </div>
          <div className="flex items-center justify-center -mt-2">
            <ProgressPie value={Number(todayProgress)} type="analysis" />
          </div>
        </div>
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          {/* <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Weekly Activity</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{weeklyAna?.date}</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-7">
            <WeeklyBarChart data={weeklyAna} />
          </div> */}
        </div>
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Tasks</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">3 April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5">
            <TodayAllTasks taskList={taskList} fullDate={todayDate} />
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 gap-4">
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Weekly Activity</p>
            {/* April 2026 */}
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">{weeklyAna?.date}</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-7">
            <WeeklyBarChart data={weeklyAna} maxValue={taskList?.length} />
          </div>
        </div>
        {/* curr month progress */}
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Monthly Activity</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-5">
            <MonthlyLineChart data={monthlyAna} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AnalysisMainComponent
