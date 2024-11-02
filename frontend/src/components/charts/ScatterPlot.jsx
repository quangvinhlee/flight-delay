import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ScatterPlot({ data, attributeX, attributeY }) {
  const svgRef = useRef();
  const legendRef = useRef(); // Reference for the legend

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const container = d3.select(svgRef.current.parentNode);

    const w = container.node().clientWidth - margin.left - margin.right;
    const h = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

    const preparedData = data.map((d) => {
      const x = isNumeric(d.x) ? parseFloat(d.x) : 0; 
      let y;
      if (isNumeric(d.y)) {
        y = parseFloat(d.y);
      } else {
        const counts = {};
        data.forEach((item) => {
          if (!counts[item.y]) {
            counts[item.y] = 0;
          }
          counts[item.y]++;
        });
        y = counts[d.y] || 0; 
      }
      return { ...d, x, y };
    });

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(preparedData, d => d.x)])
      .range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(preparedData, d => d.y)])
      .range([h, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("class", "axis-title x-axis-title")
      .attr("x", w / 2)
      .attr("y", h + 40)
      .attr("text-anchor", "middle")
      .text(attributeX);

    svg.append("text")
      .attr("class", "axis-title y-axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", -40)
      .attr("dy", "0.7em")
      .attr("text-anchor", "middle")
      .text(attributeY);

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
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);
      d3.selectAll(`.dot-${d.class}`)
        .transition()
        .duration(200)
        .style("fill", d => d.class === 1 ? "red" : "green")
        .attr("r", 7);
      tooltip.transition().duration(200).style("opacity", 1);
      const xAttr = isNumeric(data[0][attributeX]) ? attributeX : `${attributeX} (Frequency)`;
      const yAttr = isNumeric(data[0][attributeY]) ? attributeY : `${attributeY} (Frequency)`;

      tooltip.html(`
        ${xAttr}: ${isNumeric(d.x) ? d.x : d.y} <br/>
        ${yAttr}: ${isNumeric(d.y) ? d.y : d.x} on ${isNumeric(d.y) ? attributeX : attributeY}
      `)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("z-index", 100);
    };

    const doNotHighlight = () => {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", d => d.class === 1 ? "red" : "green")
        .attr("r", 5);
      tooltip.transition().duration(500).style("opacity", 0);
    };

    svg.selectAll("circle")
      .data(preparedData)
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

  useEffect(() => {
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove(); // Clear any existing legend items

    const legendData = [{ name: "Delayed", color: "red" }, { name: "On Time", color: "green" }];

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "5px");

    legendItems.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", d => d.color)
      .style("margin-right", "5px");

    legendItems.append("span")
      .text(d => d.name);
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      <svg ref={svgRef}></svg>
      <div ref={legendRef} className="legend" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}></div>
    </div>
  );
}
