import React from 'react';

const ModelEvaluation = ({ modelName, evaluationData }) => {
    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold">{modelName}</h2>
            <p><strong>Accuracy:</strong> {evaluationData.accuracy}</p>

            <h3 className="font-semibold">Confusion Matrix:</h3>
            <table className="table-auto border-collapse border border-gray-400 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300">Predicted Negative</th>
                        <th className="border border-gray-300">Predicted Positive</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300">{evaluationData.confusion_matrix[0][0]}</td>
                        <td className="border border-gray-300">{evaluationData.confusion_matrix[0][1]}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">{evaluationData.confusion_matrix[1][0]}</td>
                        <td className="border border-gray-300">{evaluationData.confusion_matrix[1][1]}</td>
                    </tr>
                </tbody>
            </table>

            <h3 className="font-semibold">Classification Report:</h3>
            <table className="table-auto border-collapse border border-gray-400 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300">Metric</th>
                        <th className="border border-gray-300">Class 0</th>
                        <th className="border border-gray-300">Class 1</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300">Precision</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["0"].precision}</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["1"].precision}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Recall</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["0"].recall}</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["1"].recall}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">F1 Score</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["0"]["f1-score"]}</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["1"]["f1-score"]}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Support</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["0"].support}</td>
                        <td className="border border-gray-300">{evaluationData.classification_report["1"].support}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Accuracy</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report.accuracy}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Macro Avg Precision</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["macro avg"].precision}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Macro Avg Recall</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["macro avg"].recall}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Macro Avg F1 Score</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["macro avg"]["f1-score"]}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Weighted Avg Precision</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["weighted avg"].precision}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Weighted Avg Recall</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["weighted avg"].recall}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">Weighted Avg F1 Score</td>
                        <td className="border border-gray-300" colSpan="2">{evaluationData.classification_report["weighted avg"]["f1-score"]}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ModelEvaluation;
