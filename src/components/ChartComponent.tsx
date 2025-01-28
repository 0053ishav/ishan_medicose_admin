'use client';

import { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartComponent = ({ data }: { data: { total: number; inStock: number; outOfStock: number } }) => {
  const [chartType, setChartType] = useState('bar');

  const barChartData = {
    labels: ['Total Products', 'In Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Total Products',
        data: [data.total, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
      {
        label: 'In Stock',
        data: [0, data.inStock, 0],
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: '#34D399',
        borderWidth: 1,
      },
      {
        label: 'Out of Stock',
        data: [0, 0, data.outOfStock],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        borderWidth: 1,
      },
    ],
  };

  
  const doughnutChartData = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Stock Status',
        data: [data.inStock, data.outOfStock],
        backgroundColor: ['rgba(52, 211, 153, 0.2)', 'rgba(239, 68, 68, 0.2)'], // Green, Red
        borderColor: ['#34D399', '#EF4444'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={barChartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={doughnutChartData} options={options} />;
      default:
        return <Bar data={barChartData} options={options} />;
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-accent">Product Statistics</h2>
      <div className="flex items-center justify-end mb-6">
        <Select 
        value={chartType}
        onValueChange={(value) => setChartType(value)}
        >
          <SelectTrigger className='w-[180px] bg-accent'>
          <SelectValue placeholder="Select Chart Type" />
          </SelectTrigger>
          <SelectContent className='bg-accent'>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="doughnut">Doughnut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-96">{renderChart()}</div>
    </div>
  );
};

export default ChartComponent;