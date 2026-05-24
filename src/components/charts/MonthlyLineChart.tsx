import { LineChart } from "@mui/x-charts/LineChart";

export const MonthlyLineChart = ({ data }: { data: { dates: number[], tasks: number[] } }) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="min-w-225">
        <LineChart
          xAxis={[
            {
              data: data?.dates,
            },
          ]}
          series={[
            {
              data: data?.tasks,
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