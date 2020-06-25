import React, {memo, useCallback, useRef, useState} from 'react';
import {range as d3range} from 'd3-array';
import {format} from 'd3-format';
import CommitTimeline from './CommitTimeline';

const sliderValues = [10, 20, 50, 100, 250, 500, 1e3, 2e3, 5e3, 10e3];
const numSliderValues = sliderValues.length;

let intervalId = null;

const sliderValFormat = format(',d');

const animationDuration = 1000;

export default memo(function Simulation(props) {
  const {width} = props;

  const [sliderValue, setSliderValue] = useState(null);
  const [stepsElapsed, setStepsElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [possibleCommits, setPossibleCommits] = useState(d3range(2, 10));
  const [visitedCommits, setVisitedCommits] = useState([10]);
  const [commit, setCommit] = useState(10);
  const [goodRange, setGoodRange] = useState(props.goodRange || []);
  const [badRange, setBadRange] = useState(props.badRange || []);

  function nextBisect(isCurrentGood) {
    const curCommitIndex = possibleCommits.findIndex((c) => c === commit);
    let nextCommits;
    if (isCurrentGood) {
      nextCommits = possibleCommits.slice(curCommitIndex + 1);
      setGoodRange([1, commit]);
    } else {
      nextCommits = possibleCommits.slice(0, curCommitIndex + 1);
      setBadRange([commit, sliderValue]);
    }

    setPossibleCommits(nextCommits);
    setStepsElapsed(stepsElapsed + 1);

    if (nextCommits.length <= 1) {
      const badCommit = nextCommits[0] || commit;
      setCommit(badCommit);
      setComplete(true);
      clearInterval(intervalId);
    } else {
      const nextCommitIndex = Math.floor((nextCommits.length - 1) / 2);
      const nextCommit = nextCommits[nextCommitIndex];
      setCommit(nextCommit);
      setVisitedCommits([...visitedCommits, nextCommit]);
    }
  }

  const nextBisectRef = useRef();
  nextBisectRef.current = nextBisect;

  const handleSliderChange = useCallback((evt) => {
    const index = parseInt(evt.target.value) || 0;
    const value = sliderValues[index];
    setSliderValue(value);

    const possibleCommits = d3range(2, value + 1);
    setPossibleCommits(possibleCommits);
    setVisitedCommits([value]);
    setCommit(value);
    setGoodRange([1, 1]);
    setBadRange([value, value]);
    setStepsElapsed(0);
    setComplete(false);

    setTimeout(() => nextBisectRef.current(false), 100);

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      nextBisectRef.current(Math.random() > 0.5);
    }, animationDuration);
  }, []);

  return (
    <>
      <div className="root">
        <div className="flex items-center justify-between leading-nonde">
          <div className="slider">
            <div className="text-sm text-gray-600">Number of commits</div>
            <div className="slider flex items-center leading-none mt-1">
              <input
                type="range"
                min="0"
                max={numSliderValues - 1}
                onChange={handleSliderChange}
                defaultValue="0"
                className="mr-3 my-0"
              />
              <div className="text-gray-700">
                {sliderValue ? sliderValFormat(sliderValue) : 'Change the slider'}
              </div>
            </div>
          </div>
          <div className={complete ? 'text-green-600' : 'text-gray-600'}>
            {complete
              ? `Finished in ${stepsElapsed} steps`
              : stepsElapsed
              ? `Running... on step ${stepsElapsed}`
              : ''}
          </div>
        </div>
        <div>
          <CommitTimeline
            key={sliderValue || 'null'}
            numCommits={sliderValue || 10}
            width={width}
            goodRange={goodRange}
            badRange={badRange}
            activeCommit={commit}
            visitedCommits={visitedCommits}
            animationDuration={animationDuration}
          />
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  );
});
