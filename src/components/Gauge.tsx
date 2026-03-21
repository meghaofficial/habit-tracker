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
      offsetY: 0,
      sparkline: {
        enabled: true // Removes extra padding/margins
      }
    },
    plotOptions: {
      radialBar: {
        // startAngle: -135,
        // endAngle: 135,
        hollow: {
          size: '40%',
        },
        track: {
          background: "#F3F3F3",
          strokeWidth: '97%',
        },
        dataLabels: {
          name: {
            show: false,
            color: '#116B6B', // midnightTeal from your palette
            offsetY: 0,
            fontSize: '10px'
          },
          value: {
            show: false,
            offsetY: 20,
            fontSize: '10px',
            color: '#102444', // navyVoid from your palette
            formatter: (val) => `${val}%`
          }
        }
      }
    },
    fill: {
      type: 'solid',
      colors: ['#A8DF8E'], 
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
        height={110}
      />
    </div>
  );
};

export default Gauge;
