import React from 'react';

const ModelEvaluation = ({ modelName, evaluationData }) => {
    const roundToThreeDecimals = (num) => {
        return num !== undefined ? num.toFixed(3) : '-'; // Check for undefined and round
    };

    return (
        <div className="mb-10">
            <h2 className="text-2xl md:text-xl font-bold">{modelName}</h2>
            <p className="text-sm md:text-base">
                <strong>Accuracy:</strong> {roundToThreeDecimals(evaluationData.accuracy)}
            </p>

            <h3 className="font-semibold text-lg md:text-base">Confusion Matrix:</h3>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400 mb-4 text-xs md:text-sm w-full max-w-4xl mx-auto">
                    <thead>
                        <tr>
                            <th className="border border-stone-900">Predicted Negative</th>
                            <th className="border border-stone-900">Predicted Positive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-stone-900">{evaluationData.confusion_matrix[0][0]}</td>
                            <td className="border border-stone-900">{evaluationData.confusion_matrix[0][1]}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">{evaluationData.confusion_matrix[1][0]}</td>
                            <td className="border border-stone-900">{evaluationData.confusion_matrix[1][1]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="font-semibold text-lg md:text-base">Classification Report:</h3>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-stone-900 mb-4 text-xs md:text-sm w-full max-w-4xl mx-auto">
                    <thead>
                        <tr>
                            <th className="border border-stone-900">Metric</th>
                            <th className="border border-stone-900">Class 0</th>
                            <th className="border border-stone-900">Class 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-stone-900">Precision</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["0"].precision)}</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["1"].precision)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Recall</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["0"].recall)}</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["1"].recall)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">F1 Score</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["0"]["f1-score"])}</td>
                            <td className="border border-stone-900">{roundToThreeDecimals(evaluationData.classification_report["1"]["f1-score"])}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Support</td>
                            <td className="border border-stone-900">{evaluationData.classification_report["0"].support}</td>
                            <td className="border border-stone-900">{evaluationData.classification_report["1"].support}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Accuracy</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report.accuracy)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Macro Avg Precision</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["macro avg"].precision)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Macro Avg Recall</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["macro avg"].recall)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Macro Avg F1 Score</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["macro avg"]["f1-score"])}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Weighted Avg Precision</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["weighted avg"].precision)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Weighted Avg Recall</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["weighted avg"].recall)}</td>
                        </tr>
                        <tr>
                            <td className="border border-stone-900">Weighted Avg F1 Score</td>
                            <td className="border border-stone-900" colSpan="2">{roundToThreeDecimals(evaluationData.classification_report["weighted avg"]["f1-score"])}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModelEvaluation;