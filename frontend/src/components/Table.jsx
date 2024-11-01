import { useState } from "react";
import Loading from "./Loading";
import LineChart from "./LineChart";
import RadarChart from "./RadarChart";
import ScatterPlot from "./Scatterplot";


export default function Table() {
  const [file, setFile] = useState(null);
  const [modelChoice, setModelChoice] = useState("random_forest");
  const [predictions, setPredictions] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(""); 
  const [airports, setAirports] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [chartType, setChartType] = useState(""); // new state for selected chart type
  const [selectedAttribute, setSelectedAttribute] = useState("DAY_OF_WEEK");
  const [selectedAttributeX, setSelectedAttributeX] = useState("DAY_OF_WEEK");
  const [selectedAttributeY, setSelectedAttributeY] = useState("SNOW");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModelChange = (e) => {
    setModelChoice(e.target.value);
  };

  const handleAirportChange = (e) => {
    setSelectedAirport(e.target.value);
  };

  const handleChartChange = (e) => {
    setChartType(e.target.value);
  };

  const handleAttributeChangeX = (e) => {
    setSelectedAttributeX(e.target.value);
  };

  const handleAttributeChangeY = (e) => {
    setSelectedAttributeY(e.target.value);
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

  // Add a new handler for attribute change
  const handleAttributeChange = (e) => {
    setSelectedAttribute(e.target.value);
  };

  const processScatterPlotData = (data) => {
    return data.map((d) => ({ x: d[selectedAttributeX], y: d[selectedAttributeY], class: d.DEP_DEL15 }));
  };

const processChartData = (data, attribute) => {
  const groupedData = data.reduce((acc, curr) => {
    const attr = curr[attribute];
    if (!acc[attr]) {
      acc[attr] = { attribute: attr, delayed: 0, onTime: 0, predictedDelayed: 0, predictedOnTime: 0 };
    }
    // Count actual delayed and on-time
    if (curr.DEP_DEL15 === 1) {
      acc[attr].delayed += 1;
    } else {
      acc[attr].onTime += 1;
    }
    // Count predicted delayed and on-time
    if (curr.PREDICTED_DEP_DEL15 === 1) {
      acc[attr].predictedDelayed += 1;
    } else {
      acc[attr].predictedOnTime += 1;
    }
    return acc;
  }, {});

  return Object.values(groupedData);
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
      {filteredPredictions.length > 0 &&(
          <div>
            <label htmlFor="chartType" className="block mb-2">
              Select Chart Type
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={handleChartChange}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="">Select Chart</option>
              <option value="line">Line Chart</option>
              <option value="radar">Radar Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
          </div>
      ) }
       {chartType && (
          <>
            {chartType === "scatter" && (
              <>
                <div>
                  <label htmlFor="attributeX" className="block mb-2">
                    Select X-Axis Attribute
                  </label>
                  <select
                    id="attributeX"
                    value={selectedAttributeX}
                    onChange={handleAttributeChangeX}
                    className="border border-gray-300 p-2 rounded"
                  >
                    <option value="CONCURRENT_FLIGHTS">Concurrent Flights</option>
                    <option value="PLANE_AGE">Plane Age</option>
                    <option value="TMAX">Temperature</option>
                    <option value="AWND">Wind Speed</option>
                    <option value="SNOW">Presence of Snow</option>
                    <option value="SNWD">Snow Depth</option>
                    <option value="PRCP">Precipitation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="attributeY" className="block mb-2">
                    Select Y-Axis Attribute
                  </label>
                  <select
                    id="attributeY"
                    value={selectedAttributeY}
                    onChange={handleAttributeChangeY}
                    className="border border-gray-300 p-2 rounded"
                  >
                    <option value="CONCURRENT_FLIGHTS">Concurrent Flights</option>
                    <option value="PLANE_AGE">Plane Age</option>
                    <option value="TMAX">Temperature</option>
                    <option value="AWND">Wind Speed</option>
                    <option value="SNOW">Presence of Snow</option>
                    <option value="SNWD">Snow Depth</option>
                    <option value="PRCP">Precipitation</option>
                  </select>
                </div>
              </>
            )}
            {chartType !== "scatter" && (
              <div>
                <label htmlFor="attribute" className="block mb-2">
                  Select Attribute
                </label>
                <select
                  id="attribute"
                  value={selectedAttribute}
                  onChange={handleAttributeChange}
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="DISTANCE_GROUP">Distance Group</option>
                  <option value="CONCURRENT_FLIGHTS">Concurrent Flights</option>
                  <option value="DEP_TIME_BLK">Departure Time Block</option>
                  <option value="PLANE_AGE">Plane Age</option>
                  <option value="TMAX">Temperature</option>
                  <option value="AWND">Wind Speed</option>
                  <option value="SNWD">Snow Depth</option>
                  <option value="PRCP">Precipitation</option>
                  <option value="DAY_OF_WEEK">Day of Week</option>
                  <option value="MONTH">Month</option>
                  <option value="SEGMENT_NUMBER">Segment Number</option>
                  <option value="SNOW">Presence of Snow</option>
                  <option value="PART_OF_DAY">Part of Day</option>
                </select>
              </div>
            )}
          </>
        )}
        {filteredPredictions.length > 0 && (
          <div style={{ overscrollX: 'scroll', height: '1600' }}>
            {chartType === "line" && (
              <LineChart data={processChartData(filteredPredictions, selectedAttribute)} attribute={selectedAttribute} />
            )}
            {chartType === "radar" && (
              <RadarChart data={processChartData(filteredPredictions, selectedAttribute)} attribute={selectedAttribute}/>
            )}
            {chartType === "scatter" && (
              <ScatterPlot data={processScatterPlotData(filteredPredictions)} attributeX={selectedAttributeX} attributeY={selectedAttributeY} />
            )}
          </div>
        )}
    </div>
  );
}
