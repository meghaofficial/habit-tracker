import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";

type Props = {
  value: number;
  type: string;
};

export const ProgressPie = ({ value, type }: Props) => {
  const theme = useSelector((state: RootState) => state.theme);
  const isAnalysis = type === "analysis";

  return (
    <div
      className={`${
        isAnalysis ? "w-full h-40 overflow-y-hidden" : "h-20 top-1.5"
      } flex items-center justify-center relative`}
    >
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: value,
                color: "#6366f1",
                label: "Completed",
              },
              {
                id: 1,
                value: 100 - value,
                color: "#cbd5f5",
                label: "Incompleted",
              },
            ],
            innerRadius: isAnalysis ? 40 : 10,
            outerRadius: isAnalysis ? 50 : 30,
            startAngle: 90,
            endAngle: -270,
            paddingAngle: 0,
            cornerRadius: 5,
          },
        ]}
        width={isAnalysis ? 150 : 100}
        height={250}
        slotProps={{ legend: { hidden: true } }}
      />

      {/* Center Label */}
      {isAnalysis && (
        <span className="absolute font-semibold">
          {value === 100 ? "100.0" : value}%
        </span>
      )}
    </div>
  );
};
