import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({ data, attribute }) {
  const svgRef = useRef();

  useEffect(() => {
    // Remove previous chart elements
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("width", 600)
      .attr("height", 400)
      .style("background", "#f9f9f9")
      .style("margin-top", "50")
      .style("overflow", "visible");

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.attribute))
      .range([0, 600])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.delayed, d.onTime))])
      .range([400, 0]);

    const lineDelayed = d3.line()
      .x(d => xScale(d.attribute))
      .y(d => yScale(d.delayed))
      .curve(d3.curveCardinal);

    const lineOnTime = d3.line()
      .x(d => xScale(d.attribute))
      .y(d => yScale(d.onTime))
      .curve(d3.curveCardinal);

    svg.selectAll(".lineDelayed")
      .data([data])
      .join("path")
      .attr("class", "lineDelayed")
      .attr("d", lineDelayed)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "2");

    svg.selectAll(".lineOnTime")
      .data([data])
      .join("path")
      .attr("class", "lineOnTime")
      .attr("d", lineOnTime)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", "2");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(0,400)");

    svg.append("g")
      .call(yAxis);

  }, [data, attribute]);

  return <svg ref={svgRef}></svg>;
}
