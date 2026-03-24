import MonthlyTarget from "./MonthlyTarget"
import TopTen from "./TopTen"

const AnalysisLayout = () => {
  return (
    <>
     <div className="flex mt-5 gap-3">
      <div className="w-[40%]">
        <MonthlyTarget />
      </div>
      <div className="w-[20%]">
        <TopTen />
      </div>
      <div className="w-[20%]">
        {/* <TopTen /> */}
      </div>
      <div className="w-[20%]">
        {/* <TopTen /> */}
      </div>
    </div> 
    </>
  )
}

export default AnalysisLayout
