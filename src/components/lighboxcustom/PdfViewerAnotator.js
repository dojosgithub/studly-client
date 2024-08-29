import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { searchPlugin } from '@react-pdf-viewer/search';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { highlightPlugin, HighlightArea, MessageIcon } from '@react-pdf-viewer/highlight';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode';
import './PdfViewer.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/selection-mode/lib/styles/index.css';
import { PDFDocument, rgb } from 'pdf-lib';

const PDFViewerAnotator = ({ fileUrl }) => {
  const [message, setMessage] = React.useState('');
  const [notes, setNotes] = React.useState([]);
  console.log('notes', notes);
  let noteId = notes.length;

  const zoomPluginInstance = zoomPlugin();
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const searchPluginInstance = searchPlugin();
  const fullscreenPluginInstance = fullScreenPlugin();
  const selectionModePluginInstance = selectionModePlugin();

  const renderHighlightTarget = (prop) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${prop.selectionRegion.left}%`,
        top: `${prop.selectionRegion.top + prop.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={prop.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (prop) => {
    const addNote = () => {
      if (message !== '') {
        noteId = +1;
        const note = {
          id: noteId,
          content: message,
          highlightAreas: prop.highlightAreas,
          quote: prop.selectedText,
        };
        setNotes(notes.concat([note]));
        prop.cancel();
      }
    };

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0, 0, 0, .3)',
          borderRadius: '2px',
          padding: '8px',
          position: 'absolute',
          left: `${prop.selectionRegion.left}%`,
          top: `${prop.selectionRegion.top + prop.selectionRegion.height}%`,
          zIndex: 1,
        }}
      >
        <div>
          <textarea
            rows={3}
            style={{
              border: '1px solid rgba(0, 0, 0, .3)',
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '8px',
          }}
        >
          <div style={{ marginRight: '8px' }}>
            <PrimaryButton onClick={addNote}>Add</PrimaryButton>
          </div>
          <Button onClick={prop.cancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const renderHighlights = (prop) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === prop.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={{
                  background: 'yellow',
                  opacity: 0.4,
                  ...prop.getCssProperties(area, prop.rotation),
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const handlePreviousPage = () => {
    // if (currentSheetIndex > 0) setCurrentSheetIndex(currentSheetIndex - 1);
  };

  const handleNextPage = () => {
    // if (planroom.sheets.length - 1 > currentSheetIndex) setCurrentSheetIndex(currentSheetIndex + 1);
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

  const download = async () => {
    const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();

    notes.forEach((note) => {
      const { highlightAreas, content } = note;
      highlightAreas.forEach((area) => {
        const page = pages[area.pageIndex];
        page.drawText(content, {
          x: area.width * page.getWidth(),
          y: page.getHeight() - area.height * page.getHeight(),
          size: 12,
          color: rgb(1, 0, 0),
        });
      });
    });

    const pdfBytes = await pdfDoc.save();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    link.download = 'annotated.pdf';
    link.click();
  };
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
      {fileUrl && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              defaultLayoutPluginInstance,
              zoomPluginInstance,
              searchPluginInstance,
              fullscreenPluginInstance,
              selectionModePluginInstance,
              highlightPluginInstance,
            ]}
            initialPage={1}
            style={viewerStyle} // Apply viewerStyle here
          />
        </Worker>
      )}
      <button type='button' onClick={download}>Download</button>
    </div>
  );
};

export default React.memo(PDFViewerAnotator);

PDFViewerAnotator.propTypes = {
  fileUrl: PropTypes.string,
};
