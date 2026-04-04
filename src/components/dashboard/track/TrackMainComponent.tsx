import { useState } from "react"
import { ProgressPie } from "../../charts/ProgressPie";
import DailyCalanderTaskSheet from "../taskSheet/DailyCalanderTaskSheet";

const TrackMainComponent = () => {

  const [activeMon, setActiveMon] = useState("April");
  const subsMon = ["April", "May", "June"];
  const [rows, setRows] = useState(1);
  const rowLimit = 10;

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
          <ProgressPie value={40} type="track" />
        </div>
      </div>

      {/* MAIN CHART */}
      <>
        <div className="flex gap-4 mt-4">
          <div className="w-[20%]"></div>
          <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl h-35"></div>
          <div className="w-[15%]"></div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-darkCard light:bg-lightCard w-[20%] rounded-2xl"></div>
          <div className="bg-darkCard light:bg-lightCard w-[65%] rounded-2xl">
            <DailyCalanderTaskSheet rows={rows} setRows={setRows} rowLimit={rowLimit} />
          </div>
          <div className="bg-darkCard light:bg-lightCard w-[15%] rounded-2xl"></div>
        </div>
      </>
    </>
  )
}

export default TrackMainComponent
