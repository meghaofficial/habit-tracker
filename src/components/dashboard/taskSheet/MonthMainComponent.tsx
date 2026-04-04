import { useState } from "react"
import DailyCalanderTaskSheet from "./DailyCalanderTaskSheet"
import MonthSideSection from "./MonthSideSection";
import MonthProgressSideSection from "./MonthProgressSideSection";

const MonthMainComponent = () => {

  const [rows, setRows] = useState(1);

  return (
    <>
      <div className="flex gap-3 mt-4">
        <div className="w-[20%]">
          <MonthSideSection />
        </div>
        <div className="w-[60%]">
          <DailyCalanderTaskSheet rows={rows} setRows={setRows} rowLimit={rowLimit} />
        </div>
        <div className="w-[20%]">
          <MonthProgressSideSection rows={rows} />
        </div>
      </div>
    </>
  )
}

const rowLimit = 10;

export default MonthMainComponent