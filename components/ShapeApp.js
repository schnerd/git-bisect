import React, {memo} from 'react';
import {BROKEN_COMMIT, GRAY_300, GRAY_400, NUM_COMMITS} from '../constants/constants';

const star = (
  <polygon
    key="star"
    stroke="#979797"
    fill="#FFF"
    points="150 207 114.732885 225.54102 121.468305 186.27051 92.936609 158.45898 132.366442 152.72949 150 117 167.633558 152.72949 207.063391 158.45898 178.531695 186.27051 185.267115 225.54102"
  />
);
const starBg = (
  <polygon
    key="starbg"
    fill="#FF9797"
    points="150 207 114.732885 225.54102 121.468305 186.27051 92.936609 158.45898 132.366442 152.72949 150 117 167.633558 152.72949 207.063391 158.45898 178.531695 186.27051 185.267115 225.54102"
  />
);
const starRotated = (
  <polygon
    key="star"
    stroke="#979797"
    fill="#FFF"
    transform="rotate(11 150 177)"
    points="150 207 114.732885 225.54102 121.468305 186.27051 92.936609 158.45898 132.366442 152.72949 150 117 167.633558 152.72949 207.063391 158.45898 178.531695 186.27051 185.267115 225.54102"
  />
);

const otherShapes = [
  <rect
    stroke="#979797"
    transform="rotate(23 90.013 305.013)"
    x="76.013"
    y="291.013"
    width="28"
    height="28"
  />,
  <rect
    stroke="#979797"
    transform="rotate(23 32.468 190.598)"
    x="18.468"
    y="176.598"
    width="28"
    height="28"
  />,
  <rect
    stroke="#979797"
    transform="rotate(23 239.013 145.013)"
    x="225.013"
    y="131.013"
    width="28"
    height="28"
  />,
  <rect
    stroke="#979797"
    transform="rotate(-8 211.377 77.104)"
    x="197.377"
    y="63.104"
    width="28"
    height="28"
  />,
  <rect
    stroke="#979797"
    transform="rotate(-40 119.235 93.235)"
    x="100.934"
    y="74.934"
    width="36.603"
    height="36.603"
  />,
  <rect
    stroke="#979797"
    transform="rotate(16 257.549 249)"
    x="238.202"
    y="229.653"
    width="38.694"
    height="38.694"
  />,
  <rect
    stroke="#979797"
    transform="rotate(-16 51.48 93.48)"
    x="28.146"
    y="70.146"
    width="46.669"
    height="46.669"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-20 29.585 32.585)"
    points="29.5848351 18.0848351 44.0848351 47.0848351 15.0848351 47.0848351"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-165 216.035 33.865)"
    points="216.035167 19.190437 238.021426 48.5396794 194.048908 48.5396794"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(27 268.5 106.057)"
    points="268.5 91.3821148 290.486259 120.731357 246.513741 120.731357"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-113 223.013 196.013)"
    points="223.012922 181.512922 237.512922 210.512922 208.512922 210.512922"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-113 222.013 326.295)"
    points="222.012922 311.794873 236.512922 340.794873 207.512922 340.794873"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(119 90.312 200.312)"
    points="90.3116909 183.163546 107.459836 217.459836 73.1635461 217.459836"
  />,
  <polygon stroke="#979797" points="134.922254 301 151.844509 334.844509 118 334.844509" />,
  <circle stroke="#979797" cx="194" cy="123" r="17" />,
  <circle stroke="#979797" cx="194" cy="123" r="17" />,
  <circle stroke="#979797" cx="31" cy="246" r="17" />,
  <circle stroke="#979797" cx="268.5" cy="23.5" r="9.5" />,
  <circle stroke="#979797" cx="134" cy="24" r="16" />,
  <circle stroke="#979797" cx="203.5" cy="239.5" r="9.5" />,
  <circle stroke="#979797" cx="61.5" cy="332.5" r="9.5" />,
  <circle stroke="#979797" cx="186.5" cy="326.5" r="9.5" />,
  <circle stroke="#979797" cx="129.5" cy="265.5" r="20.5" />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 57.443 147.293)"
    points="57.4426277 130.368127 75.2379847 143.297211 68.4407631 164.216907 46.4444922 164.216907 39.6472707 143.297211"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 82.443 39.707)"
    points="82.4426277 22.7830926 100.237985 35.7121762 93.4407631 56.631873 71.4444922 56.631873 64.6472707 35.7121762"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 265.443 58.293)"
    points="265.442628 41.368127 283.237985 54.2972106 276.440763 75.2169074 254.444492 75.2169074 247.647271 54.2972106"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 270.31 307.282)"
    points="270.309411 290.357561 288.104768 303.286645 281.307547 324.206342 259.311276 324.206342 252.514054 303.286645"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 85.443 238.293)"
    points="85.4426277 221.368127 103.237985 234.297211 96.4407631 255.216907 74.4444922 255.216907 67.6472707 234.297211"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 186.235 279.773)"
    points="186.235115 256.48109 206.406444 268.127012 206.406444 291.418856 186.235115 303.064778 166.063786 291.418856 166.063786 268.127012"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 164.235 60.773)"
    points="164.235115 37.4810896 184.406444 49.1270118 184.406444 72.4188562 164.235115 84.0647784 144.063786 72.4188562 144.063786 49.1270118"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 272.235 196.013)"
    points="272.235115 178.114322 287.735757 187.063622 287.735757 204.962221 272.235115 213.911521 256.734474 204.962221 256.734474 187.063622"
  />,
  <polygon
    stroke="#979797"
    transform="rotate(-38 34.234 302.647)"
    points="34.2341504 284.748837 49.7347922 293.698137 49.7347922 311.596736 34.2341504 320.546036 18.7335087 311.596736 18.7335087 293.698137"
  />,
];

export default memo(function ShapeApp(props) {
  const {commit} = props;

  const renderedShapes = [];
  if (commit >= BROKEN_COMMIT) {
    renderedShapes.push(starBg, starRotated);
  } else {
    renderedShapes.push(star);
  }

  otherShapes.forEach((shape, i) => {
    if (commit > i) {
      renderedShapes.push(React.cloneElement(shape, {key: `shape${i}`}));
    }
  });

  return (
    <div className="root">
      <div className="absolute top-0 left-0 p-2 text-gray-800 text-xs leading-none bg-white rounded-tl rounded-br border-r border-b border-gray-400">
        App @ {commit === NUM_COMMITS ? 'HEAD' : `Commit ${commit}`}
      </div>
      <svg className="svg" width="301" height="354" viewBox="0 0 301 354">
        <g fillRule="nonzero" fill="none">
          {renderedShapes}
        </g>
      </svg>
      <style jsx>{`
        .root {
          width: 301px;
          max-width: 100%;
          min-width: 0;
          position: relative;
        }
        .svg {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
});
