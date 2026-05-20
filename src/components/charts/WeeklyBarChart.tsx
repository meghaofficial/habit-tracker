import { BarChart } from "@mui/x-charts/BarChart";

export const WeeklyBarChart = ({ data, maxValue }: { data: {date: string, week: string, range: string, weekDays: string[], taskDone: number[] }, maxValue: number }) => {

  return (
    <div className="w-full h-70">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: data?.weekDays,
            label: "Days",
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: maxValue,
            label: "Tasks"
          },
        ]}
        series={[
          {
            data: data?.taskDone,
            color: "#6366f1",
          },
        ]}
        borderRadius={6}
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
  );
};