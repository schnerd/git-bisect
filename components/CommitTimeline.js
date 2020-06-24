import React, {memo, useEffect, useRef} from 'react';
import {select as d3select} from 'd3-selection';
import {curveBundle, line as d3line} from 'd3-shape';
import {transition as d3transition} from 'd3-transition';
import {easeCubicOut} from 'd3-ease';
import {
  GRAY_600,
  GRAY_700,
  GREEN_600,
  INDIGO_600,
  NUM_COMMITS,
  RED_700,
} from '../constants/constants';

const LINE_COLOR = GRAY_600;
const ACTIVE_COMMIT_COLOR = GRAY_700;

const COMMIT_LINE_Y = 80;

export default memo(function CommitTimeline(props) {
  const {activeCommit, visitedCommits = [], goodRange = [], badRange = [], width} = props;

  const [goodStart, goodEnd] = goodRange;
  const [badStart, badEnd] = badRange;

  const commitSpacing = width / (NUM_COMMITS + 1);

  const xPos = (commitNum) => Math.floor(commitNum * commitSpacing) || 0;

  const curvesRef = useRef();
  useEffect(() => {
    if (!curvesRef.current) {
      return;
    }
    const $curves = d3select(curvesRef.current);
    if (visitedCommits.length >= 2) {
      // Get last two commits visited, draw a line between them
      const [start, end] = visitedCommits.slice(-2);

      const midpointX = xPos(end) + (xPos(start) - xPos(end)) / 2;

      const estSteps = Math.ceil(Math.log2(NUM_COMMITS));
      const currentStep = visitedCommits.length - 2;
      const curveFactor = (estSteps - currentStep) / estSteps;
      const arcHeight = curveFactor * 70;

      const points = [
        [xPos(start), COMMIT_LINE_Y],
        [midpointX, COMMIT_LINE_Y - arcHeight],
        [xPos(end), COMMIT_LINE_Y],
      ];
      const path = d3line().curve(curveBundle.beta(curveFactor))(points);

      const $path = $curves
        .append('path')
        .attr('d', path)
        .attr('stroke', INDIGO_600)
        .attr('stroke-width', 2)
        .attr('fill', 'none');

      // Animate the path
      const totalLength = $path.node().getTotalLength();
      const transition = d3transition().duration(2000).ease(easeCubicOut);
      $path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition(transition)
        .attr('stroke-dashoffset', 0);
    } else {
      $curves.selectAll('*').remove();
    }
  }, [visitedCommits]);

  if (!width) {
    return null;
  }

  const commits = [];
  for (let i = 0; i < NUM_COMMITS; i++) {
    let commitNum = i + 1;
    let isActiveCommit = commitNum === activeCommit;
    let isGoodCommit = commitNum >= goodStart && commitNum <= goodEnd;
    let isBadCommit = commitNum >= badStart && commitNum <= badEnd;

    if (isActiveCommit) {
      commits.push(
        <circle
          key={`circle${i}-active`}
          cx={xPos(i + 1)}
          cy={COMMIT_LINE_Y + 1}
          r={7}
          fill="white"
          stroke={LINE_COLOR}
          strokeWidth="2"
        />,
      );
    }

    commits.push(
      <circle
        key={`circle${i}`}
        cx={xPos(i + 1)}
        cy={COMMIT_LINE_Y + 1}
        r={4}
        fill={
          isGoodCommit
            ? GREEN_600
            : isBadCommit
            ? RED_700
            : isActiveCommit
            ? ACTIVE_COMMIT_COLOR
            : LINE_COLOR
        }
      />,
    );
  }

  return (
    <>
      <svg className="commit-svg" width={String(width)} height="105">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset={String(commitSpacing / width)} stopColor="white" stopOpacity="1" />
            <stop offset={String(1 - commitSpacing / width)} stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="line-gradient-mask">
            <rect x="0" y="0" width={width} height="210" fill="url(#gradient)" />
          </mask>
        </defs>
        <g ref={curvesRef} className="arrows" fillRule="nonzero" fill="none"></g>
        <g fillRule="nonzero" fill="none">
          <rect
            key="line"
            x="0"
            y={COMMIT_LINE_Y}
            width={width}
            height={2}
            fill={LINE_COLOR}
            mask="url(#line-gradient-mask)"
          />
          {goodStart && (
            <g
              key={`commit-good-icon`}
              fill={GREEN_600}
              transform={`translate(${commitSpacing - 9}, ${COMMIT_LINE_Y - 24}) scale(0.75)`}
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </g>
          )}
          {badStart && (
            <g
              key={`commit-bad-icon`}
              fill={RED_700}
              transform={`translate(${width - commitSpacing - 9}, ${
                COMMIT_LINE_Y - 24
              }) scale(0.75)`}
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </g>
          )}
          <rect
            key="good-line"
            x={xPos(goodStart)}
            y={COMMIT_LINE_Y}
            width={xPos(goodEnd) - xPos(goodStart)}
            height={2}
            fill={GREEN_600}
          />
          <rect
            key="bad-line"
            x={xPos(badStart)}
            y={COMMIT_LINE_Y}
            width={xPos(badEnd) - xPos(badStart)}
            height={2}
            fill={RED_700}
          />
          {commits}
          <text
            x={commitSpacing}
            y={COMMIT_LINE_Y + 22}
            textAnchor="middle"
            fill={LINE_COLOR}
            className="commit-label"
          >
            v1
          </text>
          <text
            x={width - commitSpacing}
            y={COMMIT_LINE_Y + 22}
            textAnchor="middle"
            fill={LINE_COLOR}
            className="commit-label"
          >
            HEAD
          </text>
        </g>
      </svg>
      <style jsx>{`
        .commit-svg {
          max-width: 100%;
          overflow: visible;
        }
        .commit-label {
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          fill: ${GRAY_700};
        }
        :global(.commit-unknown) {
          font-size: 15px;
        }
      `}</style>
    </>
  );
});
