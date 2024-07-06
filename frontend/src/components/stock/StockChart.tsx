/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Loader, LoadingOverlay } from '@mantine/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export function StockChart({ data, title, isLoading }: StockChartProps) {
  const chartData = {
    labels: data.xVal,
    datasets: [
      {
        fill: true,
        label: 'Dataset 1',
        data: data.yVal,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options: any = {
    responsive: true,
    indexAxis: 'x', // This will make the chart horizontal
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 10,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        font: {
          size: 32,
          weight: 'bold',
        },
        text: title,
      },
    },
  };
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{
          children: <Loader color="rgba(97, 94, 94, 1)" size="xl" />,
        }}
      />
      <Line options={options} data={chartData} className="vw-25" />
    </Box>
  );
}

type StockChartProps = {
  data: { xVal: any[]; yVal: any[] };
  title?: string;
  isLoading?: boolean;
};

StockChart.defaultProps = {
  title: '',
  data: {
    xVal: [],
    yVal: [],
  },
  isLoading: false,
};
