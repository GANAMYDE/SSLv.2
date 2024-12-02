import React from 'react';
import { Line } from 'react-chartjs-2';

const FinancialChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.currency),
    datasets: [
      {
        label: 'Exchange Rates',
        data: data.map((item) => item.rate),
        borderColor: '#4caf50',
        borderWidth: 2,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default FinancialChart;
