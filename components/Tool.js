import React, {memo, useCallback, useState, useRef} from 'react';
import Typist from 'react-typist';
import clsx from 'clsx';
import ShapeApp from './ShapeApp';
import {GRAY_400, GRAY_700, NUM_COMMITS} from '../constants/constants';
import CommitTimeline from './CommitTimeline';
import {Button} from './Button';

const STAGES = {
  INITIAL: 0,
  AFTER_START: 1,
  AFTER_GOOD: 2,
  RUNNING: 3,
};

const typistCursor = {show: false};
let terminalId = 0;

export default memo(function Tool(props) {
  const {commit, width} = props;

  const [actionsVisible, setActionsVisible] = useState(true);
  const [stage, setStage] = useState(STAGES.INITIAL);
  const [terminalContent, setTerminalContent] = useState([]);
  const [goodRange, setGoodRange] = useState([]);
  const [badRange, setBadRange] = useState([]);

  const handleReset = useCallback(() => {
    setTerminalContent([]);
    setStage(STAGES.INITIAL);
    setActionsVisible(true);
    setGoodRange([]);
    setBadRange([]);
  }, []);

  const terminalContentRef = useRef(null);
  terminalContentRef.current = terminalContent;

  const handleStartBisectClick = useCallback(() => {
    setActionsVisible(false);
    setTerminalContent([
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalId,
        type: 'cmd',
        text: 'git bisect start',
        onComplete: () => {
          setStage(STAGES.AFTER_START);
          setActionsVisible(true);
          setTerminalContent([
            ...terminalContentRef.current.slice(0),
            {id: ++terminalId, type: 'out', text: '$ '},
          ]);
        },
      },
    ]);
  }, [terminalContent]);

  const handleSpecifyGoodCommit = useCallback(() => {
    setActionsVisible(false);
    setTerminalContent([
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalId,
        type: 'cmd',
        text: 'git bisect good v1',
        onComplete: () => {
          setStage(STAGES.AFTER_GOOD);
          setActionsVisible(true);
          setGoodRange([1, 1]);
          setTerminalContent([
            ...terminalContentRef.current.slice(0),
            {id: ++terminalId, type: 'out', text: '$ '},
          ]);
        },
      },
    ]);
  }, [terminalContent]);

  const handleSpecifyBadCommit = useCallback(() => {
    setActionsVisible(false);
    setTerminalContent([
      ...terminalContent.slice(0, -1),
      {
        id: ++terminalId,
        type: 'cmd',
        text: 'git bisect bad HEAD',
        onComplete: () => {
          setStage(STAGES.RUNNING);
          setActionsVisible(true);
          setBadRange([NUM_COMMITS, NUM_COMMITS]);
          setTerminalContent([
            ...terminalContentRef.current.slice(0),
            {id: ++terminalId, type: 'out', text: '$ '},
          ]);
        },
      },
    ]);
  }, [terminalContent]);

  return (
    <>
      <div>
        <div className="top flex items-stretch justify-center">
          <div className="top-item terminal relative flex flex-col items-stretch justify-end">
            <div className="terminal-content">
              {terminalContent.map((item) => {
                const {id, type, text, onComplete} = item;
                let content;
                if (type === 'cmd') {
                  content = (
                    <div>
                      ${' '}
                      <Typist onTypingDone={onComplete} cursor={typistCursor}>
                        {text}
                      </Typist>
                    </div>
                  );
                } else {
                  content = text;
                }
                return (
                  <div key={`row-${id}`} className="terminal-row">
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
                <Button className="btn-w-code" onClick={handleSpecifyGoodCommit}>
                  <div>Specify Good Commit</div>
                  <div className="btn-code">$ git bisect good v1</div>
                </Button>
              )}
              {stage === STAGES.AFTER_GOOD && (
                <Button className="btn-w-code" onClick={handleSpecifyBadCommit}>
                  <div>Specify Bad Commit</div>
                  <div className="btn-code">$ git bisect bad HEAD</div>
                </Button>
              )}
            </div>
            {stage !== STAGES.INITIAL && (
              <Button className="reset-btn" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
          <div className="top-item app">
            <ShapeApp commit={NUM_COMMITS} />
          </div>
        </div>
        <div className="bottom">
          <CommitTimeline
            width={width}
            goodRange={goodRange}
            badRange={badRange}
            activeCommit={NUM_COMMITS}
          />
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
        .terminal-row {
          color: ${GRAY_700};
          font-family: monospace;
          font-size: 13px;
          padding: 2px 8px;
          line-height: 1;
        }
        .terminal-row:last-child {
          margin-bottom: 4px;
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
        }
        .actions-visible {
          opacity: 1;
        }
        :global(.btn.reset-btn) {
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 12px;
          min-height: 0;
          padding: 4px 8px;
        }
        :global(.btn.btn-w-code) {
          display: inline-block;
          text-align: left;
          min-width: 140px;
        }
        :global(.btn-code) {
          font-size: 0.8em;
          opacity: 0.8;
        }
      `}</style>
    </>
  );
});
