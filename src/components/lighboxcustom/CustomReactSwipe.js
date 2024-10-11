import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactPinchZoomPan } from 'react-pinch-zoom-pan';
import PdfViewer from './PdfViewer';
// ----------------------------------------------------------------------

const SimpleSlider = ({ currentSheetIndex, setCurrentSheetIndex }) => {
  const sliderRef = useRef(null);
  const planroom = useSelector((state) => state?.planRoom?.current);

  // Use ReactPinchZoomPan to wrap the PdfViewer
  if (isEmpty(planroom)) return null;

  return (
    <div className="slider-container" key={currentSheetIndex} style={{ maxHeight: '85vh' }}>
      <ReactPinchZoomPan
        style={{
          touchAction: 'none', // Prevent default touch actions
          width: '100%', // Ensure full width
          height: '100%', // Ensure full height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        render={({ x, y, scale }) => (
          <div
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              transition: 'transform 0.2s ease-out',
              width: '100%', // Ensure full width
              height: 'auto', // Maintain aspect ratio
              maxHeight: '85vh', // Max height for the zoomable area
            }}
          >
            <PdfViewer
              sheet={planroom?.sheets[currentSheetIndex]}
              currentSheetIndex={currentSheetIndex}
              setCurrentSheetIndex={setCurrentSheetIndex}
            />
          </div>
        )}
      />
    </div>
  );
};

export default React.memo(SimpleSlider);

SimpleSlider.propTypes = {
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
