import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', 600)
            .attr('height', 400)
            .style('background', '#f4f4f4')
            .style('margin-top', '50')
            .style('overflow', 'visible');
        
        const xScale = d3.scaleBand()
            .domain(data.map((value, index) => index))
            .range([0, 600])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([400, 0]);

        const xAxis = d3.axisBottom(xScale).ticks(data.length);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        svg.append('g')
            .call(xAxis)
            .attr('transform', 'translate(0, 400)');
        svg.append('g').call(yAxis);

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (value, index) => xScale(index))
            .attr('y', yScale)
            .attr('width', xScale.bandwidth())
            .attr('height', value => 400 - yScale(value))
            .attr('fill', 'teal');
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default BarChart;
