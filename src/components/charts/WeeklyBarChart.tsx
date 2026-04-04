import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  maxValue: number;
};

export const WeeklyBarChart = ({ maxValue }: Props) => {
  const data = Array.from({ length: 7 }, (_, i) =>
    Math.floor(Math.random() * maxValue)
  );

  return (
    <div className="w-full h-70">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: [1, 2, 3, 4, 5, 6, 7],
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
            data,
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