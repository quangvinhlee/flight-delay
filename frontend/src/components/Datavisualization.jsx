import React, { useEffect, useState, useRef } from "react";
import ShowInstruction from "./ShowInstruction";
import { instructions1 } from "./Instruction";
import Loading from "./Loading";
import ModelEvaluation from "./ModelEvaluation";

export default function DataVisualization() {
    const [evaluationData, setEvaluationData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchEvaluationData = async () => {
            if (hasFetched.current) return; // Prevent further fetches
            hasFetched.current = true;

            try {
                const response = await fetch("http://localhost:8000/evaluate");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setEvaluationData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluationData();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className="p-4">
            
            <div>
                <h1 className="text-4xl mb-4">Model Overview</h1>
            </div>
            <div className="flex flex-col space-y-6">
                {Object.keys(evaluationData).map((modelName, index) => (
                    <div key={index} className="flex flex-col lg:flex-row justify-between mb-6 w-full">
                        {index === 1 ? (
                            <>
                                {/* ModelEvaluation on the left for the second model */}
                                <div className="bg-orange-600 text-black rounded-lg p-6 flex-1 h-80 lg:h-auto flex justify-center items-center text-base overflow-hidden">
                                    <div className="overflow-y-auto w-full h-full pl-6">
                                        <h3 className="text-xl mb-4">{modelName} Overview</h3>
                                        <ModelEvaluation
                                            modelName={modelName}
                                            evaluationData={evaluationData[modelName]}
                                        />
                                    </div>
                                </div>

                                {/* ShowInstruction on the right for the second model */}
                                <div className="flex-1 ml-2 h-80 lg:h-auto overflow-hidden bg-purple-100">
                                    <ShowInstruction
                                        instructions={instructions1}
                                        evaluationData={evaluationData[modelName]}
                                        error={error}
                                        modelName={modelName}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Default layout: ShowInstruction on the left, ModelEvaluation on the right */}
                                <div className="flex-1 mr-2 h-80 lg:h-auto overflow-hidden bg-purple-100">
                                    <ShowInstruction
                                        instructions={instructions1}
                                        evaluationData={evaluationData[modelName]}
                                        error={error}
                                        modelName={modelName}
                                    />
                                </div>

                                <div className="bg-orange-600 text-black rounded-lg p-6 flex-1 h-80 lg:h-auto flex justify-center items-center text-base overflow-hidden">
                                    <div className="overflow-y-auto w-full h-full pl-6">
                                        <h3 className="text-xl mb-4">{modelName} Overview</h3>
                                        <ModelEvaluation
                                            modelName={modelName}
                                            evaluationData={evaluationData[modelName]}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
