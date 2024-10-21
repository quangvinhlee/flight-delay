import React, { useState, useEffect } from "react";
import Loading from "./Loading";

export default function PredictionTable() {
  const [file, setFile] = useState(null);
  const [modelChoice, setModelChoice] = useState("random_forest");
  const [predictions, setPredictions] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(""); // Default is an empty string for "All"
  const [airports, setAirports] = useState([]); // To hold the available airports
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModelChange = (e) => {
    setModelChoice(e.target.value);
  };

  const handleAirportChange = (e) => {
    setSelectedAirport(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("choice", modelChoice);
    formData.append("sample_size", 3000);
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPredictions(data);

      // Extract unique departing airports from the predictions
      const uniqueAirports = [
        ...new Set(data.map((pred) => pred.CARRIER_NAME)),
      ];
      setAirports(uniqueAirports); // Store unique airports for selection
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // End the loading state
    }
  };

  const getTimeBlock = (timeBlock) => {
    const [startTime, endTime] = timeBlock.split("-").map((time) => {
      const hours = parseInt(time.slice(0, 2), 10);
      const minutes = parseInt(time.slice(2), 10);
      return hours * 100 + minutes; // Convert to total minutes as HHMM
    });

    // Updated conditions to handle Early Morning & Late Night
    if (
      (startTime >= 1 && endTime <= 559) ||
      (startTime >= 2000 && endTime <= 2359)
    ) {
      return "Early Morning & Late Night"; // 0001-0559 and 2000-2359
    } else if (startTime >= 600 && endTime <= 1159) {
      return "Morning"; // 0600-1159
    } else if (startTime >= 1200 && endTime <= 1659) {
      return "Afternoon"; // 1200-1659
    } else if (startTime >= 1700 && endTime <= 1959) {
      return "Evening"; // 1700-1959
    }

    return "Unknown";
  };

  const filteredPredictions = selectedAirport
    ? predictions.filter((pred) => pred.CARRIER_NAME === selectedAirport)
    : predictions; // Show all predictions if no airport is selected

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          required
          className="border border-gray-300 p-2 rounded"
        />
        <select
          value={modelChoice}
          onChange={handleModelChange}
          className="border border-gray-300 p-2 rounded ml-2"
        >
          <option value="random_forest">Random Forest</option>
          <option value="log_reg">Logistic Regression</option>
          <option value="gradient_boosting">Gradient Boosting</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Predict
        </button>
      </form>

      {isLoading && (
        <Loading />
      )}

      {airports.length > 0 && (
        <div className="mb-4">
          <label htmlFor="airport" className="block mb-2">
            Select Carrier Name :
          </label>
          <select
            value={selectedAirport}
            onChange={handleAirportChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">-- All Carrier --</option>
            {airports.map((airport, index) => (
              <option key={index} value={airport}>
                {airport}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredPredictions.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">No</th> {/* Added No Column */}
              <th className="border border-gray-300 p-2">Time Block</th>
              <th className="border border-gray-300 p-2">Day</th>
              <th className="border border-gray-300 p-2">Month</th>
              <th className="border border-gray-300 p-2">Carrier Name</th>
              <th className="border border-gray-300 p-2">Previous Airport</th>
              <th className="border border-gray-300 p-2">Departing Airport</th>
              <th className="border border-gray-300 p-2">Predicted Delay</th>
            </tr>
          </thead>
          <tbody>
            {filteredPredictions.map((pred, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td> {/* Display row number */}
                <td className="border border-gray-300 p-2 text-center">
                  {getTimeBlock(pred.DEP_TIME_BLK)}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.DAY_OF_WEEK}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.MONTH}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.CARRIER_NAME}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.PREVIOUS_AIRPORT}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.DEPARTING_AIRPORT}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {pred.PREDICTED_DEP_DEL15 === 1 ? "Delayed" : "OnTime"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
