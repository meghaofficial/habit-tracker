import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store/store';

export const FilledPieChart = ({
  done,
  left,
  height = 240,
}: {
  done: number;
  left: number;
  height?: number;
}) => {
  const theme = useSelector((state: RootState) => state.theme).theme;

  const options: any = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
    },
    labels: ['Done', 'Left'],
    colors: ['#6366f1', theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#E5E7EB'],
    stroke: {
      show: true,
      width: 5,
      colors: [theme === 'dark' ? '#FFFFFF0D' : '#FFFFFF'],
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: any) => opts.w.config.series[opts.seriesIndex],
      style: {
        colors: ['#FFFFFF'],
        fontSize: height < 180 ? '11px' : '14px',
        fontWeight: 700,
        fontFamily: 'inherit',
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false,
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'inherit',
      labels: {
        colors: theme === 'dark' ? '#D1D5DB' : '#374151',
      },
      markers: {
        size: 8,
      },
    },
    tooltip: {
      enabled: true,
      theme: theme === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (value: number) => `${value} target${value === 1 ? '' : 's'}`,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.05,
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Chart options={options} series={[done, left]} type="pie" height={height} />
    </div>
  );
};
