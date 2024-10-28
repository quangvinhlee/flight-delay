import React, { useState } from "react";
import Loading from "./Loading";
import ModelChart from "./ModelChart"; // Import ModelChart directly

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
    <div
      className={`relative transition-all duration-300 ease-in-out h-full bg-purple-600 p-6 rounded-lg flex flex-col justify-center items-center`}
    >
      <div
        className="absolute top-2 right-2 text-black cursor-pointer text-xl font-bold z-20"
        onClick={toggleInstructions}
      >
        <button>{!showInstructions ? "+" : "x"}</button>
      </div>

      {showInstructions ? (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center rounded-lg z-10 p-4 overflow-auto">
          <p className="mb-2 text-base text-center">
            Instructions for interacting with this data visual:
          </p>
          <ul className="list-disc text-left text-sm overflow-y-auto max-h-[100%] w-full px-4">
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center h-full w-full">
          {error && <p className="text-red-500">{error}</p>}
          {evaluationData ? (
            <div
              className={`flex-grow transition-all duration-300 ease-in-out flex justify-center items-center`}
            >
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
