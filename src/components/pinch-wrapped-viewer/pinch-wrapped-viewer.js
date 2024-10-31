import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Viewer } from '@react-pdf-viewer/core';

const PinchWrappedViewer = forwardRef(({ sheet, zoomLevelRef, viewerStyle, plugins, zoomTo }) => {
  const scaleRef = useRef(0.5); // Store the current effective scale
  const scaleTempRef = useRef(0.5); // Track the scale during the pinch
  const initialDistance = useRef(0);
  const isPinching = useRef(false);
  const viewRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      console.log('distance', distance);
      initialDistance.current = distance;
      isPinching.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (isPinching.current && e.touches.length === 2) {
      e.preventDefault();

      // Calculate the new distance between the two touch points
      const newDistance = getDistance(e.touches);

      // Determine the scale factor from the distance change
      const scaleFactor = newDistance / initialDistance.current;
      const percentageChange = (scaleFactor - 1) * 100; // Convert to percentage

      console.log(`scaleFactor: ${scaleFactor}, percentageChange: ${percentageChange}%`);

      // Set thresholds for fine-tuning sensitivity
      const adjustmentFactor = 0.005; // Adjust this to control scale increment speed
      let scaleAdjustment;

      if (Math.abs(percentageChange) > 10) {
        // Larger pinch - larger change
        scaleAdjustment = percentageChange > 0 ? adjustmentFactor * 2 : -adjustmentFactor * 2;
      } else if (Math.abs(percentageChange) > 2) {
        // Small pinch - smaller change
        scaleAdjustment = percentageChange > 0 ? adjustmentFactor : -adjustmentFactor;
      } else {
        // Ignore very tiny movements
        return;
      }

      // Gradually adjust the scale, clamping between min and max
      const newScale = Math.min(Math.max(scaleRef.current + scaleAdjustment, 0.3), 2.0);

      // Update the scale references for smooth, gradual scaling
      scaleTempRef.current = newScale;
      scaleRef.current = newScale;
    }
  };

  const handleTouchEnd = (e) => {
    isPinching.current = false;

    // Apply the final scale only at the end of the pinch gesture
    scaleRef.current = scaleTempRef.current;
    if (zoomTo) {
      // zoomTo(scaleRef.current); // Trigger zoomTo only on pinch end
      zoomTo(scaleRef.current); // Trigger zoomTo only on pinch end
    }
  };

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    let viewRefValue;
    if (!isEmpty(viewRef.current)) {
      // Adding event listeners to document
      viewRefValue = viewRef.current;
      viewRef.current.addEventListener('touchstart', handleTouchStart);
      viewRef.current.addEventListener('touchmove', handleTouchMove);
      viewRef.current.addEventListener('touchend', handleTouchEnd);
    }

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      if (!isEmpty(viewRefValue)) {
        viewRefValue.removeEventListener('touchstart', handleTouchStart);
        viewRefValue.removeEventListener('touchmove', handleTouchMove);
        viewRefValue.removeEventListener('touchend', handleTouchEnd);
      }
    };
    // eslint-disable-next-line
  }, [viewRef]);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      ref={viewRef}
    >
      <Viewer
        defaultScale={scaleRef?.current}
        fileUrl={sheet?.src?.preview}
        plugins={plugins}
        initialPage={1}
        style={viewerStyle}
      />
    </div>
  );
});

// PropTypes validation
PinchWrappedViewer.propTypes = {
  sheet: PropTypes.shape({
    src: PropTypes.shape({
      preview: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  zoomLevelRef: PropTypes.object.isRequired, // updated type
  viewerStyle: PropTypes.object, // You might want to specify more specific prop types for styles
  plugins: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of plugin objects
  zoomTo: PropTypes.func, // Array of plugin objects
};

export default PinchWrappedViewer;
