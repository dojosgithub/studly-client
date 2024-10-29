import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const PinchWrapper = (WrappedComponent) => {
  const PinchZoomWrapper = ({ zoomTo, ...props }) => {
    const scaleRef = useRef(1); // Store the current effective scale
    const scaleTempRef = useRef(1); // Track the scale during the pinch
    const initialDistance = useRef(0);
    const isPinching = useRef(false);

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = getDistance(e.touches);
        initialDistance.current = distance;
        isPinching.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (isPinching.current && e.touches.length === 2) {
        e.preventDefault();
        const newDistance = getDistance(e.touches);
        const newScale = Math.min(Math.max(newDistance / initialDistance.current, 0.5), 3); // Limit scale range
        scaleTempRef.current = newScale; // Track scale during pinch, without applying
      }
    };

    const handleTouchEnd = () => {
      isPinching.current = false;

      // Apply the final scale only at the end of the pinch gesture
      scaleRef.current = scaleTempRef.current;
      if (zoomTo) {
        zoomTo(scaleRef.current); // Trigger zoomTo only on pinch end
      }
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
          transform: `scale(${scaleRef.current})`,
          transformOrigin: 'center',
          transition: 'transform 0.2s', // Smooth transition when applying scale
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  PinchZoomWrapper.propTypes = {
    zoomTo: PropTypes.func.isRequired,
  };

  return PinchZoomWrapper;
};

export default PinchWrapper;
