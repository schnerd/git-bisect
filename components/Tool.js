import React, {memo, useCallback, useRef, useState} from 'react';
import {range as d3range} from 'd3-array';
import Typist from 'react-typist';
import clsx from 'clsx';
import ShapeApp from './ShapeApp';
import {GRAY_400, GRAY_700, NUM_COMMITS} from '../constants/constants';
import CommitTimeline from './CommitTimeline';
import {Button} from './Button';
import Legend from './Legend';

const STAGES = {
  INITIAL: 0,
  AFTER_START: 1,
  AFTER_GOOD: 2,
  RUNNING: 3,
  COMPLETE: 4,
};

const typistCursorConfig = {show: false};

let terminalRowId = 0;

const createTerminalCursorRow = () => ({
  id: ++terminalRowId,
  type: 'out',
  text: '$ ',
});

export default memo(function Tool(props) {
  const {showTerminal = true, showLegend = false, width} = props;

  const [possibleCommits, setPossibleCommits] = useState(d3range(2, NUM_COMMITS + 1));
  const [visitedCommits, setVisitedCommits] = useState([NUM_COMMITS]);
  const [commit, setCommit] = useState(NUM_COMMITS);
  const [actionsVisible, setActionsVisible] = useState(true);
  const [stage, setStage] = useState(STAGES.INITIAL);
  const [terminalContent, setTerminalContent] = useState([createTerminalCursorRow()]);
  const [goodRange, setGoodRange] = useState(props.goodRange || []);
  const [badRange, setBadRange] = useState(props.badRange || []);

  const handleReset = useCallback(() => {
    setCommit(NUM_COMMITS);
    setVisitedCommits([NUM_COMMITS]);
    setPossibleCommits(d3range(2, NUM_COMMITS + 1));
    setTerminalContent([createTerminalCursorRow()]);
    setStage(STAGES.INITIAL);
    setActionsVisible(true);
    setGoodRange([]);
    setBadRange([]);
  }, []);

  const terminalContentRef = useRef(null);
  terminalContentRef.current = terminalContent;

  function nextBisect(isCurrentGood) {
    const curCommitIndex = possibleCommits.findIndex((c) => c === commit);
    let nextCommits;
    if (isCurrentGood) {
      nextCommits = possibleCommits.slice(curCommitIndex + 1);
      setGoodRange([1, commit]);
    } else {
      nextCommits = possibleCommits.slice(0, curCommitIndex + 1);
      setBadRange([commit, NUM_COMMITS]);
    }
    setPossibleCommits(nextCommits);
    if (nextCommits.length <= 1) {
      const badCommit = nextCommits[0] || commit;

      setCommit(badCommit);
      setTerminalContent([
        ...terminalContentRef.current.slice(0, -1),
        {
          id: ++terminalRowId,
          type: 'out',
          text: [
            `${badCommit} is the first bad commit`,
            `Author: Daffy Duck`,
            `Date: Sun Jun 21 17:08:28 2020 -0700`,
          ].join('\n'),
        },
        {
          id: ++terminalRowId,
          type: 'out',
          className: 'text-green-600 terminal-row-final',
          text: `Congratulations, you successfully used git bisect! Read on below.`,
        },
      ]);
      setStage(STAGES.COMPLETE);
    } else {
      const nextCommitIndex = Math.floor((nextCommits.length - 1) / 2);
      const nextCommit = nextCommits[nextCommitIndex];
      const numRemainingCommits = nextCommits.length;
      setCommit(nextCommit);
      setVisitedCommits([...visitedCommits, nextCommit]);
      setTerminalContent([
        ...terminalContentRef.current,
        {
          id: ++terminalRowId,
          type: 'out',
          text: [
            `Bisecting: roughly more ${Math.floor(Math.log2(numRemainingCommits))} step(s)`,
            `Viewing commit ${nextCommit}`,
          ].join('\n'),
        },
        createTerminalCursorRow(),
      ]);
    }
  }

  const handleStartBisectClick = useCallback(() => {
    setActionsVisible(false);
    setTerminalContent([
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalRowId,
        type: 'cmd',
        text: 'git bisect start',
        onTypingDone: () => {
          setStage(STAGES.AFTER_START);
          setActionsVisible(true);
          setTerminalContent([...terminalContentRef.current.slice(0), createTerminalCursorRow()]);
        },
      },
    ]);
  }, [terminalContent]);

  const handleSpecifyKnownGoodCommit = useCallback(() => {
    setActionsVisible(false);
    setTerminalContent([
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalRowId,
        type: 'cmd',
        text: 'git bisect good v1',
        onTypingDone: () => {
          setStage(STAGES.AFTER_GOOD);
          setActionsVisible(true);
          setGoodRange([1, 1]);
          setTerminalContent([...terminalContentRef.current.slice(0), createTerminalCursorRow()]);
        },
      },
    ]);
  }, [terminalContent]);

  const handleSpecifyKnownBadCommit = useCallback(() => {
    setActionsVisible(false);
    terminalContentRef.current = [
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalRowId,
        type: 'cmd',
        text: 'git bisect bad HEAD',
        onTypingDone: () => {
          setStage(STAGES.RUNNING);
          setActionsVisible(true);
          setBadRange([NUM_COMMITS, NUM_COMMITS]);
          nextBisect(false);
        },
      },
    ];
    setTerminalContent(terminalContentRef.current);
  }, [terminalContent, nextBisect]);

  const handleBisectGood = useCallback(() => {
    setActionsVisible(false);
    terminalContentRef.current = [
      ...terminalContentRef.current.slice(0, -1),
      {
        id: ++terminalRowId,
        type: 'cmd',
        text: 'git bisect good',
        onTypingDone: () => {
          nextBisect(true);
          setActionsVisible(true);
        },
      },
    ];
    setTerminalContent(terminalContentRef.current);
  }, [nextBisect]);

  const handleBisectBad = useCallback(() => {
    setActionsVisible(false);
    terminalContentRef.current = [
      ...terminalContentRef.current.slice(0, -1),
      {
        id: ++terminalRowId,
        type: 'cmd',
        text: 'git bisect bad',
        onTypingDone: () => {
          nextBisect(false);
          setActionsVisible(true);
        },
      },
    ];
    setTerminalContent(terminalContentRef.current);
  }, [nextBisect]);

  return (
    <>
      <div>
        <div className="top flex items-stretch justify-center">
          {showTerminal && (
            <div className="top-item terminal relative flex flex-col items-stretch justify-end">
              <div className="terminal-content">
                {terminalContent.map((item) => {
                  const {id, type, text, className, onTypingDone} = item;
                  let content;
                  if (type === 'cmd') {
                    content = (
                      <div>
                        ${' '}
                        <Typist onTypingDone={onTypingDone} cursor={typistCursorConfig}>
                          {text}
                        </Typist>
                      </div>
                    );
                  } else {
                    content = text;
                  }
                  return (
                    <div key={`row-${id}`} className={`terminal-row ${className || ''}`}>
                      {content}
                    </div>
                  );
                })}
              </div>
              <div className={clsx('actions', actionsVisible && 'actions-visible')}>
                {stage === STAGES.INITIAL && (
                  <Button className="btn-w-code" onClick={handleStartBisectClick}>
                    <div>Start Bisect</div>
                    <div className="btn-code">$ git bisect start</div>
                  </Button>
                )}
                {stage === STAGES.AFTER_START && (
                  <Button className="btn-w-code" onClick={handleSpecifyKnownGoodCommit}>
                    <div>Specify Good Commit</div>
                    <div className="btn-code">$ git bisect good v1</div>
                  </Button>
                )}
                {stage === STAGES.AFTER_GOOD && (
                  <Button className="btn-w-code" onClick={handleSpecifyKnownBadCommit}>
                    <div>Specify Bad Commit</div>
                    <div className="btn-code">$ git bisect bad HEAD</div>
                  </Button>
                )}
                {stage === STAGES.RUNNING && (
                  <div className="flex flex-row items-center justify-center">
                    <Button className="btn-w-code mr-2" kind="positive" onClick={handleBisectGood}>
                      <div>Looks Good</div>
                      <div className="btn-code">$ git bisect good</div>
                    </Button>
                    <Button className="btn-w-code" kind="negative" onClick={handleBisectBad}>
                      <div>Looks Bad</div>
                      <div className="btn-code">$ git bisect bad</div>
                    </Button>
                  </div>
                )}
              </div>
              {stage !== STAGES.INITIAL && (
                <Button className="reset-btn" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
          )}
          <div className="top-item app">
            <ShapeApp commit={commit} />
          </div>
        </div>
        <div className="bottom">
          <CommitTimeline
            width={width}
            goodRange={goodRange}
            badRange={badRange}
            activeCommit={commit}
            visitedCommits={visitedCommits}
          />
          {showLegend && <Legend />}
        </div>
      </div>
      <style jsx>{`
        .top-item {
          border: 1px solid ${GRAY_400};
        }
        .top-item:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        .top-item:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .top-item + .top-item {
          border-left: none;
        }
        .terminal {
          width: 300px;
          min-width: 150px;
        }
        .terminal-content {
          font-family: monospace;
          font-size: 13px;
          color: ${GRAY_700};
        }
        .terminal-row {
          padding: 2px 8px;
          line-height: 1;
          white-space: pre-line;
        }
        .terminal-row:last-child {
          margin-bottom: 4px;
        }
        :global(.terminal-row-final) {
          margin-top: 10px;
        }
        :global(.Typist) {
          display: inline;
        }
        .actions {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .actions-visible {
          opacity: 1;
          pointer-events: all;
        }
        :global(.btn.reset-btn.btn-default) {
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 12px;
          min-height: 0;
          padding: 4px 8px;
        }
        :global(.btn.btn-w-code) {
          display: inline-block !important;
          text-align: left !important;
          min-width: 130px !important;
        }
        :global(.btn-code) {
          font-size: 0.8em;
          opacity: 0.8;
        }
      `}</style>
    </>
  );
});
