import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type GaugeType = {
  value: number;
}

const Gauge = ({ value }: GaugeType) => {
  // Use ApexOptions to fix the "string is not assignable" error
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -10,
      sparkline: {
        enabled: true // Removes extra padding/margins
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '70%',
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
        },
        dataLabels: {
          name: {
            show: true,
            color: '#116B6B', // midnightTeal from your palette
            offsetY: 20,
            fontSize: '10px'
          },
          value: {
            offsetY: -15,
            fontSize: '20px',
            color: '#102444', // navyVoid from your palette
            formatter: (val) => `${val}%`
          }
        }
      }
    },
    fill: {
      type: 'solid',
      colors: ['#74CDD1'], // tropicalAqua from your palette
    },
    stroke: {
      lineCap: 'round' // Makes the ends of the bar rounded
    },
    labels: ['Progress'],
  };

  const series: number[] = [value]; // The 40% value

  return (
    <div className="">
      <Chart
        options={chartOptions}
        series={series}
        type="radialBar"
        height={100}
      />
    </div>
  );
};

export default Gauge;
