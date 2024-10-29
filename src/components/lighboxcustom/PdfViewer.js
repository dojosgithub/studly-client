import { useGesture } from '@use-gesture/react';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Viewer, Worker } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { searchPlugin } from '@react-pdf-viewer/search';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode';
import './PdfViewer.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/selection-mode/lib/styles/index.css';
import WrappedViewer from '../pinch-wrapper/wrapped-viewer';

const PDFViewer = ({ sheet, currentSheetIndex, setCurrentSheetIndex }) => {
  const planroom = useSelector((state) => state?.planRoom?.current);
  const zoomPluginInstance = zoomPlugin();
  const zoomLevelRef = useRef(0.5);
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const searchPluginInstance = searchPlugin();
  const fullscreenPluginInstance = fullScreenPlugin();
  const selectionModePluginInstance = selectionModePlugin();
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  const imageRef = useRef();
  useGesture(
    {
      // onDrag: ({ offset: [dx, dy] }) => {
      //   setCrop((c) => ({ ...c, x: dx, y: dy }));
      // },
      onPinch: ({ offset: [d] }) => {
        // setCrop((c) => ({ ...c, scale: 1 + d / 50 }));
        setCrop((c) => ({ ...c, scale: Math.max(0.5, Math.min(2, 1 + d / 100)) }));
      },
    },
    {
      target: imageRef,
      pinch: { scaleBounds: { min: 0.5, max: 2 } },
      eventOptions: { passive: false },
    }
  );

  const handlePreviousPage = () => {
    if (currentSheetIndex > 0) setCurrentSheetIndex(currentSheetIndex - 1);
  };

  const handleNextPage = () => {
    if (planroom.sheets.length - 1 > currentSheetIndex) setCurrentSheetIndex(currentSheetIndex + 1);
  };

  useEffect(() => {
    const handleZoom = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();

        const zoomStep = event.deltaY < 0 ? 0.05 : -0.05;

        const newZoom = Math.max(0.1, Math.min(zoomLevelRef.current + zoomStep, 5));
        zoomPluginInstance.zoomTo(newZoom);
        zoomLevelRef.current = newZoom;
      }
    };

    window.addEventListener('wheel', handleZoom, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleZoom);
    };
  }, [zoomPluginInstance]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: useCallback(
      (Toolbar) => (
        <Toolbar>
          {({ FullScreen, SwitchSelectionMode, selectionMode }) => (
            <div className="rpv-toolbar">
              <div className="rpv-toolbar__center">
                <div className="btn-1">
                  <button type="button" onClick={handlePreviousPage}>
                    <i className="fas fa-arrow-up" />
                  </button>
                </div>
                <div className="btn-2">
                  <button type="button" onClick={handleNextPage}>
                    <i className="fas fa-arrow-down" />
                  </button>
                </div>
                <div className="rpv-toolbar__item">
                  <searchPluginInstance.ShowSearchPopover />
                </div>
                <div className="rpv-toolbar__item">
                  <ZoomOutButton />
                </div>
                <div className="rpv-toolbar__item">
                  <ZoomPopover />
                </div>
                <div className="rpv-toolbar__item">
                  <ZoomInButton />
                </div>
                <div className="rpv-toolbar__item">
                  <fullscreenPluginInstance.EnterFullScreen />
                </div>
                <div className="rpv-toolbar__item">
                  <SwitchSelectionMode mode={SelectionMode.Hand} />
                </div>
                <div className="rpv-toolbar__item">
                  <SwitchSelectionMode mode={SelectionMode.Text} />
                </div>
              </div>
            </div>
          )}
        </Toolbar>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
  });

  return (
    <Box sx={{ position: 'relative', p: 4, overflow: 'hidden' }}>
      <Box sx={{ overflow: 'hidden' }}>
        <div
          ref={imageRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#E4E4E4',
            overflow: 'hidden',
            touchAction: 'none', // Prevents page-wide zoom/pan gestures
            transform: `scale(${crop.scale}) translate(${crop.x}px, ${crop.y}px)`,
            transformOrigin: 'center center',
          }}
        >
          {sheet?.src?.preview && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {/* <Box sx={{ overflow: 'auto' }}> */}
              <Viewer
                defaultScale={zoomLevelRef?.current}
                fileUrl={sheet.src.preview}
                plugins={[
                  defaultLayoutPluginInstance,
                  zoomPluginInstance,
                  searchPluginInstance,
                  fullscreenPluginInstance,
                  selectionModePluginInstance,
                ]}
                initialPage={1}
                // ref={imageRef}
                // style={{
                //   left: crop.x,
                //   top: crop.y,
                //   transform: `scale(${crop.scale})`,
                //   touchAction: 'none',
                //   position: 'relative',
                //   width: 'auto',
                //   height: '100%',
                //   maxWidth: 'none',
                //   maxHeight: 'none',
                // }}
              />
              {/* </Box> */}
            </Worker>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default React.memo(PDFViewer);

PDFViewer.propTypes = {
  sheet: PropTypes.object,
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
