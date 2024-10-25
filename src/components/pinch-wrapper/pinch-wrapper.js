import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Higher-Order Component (HOC) that adds pinch-to-zoom functionality
const PinchWrapper = (WrappedComponent) => {
  const PinchZoomWrapper = ({ zoomTo, ...props }) => {
    const [scale, setScale] = useState(1);
    const initialDistance = useRef(0);
    const isPinching = useRef(false); // Track whether a pinch is in progress

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent default touch behavior (like scrolling)
        const distance = getDistance(e.touches);
        initialDistance.current = distance;
        zoomTo(distance);
        isPinching.current = true; // Set pinching state to true
      }
    };

    const handleTouchMove = (e) => {
      if (isPinching.current && e.touches.length === 2) {
        e.preventDefault(); // Prevent default touch behavior (like scrolling)
        const newDistance = getDistance(e.touches);
        const scaleFactor = Math.min(Math.max(newDistance / initialDistance.current, 0.5), 3); // Limit zoom range
        setScale(scaleFactor); // Update the scale state dynamically
        if (zoomTo) {
          zoomTo(scaleFactor); // Optionally call zoomTo on pinch gesture
        }
      }
    };

    const handleTouchEnd = () => {
      isPinching.current = false; // Reset pinching state
    };

    const getDistance = (touches) => {
      const [touch1, touch2] = touches;
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    return (
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 0.1s',
          width: '100%',
          height: '100%',
          overflow: 'hidden', // Prevent overflow which can lead to scrolling
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
  // Add PropTypes validation for zoomTo
  PinchZoomWrapper.propTypes = {
    zoomTo: PropTypes.func.isRequired, // Mark zoomTo as required if it always needs to be present
  };
  return PinchZoomWrapper;
};

export default PinchWrapper;
