// import PropTypes from 'prop-types';
// import React, { useMemo, useState } from 'react';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// const containerStyle = {
//   width: '100%',
//   height: '85vh',
//   backgroundColor: '#e4e4e4',
//   overflowY: 'auto',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   userSelect: 'auto', // Allow text selection
//   pointerEvents: 'auto', // Allow pointer events
// };

// export const PDFViewer = ({ sheet }) => {
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//   });

//   // console.log('sheet', sheet);
//   const [pdfFile, setPdfFile] = useState('https://pdf-lib.js.org/assets/with_update_sections.pdf');
//   console.log('Re rENDER');
//   return (
//     <div className="container">
//       <div style={containerStyle}>
//         {sheet?.src?.preview && (
//           <>
//             <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
//               <Viewer
//                 fileUrl={sheet.src.preview}
//                 plugins={[defaultLayoutPluginInstance]}
//                 initialPage={1}
//               />
//             </Worker>
//           </>
//         )}

//         {!sheet?.src?.preview && <>No pdf file selected</>}
//       </div>
//     </div>
//   );
// };

// export default PDFViewer;

// PDFViewer.propTypes = {
//   sheet: PropTypes.object,
// };

import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';

// const containerStyle = {
//   width: '100%',
//   height: '85vh',
//   backgroundColor: '#e4e4e4',
//   overflow: 'hidden', // Hides both horizontal and vertical scroll bars
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   userSelect: 'auto', // Allow text selection
//   pointerEvents: 'auto', // Allow pointer events
// };

const PDFViewer = ({ sheet, currentSheetIndex, setCurrentSheetIndex }) => {
  const planroom = useSelector((state) => state?.planRoom?.current);
  const zoomPluginInstance = zoomPlugin();
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level
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
    width: '100%',
    maxWidth: '100%', // Ensure viewer does not exceed container width
    height: '100%',
    overflow: 'hidden', // Hide any overflow
    whiteSpace: 'nowrap', // Prevent content from wrapping
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
        height: '85vh',
        backgroundColor: '#E4E4E4',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {sheet?.src?.preview && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
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
