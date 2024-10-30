import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const PinchWrapper = (WrappedComponent) => {
  const PinchZoomWrapper = ({ zoomTo, ...props }) => {
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
        initialDistance.current = distance;
        isPinching.current = true;
      }
    };

    const handleTouchMove = (e) => {
      console.log('handleTouchMove', e);

      if (isPinching.current && e.touches.length === 2) {
        e.preventDefault();
        const newDistance = getDistance(e.touches);
        // const newScale = Math.min(Math.max(newDistance / initialDistance.current, 0.5), 3); // Limit scale range
        // scaleTempRef.current = newScale; // Track scale during pinch, without applying

        const scaleFactor = newDistance / initialDistance.current;
        console.log('scaleFactor', scaleFactor);
        // Calculate new scale but ensure it stays within desired limits
        const newScale = Math.min(Math.max(scaleRef.current * scaleFactor, 0.3), 1.5);

        // Update the temporary scale ref
        scaleTempRef.current = newScale;

        // Update the scale in the component
        scaleRef.current = newScale; // Update current scale for rendering
      }
    };

    const handleTouchEnd = (e) => {
      console.log('handleTouchEnd', e);
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

    useEffect(() => {
      console.log('viewRef', viewRef);
      // Adding event listeners to document
      viewRef.addEventListener('touchstart', handleTouchStart);
      viewRef.addEventListener('touchmove', handleTouchMove);
      viewRef.addEventListener('touchend', handleTouchEnd);

      // Cleanup function to remove event listeners when the component unmounts
      return () => {
        viewRef.removeEventListener('touchstart', handleTouchStart);
        viewRef.removeEventListener('touchmove', handleTouchMove);
        viewRef.removeEventListener('touchend', handleTouchEnd);
      };
      // eslint-disable-next-line
    }, [viewRef]);

    return (
      <div
        style={{
          transform: `scale(${scaleRef.current})`,
          transformOrigin: 'center',
          transition: 'transform 0.1s', // Smooth transition when applying scale
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        ref={viewRef}
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
