import { useSelector } from "react-redux";
import Chart from 'react-apexcharts';
import type { RootState } from "../../redux/store/store";

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

  const theme = useSelector((state: RootState) => state.theme).theme;

  const options: any = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    colors: ['#4F46E5'], // base indigo-600
    plotOptions: {
      bar: {
        borderRadius: 12,
        borderRadiusApplication: 'end',
        columnWidth: '55%',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#818CF8'], // Indigo-400 (top glow)
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.20,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.weekDays,
      labels: {
        style: {
          colors: theme === "dark" ? "#9CA3AF" : '#4B5563',
          fontSize: '11px',
          fontFamily: 'inherit',
        },
      },
      title: {
        text: 'Days',
        style: {
          color: theme === "dark" ? "#6B7280" : '#9CA3AF',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'inherit',
        },
      },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : 'rgba(0, 0, 0, 0.08)',
        height: 1,
      },
      axisTicks: {
        show: false,
        color: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : 'rgba(0, 0, 0, 0.08)',
      },
    },
    yaxis: {
      min: 0,
      max: maxValue || 1,
      labels: {
        style: {
          colors: theme === "dark" ? "#9CA3AF" : '#4B5563',
          fontSize: '11px',
          fontFamily: 'inherit',
        },
      },
      tickAmount: 3,
      title: {
        text: 'Tasks',
        style: {
          color: theme === "dark" ? "#6B7280" : '#9CA3AF',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'inherit',
        },
      },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "rgba(255, 255, 255, 0.08)" : 'rgba(0, 0, 0, 0.08)',
      },
      axisTicks: {
        show: false,
        color: '#000000',
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  const series = [
    {
      name: 'Tasks Completed',
      data: data?.taskDone,
    },
  ];

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};