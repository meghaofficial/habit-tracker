import { PieChart } from "@mui/x-charts/PieChart";

type Props = {
  value: number;
};

export const ProgressPie = ({ value }: Props) => {
  return (
    <div className="w-64 h-64 flex items-center justify-center relative">
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: value, color: "#6366f1", label: "Completed" },
              { id: 1, value: 100 - value, color: "#cbd5f5", label: "Incompleted" },
            ],
            innerRadius: 40,
            outerRadius: 90,
            startAngle: 90,
            endAngle: -270,
            paddingAngle: 0,
            cornerRadius: 5,
          },
        ]}
        width={250}
        height={250}
      />

      {/* Center Label */}
      <span className="absolute text-xl font-semibold right-40">
        {value}%
      </span>
    </div>
  );
};