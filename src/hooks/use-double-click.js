import { useCallback, useRef } from 'react';

// ----------------------------------------------------------------------

export function useDoubleClick({ click, doubleClick, timeout = 250 }) {
  const clickTimeout = useRef();

  const clearClickTimeout = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  };

  return useCallback(
    (event, data) => {
      clearClickTimeout();
      if (click && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          click(event, data); // Pass optional data to click handler
        }, timeout);
      }
      if (event.detail % 2 === 0) {
        doubleClick(event, data); // Pass optional data to doubleClick handler
      }
    },
    [click, doubleClick, timeout]
  );
}
