import { MonthlyLineChart } from "../../charts/MonthlyLineChart"
import { ProgressPie } from "../../charts/ProgressPie"
import TodayAllTasks from "../../charts/TodayAllTasks"
import { WeeklyBarChart } from "../../charts/WeeklyBarChart"

const AnalysisMainComponent = () => {

  const lineValues = Array.from({ length: 31 }, () =>
    Math.floor(Math.random() * 100)
  );

  return (
    <>
      {/* upper daywise, weekly, todays task */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Activity</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">3 April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5">
            <ProgressPie value={72} type="analysis" />
          </div>
        </div>
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Weekly Activity</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5 pe-7">
            <WeeklyBarChart maxValue={100} />
          </div>
        </div>
        <div className="bg-darkCard light:bg-lightCard rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-lg px-5 py-3">Todays Tasks</p>
            <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">3 April 2026</p>
          </div>
          <div className="flex items-center justify-center mt-5">
            <TodayAllTasks />
          </div>
        </div>
      </div>

      {/* curr month progress */}
      <div className="bg-darkCard light:bg-lightCard rounded-2xl mt-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg px-5 py-3">Monthly Activity</p>
          <p className="text-gray-500 text-[10px] px-5 py-3 cursor-default" title="Today's Date">April 2026</p>
        </div>
        <div className="flex items-center justify-center mt-5 pe-5">
          <MonthlyLineChart values={lineValues} />
        </div>
      </div>
    </>
  )
}

export default AnalysisMainComponent
