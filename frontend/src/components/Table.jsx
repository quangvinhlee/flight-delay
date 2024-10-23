import { useState } from "react";
import Loading from "./Loading";

export default function Table() {
  const [file, setFile] = useState(null);
  const [modelChoice, setModelChoice] = useState("random_forest");
  const [predictions, setPredictions] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(""); 
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 

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
    setIsLoading(true);

    try {
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        setPredictions(data); 
        const uniqueAirports = [
            ...new Set(data.map((pred) => pred.CARRIER_NAME)),
        ];
        setAirports(uniqueAirports); 
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const getTimeBlock = (timeBlock) => {
    const [startTime, endTime] = timeBlock.split("-").map((time) => {
      const hours = parseInt(time.slice(0, 2), 10);
      const minutes = parseInt(time.slice(2), 10);
      return hours * 100 + minutes;
    });

    if (
      (startTime >= 1 && endTime <= 559) ||
      (startTime >= 2000 && endTime <= 2359)
    ) {
      return "Early Morning & Late Night"; 
    } else if (startTime >= 600 && endTime <= 1159) {
      return "Morning"; 
    } else if (startTime >= 1200 && endTime <= 1659) {
      return "Afternoon"; 
    } else if (startTime >= 1700 && endTime <= 1959) {
      return "Evening"; 
    }

    return "Unknown";
  };

  const filteredPredictions = selectedAirport
    ? predictions.filter((pred) => pred.CARRIER_NAME === selectedAirport)
    : predictions;

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center w-full">
        <h1 className="ml-4 text-2xl">Welcome, User</h1>
      </div>
      <div className="flex-grow p-6 w-full">
        <div className="flex justify-between mb-6 w-full">
          <div className="bg-purple-700 text-white rounded-lg p-6 flex-grow flex justify-center items-center mr-4 text-lg">
            About Section
          </div>
          <div className="bg-blue-500 text-white rounded-lg p-6 flex-grow flex flex-col justify-center items-center text-lg">
            <h3 className="mb-4">Input Section for Files</h3>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
                <div className="-mt-9">
                  <label
                    htmlFor="modelChoice"
                    className="block mb-2 text-lg text-black"
                  >
                    Choose Model:
                  </label>
                  <select
                    id="modelChoice"
                    value={modelChoice}
                    onChange={handleModelChange}
                    className="border border-gray-300 p-2 rounded ml-2 text-black"
                  >
                    <option value="random_forest">Random Forest</option>
                    <option value="log_reg">Logistic Regression</option>
                    <option value="gradient_boosting">Gradient Boosting</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end -mb-3">
                <button className="bg-green-600 text-white p-3 rounded-lg">
                  Predict
                </button>
              </div>
            </form>
          </div>
        </div>

        
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {airports.length > 0 && (
              <div className="flex">
                <div className="mb-5">
                  <label htmlFor="airport" className="block mb-2">
                    Select Carrier Name
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
              </div>
            )}

            {filteredPredictions.length > 0 ? (
              <div className="overflow-auto bg-green-500 rounded-lg" style={{ maxHeight: "800px" }}>
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">No</th>
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
                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 p-2 text-center">{getTimeBlock(pred.DEP_TIME_BLK)}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.DAY_OF_WEEK}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.MONTH}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.CARRIER_NAME}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.PREVIOUS_AIRPORT}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.DEPARTING_AIRPORT}</td>
                        <td className="border border-gray-300 p-2 text-center">{pred.PREDICTED_DEP_DEL15 === 1 ? "Delayed" : "On Time"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-auto bg-green-500 rounded-lg" style={{ maxHeight: "800px" }}>
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">No</th>
                      <th className="border border-gray-300 p-2">Time Block</th>
                      <th className="border border-gray-300 p-2">Day</th>
                      <th className="border border-gray-300 p-2">Month</th>
                      <th className="border border-gray-300 p-2">Carrier Name</th>
                      <th className="border border-gray-300 p-2">Previous Airport</th>
                      <th className="border border-gray-300 p-2">Departing Airport</th>
                      <th className="border border-gray-300 p-2">Predicted Delay</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-xl flex items-center justify-center h-full mb-5 mt-5">
                  No predictions available. Please upload a file to make predictions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}