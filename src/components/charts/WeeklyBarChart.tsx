import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const WeeklyBarChart = ({
  data,
  maxValue,
}: {
  data: {
    date: string;
    week: string;
    range: string;
    weekDays: string[];
    taskDone: number[];
  };
  maxValue: number;
}) => {
  const themeMode = useSelector((state: RootState) => state.theme); // "light" or "dark"

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <div className="w-full h-70">
      <BarChart
        key={theme}
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
            label: "Tasks",
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
            stroke: `${theme === "dark" ? "white" : "black"} !important`,
          },
          "& .MuiChartsAxis-label": {
            fill: `${theme === "dark" ? "white" : "black"} !important`,
          },
          "& .MuiChartsAxis-tickLabel": {
            fill: `${theme === "dark" ? "white" : "black"} !important`,
          },
        }}
      />
    </div>
  );
};