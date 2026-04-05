import { PieChart } from "@mui/x-charts/PieChart";

type Props = {
  value: number;
  type: string;
};

export const ProgressPie = ({ value, type }: Props) => {

  return (
    <div className={`${type === "analysis" ? 'w-64 h-64' : 'h-20 top-1.5'} flex items-center justify-center relative`}>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: value, color: "#6366f1", label: "Completed" },
              { id: 1, value: 100 - value, color: "#cbd5f5", label: "Incompleted" },
            ],
            innerRadius: type === "analysis" ? 40 : 30,
            outerRadius: type === "analysis" ? 90 : 50,
            startAngle: 90,
            endAngle: -270,
            paddingAngle: 0,
            cornerRadius: 5,
          },
        ]}
        width={type === "analysis" ? 250 : 100}
        height={250}
      />

      {/* Center Label */}
      <span className={`absolute font-semibold ${type === "analysis" ? 'right-40 text-xl' : 'right-33'}`}>
        {value}%
      </span>
    </div>
  );
};