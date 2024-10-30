// WrappedViewer.js
import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Viewer } from '@react-pdf-viewer/core';
import withPinchZoom from './pinch-wrapper'; // Adjust the import based on your file structure

// const WrappedViewer = forwardRef(({ sheet, zoomLevelRef, viewerStyle, plugins, zoomTo }) => (
//   <Viewer
//     defaultScale={zoomLevelRef?.current}
//     fileUrl={sheet?.src?.preview}
//     plugins={plugins}
//     initialPage={1}
//     style={viewerStyle}
//   />
// ));
const WrappedViewer = forwardRef(({ sheet, zoomLevelRef, viewerStyle, plugins, zoomTo }) => {
  const scaleRef = useRef(0.5); // Store the current effective scale
  const scaleTempRef = useRef(0.5); // Track the scale during the pinch
  const initialDistance = useRef(0);
  const isPinching = useRef(false);
  const viewRef = useRef(null);

  const handleTouchStart = (e) => {
    console.log('handleTouchStart', e);

    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      console.log('distance', distance);
      initialDistance.current = distance;
      isPinching.current = true;
    }
  };

  // const handleTouchMove = (e) => {
  //   if (isPinching.current && e.touches.length === 2) {
  //     console.log('handleTouchMove', e.touches);
  //     e.preventDefault();
  //     const newDistance = getDistance(e.touches);
  //     // const newScale = Math.min(Math.max(newDistance / initialDistance.current, 0.5), 3); // Limit scale range
  //     // scaleTempRef.current = newScale; // Track scale during pinch, without applying

  //     const scaleFactor = newDistance / initialDistance.current;
  //     console.log('scaleFactor', scaleFactor);
  //     // Calculate new scale but ensure it stays within desired limits
  //     const newScale = Math.min(Math.max(scaleRef.current * scaleFactor, 0.3), 1.5);

  //     // Update the temporary scale ref
  //     scaleTempRef.current = newScale;

  //     // Update the scale in the component
  //     scaleRef.current = newScale; // Update current scale for rendering
  //   }
  // };
  const handleTouchMove = (e) => {
    if (isPinching.current && e.touches.length === 2) {
      e.preventDefault();

      // Calculate the new distance between the two touch points
      const newDistance = getDistance(e.touches);

      // Determine the percentage change as a relative factor
      const scaleFactor = newDistance / initialDistance.current;
      const percentageChange = (scaleFactor - 1) * 100; // Convert to percentage

      console.log(`scaleFactor: ${scaleFactor}, percentageChange: ${percentageChange}%`);

      // Define thresholds for small and large pinches
      const smallPinchThreshold = 2; // Small pinch threshold (e.g., ±2%)
      const largePinchThreshold = 10; // Large pinch threshold (e.g., ±10%)

      // Calculate adjustment based on the pinch size
      let scaleAdjustment;
      if (Math.abs(percentageChange) > largePinchThreshold) {
        // Large pinch - apply a larger zoom increment
        scaleAdjustment = scaleRef.current * (percentageChange / 50); // Exaggerate change for larger movements
      } else if (Math.abs(percentageChange) > smallPinchThreshold) {
        // Small pinch - apply a smaller zoom increment
        scaleAdjustment = scaleRef.current * (percentageChange / 200); // Smaller factor for subtle changes
      } else {
        // Ignore very tiny movements
        return;
      }

      // Calculate the new scale and clamp it within range
      const newScale = Math.min(Math.max(scaleRef.current + scaleAdjustment, 0.3), 2.0);

      // Update the scale
      scaleTempRef.current = newScale;
      scaleRef.current = newScale;
    }
  };

  const handleTouchEnd = (e) => {
    console.log('handleTouchEnd', e.touches);
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
    console.log('viewRef', viewRef);
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
  console.log('scaleRef.current', scaleRef.current);
  return (
    <div
      style={{
        // transform: `scale(${scaleRef.current})`,
        // transformOrigin: 'center',
        // transition: 'transform 0.1s', // Smooth transition when applying scale
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
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
WrappedViewer.propTypes = {
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

// export default withPinchZoom(WrappedViewer);
export default WrappedViewer;
