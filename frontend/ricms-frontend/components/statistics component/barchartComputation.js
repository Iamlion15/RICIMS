import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const BarchartAnalytics = ({data}) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        const documentSent = data.map(item => item.documentsSent);
        const documentApproved=data.map(item => item.documentsApproved);
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Document sent',
                        data: documentSent,
                        backgroundColor: 'rgb(255, 160, 180)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Document Approved',
                        data: documentApproved,
                        backgroundColor: 'rgb(130, 205, 255)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            chart.destroy();
        };
    }, [data]);

    return (
        <>
            <div style={{ width: '100%', margin: 'auto' }}>
            <canvas ref={chartRef}  height="172"></canvas>
        </div>
        </>
    );
};

export default BarchartAnalytics;
