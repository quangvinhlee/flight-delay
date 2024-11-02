import React, { useState } from "react";
import Loading from "../utils/Loading";
import ModelChart from "../charts/ModelChart";

export default function ShowInstruction({
  instructions,
  evaluationData,
  error,
  modelName,
}) {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="relative transition-all duration-300 ease-in-out h-full bg-stone-400 p-6 rounded-lg flex flex-col justify-center items-center">
      <div
        className="absolute top-2 right-2 text-black cursor-pointer text-xl font-bold z-20"
        onClick={toggleInstructions}
      >
        <button className="text-3xl">{!showInstructions ? "+" : "x"}</button>
      </div>

      {showInstructions && (
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-90 rounded-lg z-10 p-4 w-full h-full transition-all duration-300 ease-in-out overflow-auto">
          <div className="flex flex-col h-full w-full max-w-[100%]">
            <p className="mb-2 text-base text-center">
              Instructions for interacting with this data visual:
            </p>
            <ul className="list-disc text-left text-sm overflow-y-auto flex-1 px-4">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!showInstructions && (
        <div className="flex flex-col items-center h-full w-full">
          {error && <p className="text-red-500">{error}</p>}
          {evaluationData ? (
            <div className="flex-grow transition-all duration-300 ease-in-out flex justify-center items-center">
              <ModelChart
                evaluationData={evaluationData}
                modelName={modelName}
              />
            </div>
          ) : (
            <Loading />
          )}
        </div>
      )}
    </div>
  );
}
