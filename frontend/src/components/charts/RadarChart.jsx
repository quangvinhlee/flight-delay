import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function RadarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const container = d3.select(svgRef.current.parentNode);

    const w = container.node().clientWidth; // Width based on container
    const h = 600; // Reduced height
    const margin = 20; // Reduced margin
    const radius = Math.min(w, h) / 2 - margin; // Calculate radius based on new dimensions
    const duration = 100;

    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`); 

    const allCategories = data.map(d => d.attribute);
    const numCategories = allCategories.length;
    const angleSlice = (Math.PI * 2) / numCategories;

    const rScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.delayed, d.onTime, d.predictedDelayed, d.predictedOnTime))])
      .range([0, radius]);

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    const radarData = [
      { name: "Actual Delayed", values: data.map(d => ({ attribute: d.attribute, value: d.delayed })) },
      { name: "Actual On Time", values: data.map(d => ({ attribute: d.attribute, value: d.onTime })) },
      { name: "Predicted Delayed", values: data.map(d => ({ attribute: d.attribute, value: d.predictedDelayed })) },
      { name: "Predicted On Time", values: data.map(d => ({ attribute: d.attribute, value: d.predictedOnTime })) }
    ];

    radarData.forEach(dataset => {
      svg.append("path")
        .attr("class", "radarLine")
        .attr("d", radarLine(dataset.values))
        .attr("fill", "none")
        .attr("stroke", dataset.name.includes("Delayed") ? "red" : "green")
        .attr("stroke-width", 2)
        .style("stroke-dasharray", dataset.name.includes("Predicted") ? "5, 5" : "none")
        .style("opacity", 0)
        .transition()
        .delay(duration)
        .duration(duration)
        .ease(d3.easeCubicIn)
        .style("opacity", dataset.name.includes("Predicted") ? 1 : .4);
    });

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${-w / 2 + 20}, ${h / 2 - 100})`); // Position legend to bottom left

    legend.selectAll("g")
      .data([
        { name: "Actual Delayed", color: "red", stroke: "solid" },
        { name: "Predicted Delayed", color: "red", stroke: "dashed" },
        { name: "Actual On Time", color: "green", stroke: "solid" },
        { name: "Predicted On Time", color: "green", stroke: "dashed" },
      ]) // Define legend data including stroke style
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Arrange legends vertically

    legend.selectAll("g")
      .append("line") // Use line instead of circle
      .attr("x1", 0)
      .attr("y1", 5)
      .attr("x2", 15) // Adjust length of the line
      .attr("y2", 5)
      .style("stroke", d => d.color)
      .style("stroke-width", 2)
      .style("stroke-dasharray", d => d.stroke === "dashed" ? "5, 5" : "none");

    legend.selectAll("g")
      .append("text")
      .attr("x", 20) // Adjust position relative to the line
      .attr("y", 10)
      .text(d => d.name);

    const axisGrid = svg.append("g")
      .attr("class", "axisWrapper");

    axisGrid.selectAll(".levels")
      .data(d3.range(1, 6).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", d => radius / 5 * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    const axis = axisGrid.selectAll(".axis")
      .data(allCategories)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime, d.predictedDelayed, d.predictedOnTime))) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime, d.predictedDelayed, d.predictedOnTime))) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "grey")
      .style("opacity", 0.3)
      .style("stroke-width", "2px");

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime, d.predictedDelayed, d.predictedOnTime))) * 1.1 * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(d3.max(data, d => Math.max(d.delayed, d.onTime, d.predictedDelayed, d.predictedOnTime))) * 1.1 * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("border", "1px solid #d3d3d3")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    radarData.filter(dataset => dataset.name).forEach(dataset => {
      svg.selectAll(`.circle-${dataset.name.replace(' ', '-')}`)
        .data(dataset.values)
        .enter()
        .append("circle")
        .attr("class", `circle-${dataset.name.replace(' ', '-')}`)
        .attr("cx", d => rScale(d.value) * Math.cos(allCategories.indexOf(d.attribute) * angleSlice - Math.PI / 2))
        .attr("cy", d => rScale(d.value) * Math.sin(allCategories.indexOf(d.attribute) * angleSlice - Math.PI / 2))
        .attr("r", 4)
        .style("fill", dataset.name.includes("Delayed") ? "red" : "green")
        .style("opacity", 0.8)
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${dataset.name}: ${d.value}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });

  }, [data]);

  return <svg ref={svgRef}></svg>;
}
