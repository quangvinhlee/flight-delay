import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({ data, attribute }) {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    var w = 600;
    var h = 400;
    var duration = 500;
    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("background", "#f9f9f9")
      .style("margin-top", "50px")
      .style("overflow", "visible");

    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, w])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.delayed, d.onTime))])
      .range([h, 0]);

    const lineDelayed = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yScale(d.delayed))
      .curve(d3.curveCardinal);

    const lineOnTime = d3.line()
      .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
      .y(d => yScale(d.onTime))
      .curve(d3.curveCardinal);

    svg.selectAll(".lineDelayed")
      .data([data])
      .join("path")
      .attr("class", "lineDelayed")
      .attr("d", lineDelayed)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "2")
      .style("opacity", 0)
      .transition()
      .delay(duration)
      .duration(duration)
      .ease(d3.easeCubicIn)
      .style("opacity", 1);

    svg.selectAll(".lineOnTime")
      .data([data])
      .join("path")
      .attr("class", "lineOnTime")
      .attr("d", lineOnTime)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", "2")
      .style("opacity", 0)
      .transition()
      .delay(duration)
      .duration(duration)
      .ease(d3.easeCubicIn)
      .style("opacity", 1);

    svg.selectAll(".dot-delayed")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-delayed")
      .attr("cx", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.delayed))
      .attr("r", 3)
      .attr("fill", "red")
      .style("opacity", 0)
      .transition()
      .delay(duration)
      .duration(duration)
      .style("opacity", 1); 

    svg.selectAll(".dot-ontime")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-ontime")
      .attr("cx", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.onTime))
      .attr("r", 3)
      .attr("fill", "green")
      .style("opacity", 0)
      .transition()
      .delay(duration)
      .duration(duration)
      .style("opacity", 1);

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => data[i].attribute);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (h) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    // Add legends
    const legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", `translate(${w + 30}, ${30})`); // Position below the chart

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

    svg.append("text")
      .attr("class", "axis-title x-axis-title") // Add class for styling
      .attr("x", w / 2)
      .attr("y", h + 40) // Position below x-axis
      .attr("text-anchor", "middle")
      .text(attribute); // Use attribute prop for x-axis title

    svg.append("text")
      .attr("class", "axis-title y-axis-title") // Add class for styling
      .attr("transform", "rotate(-90)") // Rotate for vertical y-axis title
      .attr("x", -h/2)
      .attr("y", 5) // Position left of y-axis
      .attr("dy", "0.7em")
      .attr("text-anchor", "middle")
      .text("Frequencies"); // Set y-axis title

    const focusDelayed = svg.append('g').style("opacity", 0);
    focusDelayed.append('circle').attr("stroke", "red").attr('r', 8.5).style("fill", "none");

    const focusOnTime = svg.append('g').style("opacity", 0);
    focusOnTime.append('circle').attr("stroke", "green").attr('r', 8.5).style("fill", "none");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("border", "1px solid #d3d3d3")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg.append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('width', w)
      .attr('height', h)
      .on('mouseover', () => {
        focusDelayed.transition().duration(50).style("opacity", 1);
        focusOnTime.transition().duration(50).style("opacity", 1);
      })
      .on('mousemove', (event) => {
        const x0 = d3.pointer(event)[0];
        const i = Math.floor((x0 / xScale.bandwidth()) - .5);
        if (i >= 0 && i < data.length) {
          const selectedData = data[i];
          focusDelayed
            .attr("transform", `translate(${xScale(i) + xScale.bandwidth() / 2},${yScale(selectedData.delayed)})`);
          focusOnTime
            .attr("transform", `translate(${xScale(i) + xScale.bandwidth() / 2},${yScale(selectedData.onTime)})`);

          tooltip.transition().duration(50).style("opacity", 1);
          tooltip.html(`Delayed: ${selectedData.delayed}<br/>On Time: ${selectedData.onTime}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        }
      })
      .on('mouseout', () => {
        focusDelayed.transition().duration(50).style("opacity", 0);
        focusOnTime.transition().duration(50).style("opacity", 0);
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }, [data, attribute]);

  return <svg ref={svgRef}></svg>;
}
