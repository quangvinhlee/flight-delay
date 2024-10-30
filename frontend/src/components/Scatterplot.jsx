import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ScatterPlot({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const w = 600 - margin.left - margin.right;
    const h = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([h, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

      const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${w/2}, ${0 })`); // Position below the chart
  
    legend.selectAll("g")
    .data([ { name: "Delayed", color: "red" }, { name: "On Time", color: "green" } ]) // Define legend data
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Arrange legends vertically
  
    legend.selectAll("g")
    .append("circle")
    .attr("r", 5)
    .style("fill", d => d.color);
  
    legend.selectAll("g")
    .append("text")
    .attr("x", 10)
    .attr("y", 5)
    .text(d => d.name);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("border", "1px solid #d3d3d3")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("padding", "10px")
      .style("opacity", 0);

    const highlight = (event, d) => {
      const selectedClass = d.class;
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);
      d3.selectAll(`.dot-${selectedClass}`)
        .transition()
        .duration(200)
        .style("fill", d => d.class === 1 ? "red" : "green")
        .attr("r", 7);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Value: ${d.x} - Count: ${d.y}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("z-index", 100);
    };

    const doNotHighlight = (event) => {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", d => d.class === 1 ? "red" : "green")
        .attr("r", 5)
        .style("z-index", -1);
      tooltip.transition().duration(500).style("opacity", 0);
    };

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", d => `dot dot-${d.class}`)
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .style("fill", d => d.class === 1 ? "red" : "green")
      .on("mouseleave", doNotHighlight)
      .on("mouseover", highlight);

  }, [data]);

  return <svg ref={svgRef}></svg>;
}
