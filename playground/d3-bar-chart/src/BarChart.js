import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { readJSON } from './DataProcessor';
import Dropdown from './Dropdown';

const BarChart = ({ targetAttribute }) => { //TODO: Process data, stacked bar charts for two classes
    const svgRef = useRef();
    const [data, setData] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState('');

    var w = 800;
    var h = 400;

    useEffect(() => {
        const { data, attributes } = readJSON();
        setData(data);
        setAttributes(attributes);
    }, []);

    const handleHoverEffect = (element, hoverFill, oriFill) => {
        const tooltip = d3.select("#tooltip");
        element
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(50)
                    .ease(d3.easeCubicInOut)
                    .attr("fill", hoverFill);
                tooltip.transition()
                    .duration(100)
                    .style("opacity", .9);
                tooltip.html("Frequency: " + (d[1] - d[0] === undefined ? "Missing" : d[1] - d[0]))
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(250)
                    .ease(d3.easeCubicInOut)
                    .attr("fill", d => oriFill(d));
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });
    };

    useEffect(() => {
        if (data.length === 0 || !selectedAttribute) return;

        const attributeCounts = d3.rollups(
            data,
            v => d3.count(v, d => d[targetAttribute] === '1'),
            d => d[selectedAttribute]
        );

        const svg = d3.select(svgRef.current)
            .attr('width', w)
            .attr('height', h)
            .style('background', '#f4f4f4')
            .style('margin-top', '50')
            .style('overflow', 'visible');

        const xScale = d3.scaleBand()
            .domain(attributeCounts.map(d => d[0]))
            .range([0, w])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(attributeCounts, d => d[1])])
            .range([h, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.selectAll('*').remove();

        svg.append('g')
            .call(xAxis)
            .attr('transform', 'translate(0, 400)');

        svg.append('g').call(yAxis);

        const bars = svg.selectAll('.bar')
            .data(attributeCounts)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d[0]))
            .attr('y', d => yScale(d[1]))
            .attr('width', xScale.bandwidth())
            .attr('height', d => h - yScale(d[1]))
            .attr('fill', 'teal')
            .call(handleHoverEffect, 'orange', () => 'teal');

        svg.append('text')
            .attr('class', 'x label')
            .attr('text-anchor', 'end')
            .attr('fill', '#e00070')
            .attr('x', w/2)
            .attr('y', h+40)
            .text('Attributes');

        svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'end')
            .attr('fill', '#e00070')
            .attr('x', -w/4)
            .attr('y', -h/9)
            .attr('dy', '.75em')
            .attr('transform', 'rotate(-90)')
            .text('Frequency');
    }, [data, selectedAttribute, targetAttribute]);

    return (
        <div>
            <label>Select Attribute: </label>
            <Dropdown options={attributes} selected={selectedAttribute} onChange={setSelectedAttribute} />
            <svg ref={svgRef}></svg>
            <div id="tooltip" style={{ position: 'absolute', opacity: 0, backgroundColor: 'lightgray', padding: '5px', borderRadius: '5px' }}></div>
        </div>
    );
};

export default BarChart;
