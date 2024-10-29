import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const PinchWrapper = (WrappedComponent) => {
  const PinchZoomWrapper = ({ zoomTo, ...props }) => {
    const [scale, setScale] = useState(1);
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

    const handleTouchMove = useCallback(
      (e) => {
        if (isPinching.current && e.touches.length === 2) {
          e.preventDefault();
          requestAnimationFrame(() => {
            const newDistance = getDistance(e.touches);
            const newScale = Math.min(Math.max(newDistance / initialDistance.current, 0.5), 3);

            // Update the scale only if there's a significant change to reduce re-renders
            if (Math.abs(newScale - scale) > 0.05) {
              setScale(newScale);
              if (zoomTo) {
                zoomTo(newScale);
              }
            }
          });
        }
      },
      [scale, zoomTo]
    );

    const handleTouchEnd = () => {
      isPinching.current = false;
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
