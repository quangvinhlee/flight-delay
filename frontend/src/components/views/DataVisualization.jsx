import React from "react";
import LineChart from "../charts/LineChart"; // Adjust import paths as needed
import RadarChart from "../charts/RadarChart";
import ScatterPlot from "../charts/ScatterPlot";

const DataVisualization = ({
  filteredPredictionsData,
  chartType,
  handleChartChange,
  selectedAttribute,
  handleAttributeChange,
  selectedAttributeX,
  handleAttributeChangeX,
  selectedAttributeY,
  handleAttributeChangeY,
  processChartData,
  processScatterPlotData,
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {filteredPredictionsData.length > 0 && (
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl mb-4 pt-5">Data Visualization</h1>
          <label htmlFor="chartType" className="block text-lg font-semibold mb-2 mt-5">
            Select Chart Type
          </label>
          <select
            id="chartType"
            value={chartType}
            onChange={handleChartChange}
            className="border border-gray-300 p-2 rounded mb-4 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="radar">Radar Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
      )}

      {chartType && (
        <div className="flex flex-col items-center">
          {chartType === "scatter" ? (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center">
                <label htmlFor="attributeX" className="mb-1 text-lg font-semibold">
                  Select X-Axis Attribute
                </label>
                <select
                  id="attributeX"
                  value={selectedAttributeX}
                  onChange={handleAttributeChangeX}
                  className="border border-gray-300 p-2 rounded mb-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex flex-col items-center">
                <label htmlFor="attributeY" className="mb-1 text-lg font-semibold">
                  Select Y-Axis Attribute
                </label>
                <select
                  id="attributeY"
                  value={selectedAttributeY}
                  onChange={handleAttributeChangeY}
                  className="border border-gray-300 p-2 rounded mb-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
          ) : (
            <div className="flex flex-col items-center mb-4">
              <label htmlFor="attribute" className="block mb-2 text-lg font-semibold">
                Select Attribute
              </label>
              <select
                id="attribute"
                value={selectedAttribute}
                onChange={handleAttributeChange}
                className="border border-gray-300 p-2 rounded mb-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>
      )}

      {filteredPredictionsData.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full max-w-5xl"> {/* Adjust width as needed */}
            {chartType === "line" && (
              <LineChart
                data={processChartData(filteredPredictionsData, selectedAttribute)}
                attribute={selectedAttribute}
              />
            )}
            {chartType === "radar" && (
              <RadarChart
                data={processChartData(filteredPredictionsData, selectedAttribute)}
                attribute={selectedAttribute}
              />
            )}
            {chartType === "scatter" && (
              <ScatterPlot
                data={processScatterPlotData(filteredPredictionsData)}
                attributeX={selectedAttributeX}
                attributeY={selectedAttributeY}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;
