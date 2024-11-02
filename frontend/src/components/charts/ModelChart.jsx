import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ModelChart = ({ evaluationData, modelName }) => {
    if (!evaluationData) return null;

    const modelMetrics = evaluationData.classification_report;

    const labels = ['Class 0 (OnTime)', 'Class 1 (Delayed)'];
    const precisionData = [modelMetrics["0"].precision || 0, modelMetrics["1"].precision || 0];
    const recallData = [modelMetrics["0"].recall || 0, modelMetrics["1"].recall || 0];
    const f1ScoreData = [modelMetrics["0"]["f1-score"] || 0, modelMetrics["1"]["f1-score"] || 0];

    const data = {
        labels,
        datasets: [
            {
                label: 'Precision',
                data: precisionData,
                backgroundColor: 'rgba(255, 206, 86, 0.8)', // Brighter yellow
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
            },
            {
                label: 'Recall',
                data: recallData,
                backgroundColor: 'rgba(54, 162, 235, 0.8)', // Bright blue
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            },
            {
                label: 'F1 Score',
                data: f1ScoreData,
                backgroundColor: 'rgba(255, 99, 132, 0.8)', // Bright red
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to take up more space
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Scores',
                    color: 'black', // Black color for y-axis title
                },
                ticks: {
                    color: 'black', // Black color for y-axis labels
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Classes',
                    color: 'black', // Black color for x-axis title
                },
                ticks: {
                    color: 'black', // Black color for x-axis labels
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'black', // Black color for legend labels
                },
            },
        },
    };

    return (
        <div className="w-100% h-60 md:h-96 lg:h-[500px] mb-10"> {/* Adjusted heights for different screen sizes */}
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">{modelName} Metrics</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ModelChart;
