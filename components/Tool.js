import React, {memo, useCallback, useState} from 'react';
import ShapeApp from './ShapeApp';
import {GRAY_700, NUM_COMMITS} from '../constants/constants';
import CommitTimeline from './CommitTimeline';
import {Button} from './Button';

const STAGES = {
  INITIAL: 0,
  AFTER_START: 1,
  AFTER_GOOD: 2,
  RUNNING: 3,
};

export default memo(function Tool(props) {
  const {commit, width} = props;

  const [stage, setStage] = useState(STAGES.INITIAL);
  const [terminalContent, setTerminalContent] = useState([]);

  const handleReset = useCallback(() => {
    setTerminalContent([]);
    setStage(STAGES.INITIAL);
  });

  return (
    <>
      <div>
        <div className="top flex items-stretch justify-center">
          <div className="terminal relative flex flex-col items-stretch justify-end">
            <div className="terminal-content"></div>
            <div className="actions">
              {stage === STAGES.INITIAL && (
                <Button className="btn-w-code">
                  <div>Start Bisect</div>
                  <div className="btn-code">$ git bisect start</div>
                </Button>
              )}
            </div>
          </div>
          <div className="app">
            <ShapeApp commit={NUM_COMMITS} />
          </div>
        </div>
        <div className="bottom">
          <CommitTimeline
            width={width}
            goodRange={[1, 1]}
            badRange={[NUM_COMMITS, NUM_COMMITS]}
            activeCommit={NUM_COMMITS}
          />
        </div>
      </div>
      <style jsx>{`
        .terminal {
          width: 300px;
          max-width: 100%;
        }
        .actions {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          justify-content: center;
        }
        :global(.btn-w-code) {
          display: inline-block !important;
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
