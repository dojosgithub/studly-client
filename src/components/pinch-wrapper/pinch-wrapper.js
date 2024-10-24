import React, { useState, useRef } from 'react';

// Higher-Order Component (HOC) that adds pinch-to-zoom functionality
const PinchWrapper = (WrappedComponent) => {
  // The HOC returns a new component
  const PinchZoomWrapper = (props) => {
    const [scale, setScale] = useState(1);
    const initialDistance = useRef(0);

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const distance = getDistance(e.touches);
        initialDistance.current = distance;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const newDistance = getDistance(e.touches);
        const scaleFactor = newDistance / initialDistance.current;
        setScale(scaleFactor); // Update the scale state dynamically
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
          transform: `scale(${scale})`,
          transition: 'transform 0.1s',
          touchAction: 'none',
          width: '100%',
          height: '100%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  return PinchZoomWrapper;
};

export default PinchWrapper;
