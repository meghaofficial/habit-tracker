import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

export const MonthlyLineChart = ({ data, maxValue }: { data: { dates: number[], tasks: number[], maxValue: number } }) => {

  const theme = useSelector((state: RootState) => state.theme).theme;

  const options = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false, 
      },
      scroller: {
        enabled: false,
      },
      animations: {
        enabled: true,
      }
    },
    colors: ['#6366F1'],
    stroke: {
      // curve: 'smooth', // Creates a smooth curved line
      width: 2, // Line thickness
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.0,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.dates,
      labels: {
        style: {
          colors: theme === "dark" ? "#fff" : '#000000',
          fontSize: '12px',
        },
      },
      title: {
        text: 'Dates',
        style: {
          color: theme === "dark" ? "#fff" : '#000000',
          fontSize: '14px',
          fontWeight: 500,
        },
      },
      axisBorder: { show: true, color: theme === "dark" ? "#fff" : '#000000' },
      axisTicks: { show: false, color: '#E5E7EB' },
    },
    yaxis: {
      max: maxValue,
      tickAmount: 3,
      labels: {
        style: {
          colors: theme === "dark" ? "#fff" : '#000000',
          fontSize: '12px',
        },
      },
      title: {
        text: 'Tasks',
        style: {
          color: theme === "dark" ? "#fff" : '#000000',
          fontSize: '14px',
          fontWeight: 500,
        },
      },
      axisBorder: { show: true, color: theme === "dark" ? "#fff" : '#000000' },
      axisTicks: { show: false, color: '#E5E7EB' },
    },
    grid: {
      show: false,
      borderColor: '#F3F4F6',
    },
  };

  const series = [
    {
      name: 'Tasks Completed',
      data: data?.tasks,
    },
  ];

  return (
    <div className="w-full">
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={350} 
      />
    </div>
  );
};