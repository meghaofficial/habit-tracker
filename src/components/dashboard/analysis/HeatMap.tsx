import type { HeatMapI } from "../../../types";

const palette = [
  "#EEF2FF",
  "#E0E7FF",
  "#C7D2FE",
  "#A5B4FC",
  "#818CF8",
  "#6366F1",
  "#4F46E5",
  "#4338CA",
  "#3730A3",
  "#312E81",
  "#1E1B4B",
];

const HeatMap = ({ heatMapData }: { heatMapData: HeatMapI[] }) => {
  console.log("hi", heatMapData)
  return (
    <div className="flex flex-wrap gap-2">
      {heatMapData?.map((d, index) => (
        <div key={index} className={`h-7 w-7 rounded-lg`} style={{ backgroundColor: palette[d.count] }} title={`${d.count} tasks completed`}></div>
      ))}
    </div>
  )
}

export default HeatMap
