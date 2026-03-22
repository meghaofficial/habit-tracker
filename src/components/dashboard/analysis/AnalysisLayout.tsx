import TopTen from "./TopTen"

const AnalysisLayout = () => {
  return (
    <>
     <div className="flex mt-5">
      <div className="w-[20%]">
        <TopTen />
      </div>
      <div className="w-[60%]"></div>
      <div className="w-[20%]"></div>
    </div> 
    </>
  )
}

export default AnalysisLayout
