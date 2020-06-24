import React, {memo, useRef, useEffect} from 'react';
import {axisLeft, axisBottom} from 'd3-axis';
import {select as d3select} from 'd3-selection';
import {line as d3line, area as d3area} from 'd3-shape';
import {format as d3format} from 'd3-format';
import {scaleLog, scaleLinear} from 'd3-scale';
import {GRAY_200, GRAY_400, GRAY_500, GRAY_600, INDIGO_600} from '../constants/constants';

const width = 400;
const height = 185;

export default memo(function Chart() {
  const gRef = useRef();

  useEffect(() => {
    const yTickSpace = 20;
    const xTickSpace = 16;
    const xLabelSpace = 12;
    const xLabelPad = 10;

    const $svg = d3select(gRef.current);

    const xScale = scaleLog().domain([1, 10e3]).range([yTickSpace, width]);
    const yScale = scaleLinear()
      .domain([0, 15])
      .rangeRound([height - xTickSpace - xLabelPad - xLabelSpace, 0]);

    const $axes = $svg.append('g');

    const yAxis = axisLeft(yScale)
      .tickValues([3, 6, 9, 12, 15])
      .tickSize(-(width - yTickSpace));
    const $yAxis = $axes.append('g').attr('transform', `translate(${yTickSpace}, 0)`).call(yAxis);
    $yAxis.select('.domain').remove();

    const lastYTick = $yAxis.select('.tick:last-child');
    const lastYTickText = lastYTick.select('text');
    lastYTick
      .append('rect')
      .attr('width', 55)
      .attr('height', 16)
      .attr('fill', '#fff')
      .attr('y', -10);
    lastYTick
      .append('text')
      .text('Steps (Est.)')
      .attr('text-anchor', 'start')
      .attr('dy', lastYTickText.attr('dy'))
      .attr('x', 1);

    const xAxis = axisBottom(xScale)
      .tickValues([1, 10, 1e2, 1e3, 1e4])
      .tickFormat(d3format(',.0f'));
    $axes
      .append('g')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);

    const data = [1, 10, 1e2, 1e3, 1e4].map((x) => [xScale(x), yScale(Math.log2(x))]);

    $svg
      .append('path')
      .attr(
        'd',
        d3area()
          .y0(() => yScale(0))
          .y1((d) => d[1])(data),
      )
      .attr('stroke', 'none')
      .attr('fill', 'url(#chart-gradient)');

    $svg
      .append('path')
      .attr('d', d3line()(data))
      .attr('stroke', INDIGO_600)
      .attr('stroke-width', 2);

    $svg
      .append('text')
      .text('Number of Commits')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .classed('axis-label', true)
      .attr('y', yScale(0) + xTickSpace + xLabelPad)
      .attr('x', yTickSpace + (width - yTickSpace) / 2);
  }, []);

  return (
    <>
      <svg className="svg" ref={gRef} width={width} height={height}>
        <defs>
          <linearGradient id="chart-gradient" gradientTransform="rotate(90)">
            <stop offset="0" stopColor={INDIGO_600} stopOpacity="0.8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g ref={gRef}></g>
      </svg>
      <style jsx>{`
        .svg {
          overflow: visible;
        }
        .svg :global(.tick line) {
          stroke: ${GRAY_400};
        }
        .svg :global(.domain) {
          stroke: ${GRAY_500};
        }
        .svg :global(.tick text),
        .svg :global(.axis-label) {
          fill: ${GRAY_600};
          font-size: 10px;
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </>
  );
});
