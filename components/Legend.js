import React, {memo} from 'react';

export default memo(function Legend() {
  return (
    <>
      <div className="flex items-center justify-center text-xs text-gray-600 leading-none -mt-2 mb-4">
        Commits Over Time →
      </div>
      <div className="flex items-center justify-center text-xs text-gray-600">
        <div className="legend-item flex items-center mr-5">
          <div className="rounded-full bg-green-600 p-1 mr-2"></div>
          <div className="">Known Good Commit</div>
        </div>
        <div className="legend-item flex items-center mr-5">
          <div className="rounded-full bg-red-700 p-1 mr-2"></div>
          <div className="">Known Bad Commit</div>
        </div>
        <div className="legend-item flex items-center">
          <div className="rounded-full p-1 border-2 border-gray-600 mr-2"></div>
          <div className="">Active Commit</div>
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  );
});
