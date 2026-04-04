import { LineChart } from "@mui/x-charts/LineChart";

type Props = {
  values: number[];
};

export const MonthlyLineChart = ({ values }: Props) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="min-w-225">
        <LineChart
          xAxis={[
            {
              data: Array.from({ length: 31 }, (_, i) => i + 1),
            },
          ]}
          series={[
            {
              data: values,
              color: "#6366f1",
              area: false, 
            },
          ]}
          height={300}
          sx={{
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: "white !important",
            },
            "& .MuiChartsAxis-label": {
              fill: "white !important",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "white !important",
            },
          }}
        />
      </div>
    </div>
  );
};