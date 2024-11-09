import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({ data, attribute }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const container = d3.select(svgRef.current.parentNode);
    const w = container.node().clientWidth;
    const h = 400;
    const margin = { top: 20, right: 50, bottom: 70, left: 50 }; // Adjusted bottom margin for legend

    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h + margin.top + margin.bottom)
      .style("background", "#f9f9f9")
      .style("overflow", "visible")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, w - margin.left - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.delayed, d.onTime))])
      .range([h, 0]);

    const yPredScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.predictedDelayed, d.predictedOnTime))])
      .range([h, 0]);

    const lineDelayed = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yScale(d.delayed))
      .curve(d3.curveCardinal);

    const lineOnTime = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yScale(d.onTime))
      .curve(d3.curveCardinal);

    const linePredictedDelayed = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yPredScale(d.predictedDelayed))
      .curve(d3.curveCardinal);

    const linePredictedOnTime = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yPredScale(d.predictedOnTime))
      .curve(d3.curveCardinal);

    svg.selectAll(".lineDelayed")
      .data([data])
      .join("path")
      .attr("class", "lineDelayed")
      .attr("d", lineDelayed)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "2")
      .style("opacity", 0.4);

    svg.selectAll(".lineOnTime")
      .data([data])
      .join("path")
      .attr("class", "lineOnTime")
      .attr("d", lineOnTime)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", "2")
      .style("opacity", 0.4);

    svg.selectAll(".linePredictedDelayed")
      .data([data])
      .join("path")
      .attr("class", "linePredictedDelayed")
      .attr("d", linePredictedDelayed)
      .attr("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", "2")
      .style("stroke-dasharray", "5, 5");

    svg.selectAll(".linePredictedOnTime")
      .data([data])
      .join("path")
      .attr("class", "linePredictedOnTime")
      .attr("d", linePredictedOnTime)
      .attr("fill", "none")
      .style("stroke", "green")
      .style("stroke-width", "2")
      .style("stroke-dasharray", "5, 5");

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => data[i].attribute);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${h})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    svg.append("text")
      .attr("class", "axis-title x-axis-title")
      .attr("x", (w - margin.left - margin.right) / 2)
      .attr("y", h + 40)
      .attr("text-anchor", "middle")
      .text(attribute);

    svg.append("text")
      .attr("class", "axis-title y-axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", -40)
      .attr("dy", "0.7em")
      .attr("text-anchor", "middle")
      .text("Frequencies");

    // Define legend data
    const legendData = [
      { name: "Delayed", color: "red", dash: "" },
      { name: "On Time", color: "green", dash: "" },
      { name: "Predicted Delayed", color: "red", dash: "5, 5" },
      { name: "Predicted On Time", color: "green", dash: "5, 5" },
    ];

    // Add legend at the bottom right of the chart
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${w - margin.right -100}, ${h + margin.bottom - 480})`); // Positioned below and to the right

    legend.selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.selectAll("g")
      .append("line")
      .attr("x1", 0)
      .attr("y1", 5)
      .attr("x2", 20)
      .attr("y2", 5)
      .style("stroke", d => d.color)
      .style("stroke-width", 2)
      .style("stroke-dasharray", d => d.dash);

    legend.selectAll("g")
      .append("text")
      .attr("x", 30)
      .attr("y", 10)
      .text(d => d.name)
      .style("font-size", "12px");

  }, [data, attribute]);

  return <svg ref={svgRef} />;
}
