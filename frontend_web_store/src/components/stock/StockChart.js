import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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
        position: 'top',
        },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      barThickness: 20
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      barThickness: 20
    },
  ],
};

export function StockChart({
  data
}) {
  return <Bar options={options} data={data} className='vw-25' />;
}

StockChart.defaultProps = {
  data: {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        barThickness: 20
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        barThickness: 20
      },
    ],
  }
}
