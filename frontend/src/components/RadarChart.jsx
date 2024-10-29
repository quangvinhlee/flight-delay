import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function RadarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    // Clear the previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 600;
    const margin = 100;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`); // Center the chart

    const allCategories = data.map(d => d.attribute);
    const numCategories = allCategories.length;
    const angleSlice = (Math.PI * 2) / numCategories;

    const rScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.delayed, d.onTime))])
      .range([0, radius]);

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    const radarData = [
      { name: "Delayed", values: data.map(d => ({ attribute: d.attribute, value: d.delayed })) },
      { name: "On Time", values: data.map(d => ({ attribute: d.attribute, value: d.onTime })) }
    ];

    radarData.forEach(dataset => {
      svg.append("path")
        .attr("d", radarLine(dataset.values))
        .attr("fill", "none")
        .attr("stroke", dataset.name === "Delayed" ? "red" : "green")
        .attr("stroke-width", 2);
    });

    const axisGrid = svg.append("g")
      .attr("class", "axisWrapper");

    // Draw gridlines
    axisGrid.selectAll(".levels")
      .data(d3.range(1, 6).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", d => radius / 5 * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    // Draw axes
    const axis = axisGrid.selectAll(".axis")
      .data(allCategories)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime))) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime))) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "grey")
      .style("opacity", 0.3)
      .style("stroke-width", "2px");

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime))) * 1.1 * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime))) * 1.1 * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d);

  }, [data]);

  return <svg ref={svgRef}></svg>;
}
