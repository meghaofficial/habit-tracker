import { PieChart } from "@mui/x-charts/PieChart";

type Props = {
  value: number;
  type: string;
};

export const ProgressPie = ({ value, type }: Props) => {

  const theme = localStorage.getItem("theme");
  const isAnalysis = type === "analysis";

  return (
    <div
      className={`${isAnalysis ? "w-64 h-64" : "h-20 top-1.5"
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
                // label: isAnalysis ? "Completed" : undefined,
                label: "Completed"
              },
              {
                id: 1,
                value: 100 - value,
                color: "#cbd5f5",
                // label: isAnalysis ? "Incompleted" : undefined,
                label: "Incompleted"
              },
            ],
            innerRadius: isAnalysis ? 40 : 10,
            outerRadius: isAnalysis ? 90 : 30,
            startAngle: 90,
            endAngle: -270,
            paddingAngle: 0,
            cornerRadius: 5,
          },
        ]}
        width={isAnalysis ? 250 : 100}
        height={250}
        // sx={{
        //   "& .MuiChartsLegend-label": {
        //     fontSize: !isAnalysis && 6,
        //   },
        // }}
      />

      {/* Center Label */}
      {isAnalysis && (
        <span className="absolute right-35 text-xl font-semibold">
          {value === 100 ? '100.0' : value}%
        </span>
      )}
    </div>
  );
};