import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ModelChart = ({ evaluationData }) => {
    const modelName = "Gradient Boosting";

    if (!evaluationData[modelName]) return null;

    const modelMetrics = evaluationData[modelName].classification_report;

    const labels = ['Class 0', 'Class 1'];
    const precisionData = [modelMetrics["0"].precision || 0, modelMetrics["1"].precision || 0];
    const recallData = [modelMetrics["0"].recall || 0, modelMetrics["1"].recall || 0];
    const f1ScoreData = [modelMetrics["0"]["f1-score"] || 0, modelMetrics["1"]["f1-score"] || 0];

    const data = {
        labels,
        datasets: [
            {
                label: 'Precision',
                data: precisionData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Recall',
                data: recallData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'F1 Score',
                data: f1ScoreData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Scores',
                },
            },
        },
    };

    return (
        <div>
            <h2 className="text-xl font-bold">{modelName} Metrics</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ModelChart;
