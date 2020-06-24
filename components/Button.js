import clsx from 'clsx';
import {
  GRAY_200,
  GRAY_300,
  GRAY_400,
  GRAY_500,
  GRAY_800,
  GREEN_600,
  GREEN_700,
  GREEN_800,
  INDIGO_600,
} from '../constants/constants';

export function Button(props) {
  const {children, className, onClick, kind} = props;

  return (
    <>
      <button
        className={clsx(
          'btn',
          className,
          !kind && 'btn-default',
          kind === 'positive' && 'btn-positive',
        )}
        onClick={onClick}
      >
        {children}
      </button>
      <style jsx>{`
        .btn {
          display: inline-flex;
          justify-content: center;
          position: relative;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Montserrat', sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          line-height: 1.4;
          border-radius: 3px;
          padding: 6px 12px;
          min-height: 32px;
        }
        .btn:focus {
          outline-width: 2px;
        }

        .btn-default {
          background: ${GRAY_300};
          color: ${GRAY_800};
        }
        .btn-default:hover {
          background: ${GRAY_400};
        }
        .btn-default:active {
          background: ${GRAY_500};
        }
        .btn-default:focus {
          outline-color: ${INDIGO_600};
        }

        .btn-positive {
          background: ${GREEN_600};
          color: white;
        }
        .btn-positive:hover {
          background: ${GREEN_700};
        }
        .btn-positive:active {
          background: ${GREEN_800};
        }
        .btn-positive:focus {
          outline-color: ${GREEN_800};
        }
      `}</style>
    </>
  );
}
