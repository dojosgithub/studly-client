import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'; // Import the pinch-zoom library

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
import { display } from '@mui/system';

const PDFViewer = ({ sheet, currentSheetIndex, setCurrentSheetIndex }) => {
  const planroom = useSelector((state) => state?.planRoom?.current);
  const zoomPluginInstance = zoomPlugin();
  const [zoomLevel, setZoomLevel] = useState(0.4); // Initial zoom level
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const searchPluginInstance = searchPlugin();
  const fullscreenPluginInstance = fullScreenPlugin();
  const selectionModePluginInstance = selectionModePlugin();

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
        setZoomLevel((prevZoom) => {
          const newZoom = Math.max(0.1, Math.min(prevZoom + zoomStep, 5));
          zoomPluginInstance.zoomTo(newZoom);
          return newZoom;
        });
      }
    };

    window.addEventListener('wheel', handleZoom, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleZoom);
    };
  }, [zoomPluginInstance]);

  const viewerStyle = {
    width: '100%', // Full width of the container
    height: '100%', // Full height of the container
    overflow: 'hidden', // Ensure no content overflow
    // display: 'flex', // Flexbox for centering content
    // justifyContent: 'center', // Center horizontally
    // alignItems: 'center', // Center vertically
  };
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
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        backgroundColor: '#E4E4E4',
        overflowY: 'auto',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {sheet?.src?.preview && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <TransformWrapper
            // defaultScale={zoomLevel}
            minScale={0.2}
            maxScale={5}
            pinch={{ step: 0.05 }}
            // onZoomChange={(newZoom) => {
            //   setZoomLevel(newZoom.state.scale);
            //   zoomPluginInstance.zoomTo(newZoom.state.scale);
            // }}
            wheel={{ wheelDisabled: true }}
            wrapperStyle={{
              flex: 1,
            }}
          >
            <TransformComponent contentStyle={{ width: '100%', height: '100%', flex: 1 }}>
              <Viewer
                defaultScale={zoomLevel}
                fileUrl={sheet.src.preview}
                plugins={[
                  defaultLayoutPluginInstance,
                  zoomPluginInstance,
                  searchPluginInstance,
                  fullscreenPluginInstance,
                  selectionModePluginInstance,
                ]}
                initialPage={1}
                style={viewerStyle} // Apply viewerStyle here
              />
            </TransformComponent>
          </TransformWrapper>
        </Worker>
      )}
    </div>
  );
};

export default React.memo(PDFViewer);

PDFViewer.propTypes = {
  sheet: PropTypes.object,
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
