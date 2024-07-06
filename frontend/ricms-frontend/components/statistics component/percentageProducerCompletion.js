import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PercentageProducerDoghnutCompletion = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous instance if exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const chartData = {
      labels: ['RICA Approved', 'RSB Approved', 'RAB Approved'],
      datasets: [{
        data: [data.rica, data.rsb, data.rab],
        backgroundColor: ['#62C1C1', '#92C348', '#EC6362',],
        hoverBackgroundColor: ['#62C1C1', '#92C348', '#EC6362',],
        borderWidth: 0,
        hoverBorderWidth: 2,
      }],
    };

    const noData = {
      labels: ['No Available Data'],
      datasets: [{
        data: [100],
        backgroundColor: ['#E6E6E6'],
        hoverBackgroundColor: ['#E6E6E6'],
        borderWidth: 0,
        hoverBorderWidth: 2,
      }],
    };

    const options = {
      responsive: true,
      cutout: '80%',
      rotation: -0.5 * Math.PI,
      circumference: 360,
      title: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    };

    const chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: data.dataPresent ? chartData : noData,
      options: options,
    });

    // Store the chart instance on the ref for cleanup
    chartRef.current.chart = chartInstance;

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <p className="font-gt-america" style={{ margin: 0, fontWeight: "bold", fontSize: "1.5em" }}>Sent</p>
        <p style={{ fontWeight: "bold", fontSize: "1.9em", margin: 0 }}>{data.dataPresent ? <span style={{ fontSize: "0.7em" }}>Documents</span> : "No Data"}</p>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PercentageProducerDoghnutCompletion;
