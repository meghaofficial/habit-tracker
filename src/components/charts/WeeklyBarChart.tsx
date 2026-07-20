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
    colors: ['#6366F1'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        columnWidth: '70%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.weekDays,
      labels: {
        style: {
          colors: theme === "dark" ? "#fff" : '#000000',
          fontSize: '12px',
        },
      },
      title: {
        text: 'Days',
        style: {
          color: theme === "dark" ? "#fff" : '#000000',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'inherit',
        },
      },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "#fff" : '#000000',
        height: 1,
      },
      axisTicks: {
        show: false,
        color: theme === "dark" ? "#fff" : '#000000',
      },
    },
    yaxis: {
      min: 0,
      max: maxValue,
      labels: {
        style: {
          colors: theme === "dark" ? "#fff" : '#000000',
          fontSize: '12px',
        },
      },
      tickAmount: 3,
      title: {
        text: 'Tasks',
        style: {
          color: theme === "dark" ? "#fff" : '#000000',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'inherit',
        },
      },
      axisBorder: {
        show: true,
        color: theme === "dark" ? "#fff" : '#000000',
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