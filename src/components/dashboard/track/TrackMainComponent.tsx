import { useState } from "react"
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "../taskSheet/DailyCalanderTaskSheet";
import MonthSideSection from "../taskSheet/MonthSideSection";
import MonthProgressSideSection from "../taskSheet/MonthProgressSideSection";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";

const TrackMainComponent = () => {

  const [activeMon, setActiveMon] = useState("April");
  const subsMon = ["April", "May", "June"];
  const [rows, setRows] = useState(1);
  const rowLimit = 10;
  const monthlyData = useSelector(
    (state: RootState) => state.monthlyData
  );
  const year = "2026";
  const month = "Apr";

  return (
    <>
      {/* details */}
      <div className="flex gap-4 mt-6">
        <div className="bg-darkCard light:bg-lightCard rounded-2xl w-[80%] p-6 flex flex-col gap-3">
          <span className="text-3xl tracking-wider font-bold playfair-display">{activeMon}, 2026</span>
          <div className="text-sm google-sans flex items-center gap-3 mt-3">
            {subsMon.map((mon, index) => (
              <button key={index} className={`px-4 py-2 rounded-full cursor-pointer hover:bg-darkPrimary light:hover:bg-lightPrimary ${activeMon === mon ? 'bg-darkPrimary light:bg-lightPrimary text-white' : 'bg-darkBox light:bg-lightBg'}`} onClick={() => setActiveMon(mon)}>{mon}</button>
            ))}
          </div>
        </div>
        <div className="bg-darkCard light:bg-lightCard rounded-2xl w-[20%] p-6">
          <ProgressPie value={year && month ? monthlyData[year][month].progress.progressPercent : 0} type="track" />
        </div>
      </div>

      {/* MAIN CHART */}
      <>
        <div className="flex gap-4 mt-4">
          <div className="w-[20%]"></div>
          <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl h-25"></div>
          <div className="w-[15%]"></div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-darkCard light:bg-lightCard w-[20%] rounded-2xl">
            <MonthSideSection />
          </div>
          <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl border border-gray-500">
            <DailyCalanderTaskSheet rows={rows} setRows={setRows} rowLimit={rowLimit} />
          </div>
          <div className="bg-darkCard light:bg-lightCard w-[15%] rounded-2xl">
            <MonthProgressSideSection rows={rows} />
          </div>
        </div>
      </>
    </>
  )
}

export default TrackMainComponent
