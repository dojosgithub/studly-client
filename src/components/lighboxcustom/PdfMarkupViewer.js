// import PropTypes from 'prop-types';
// import React, { useCallback, useState, useEffect } from 'react';
// import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import { zoomPlugin } from '@react-pdf-viewer/zoom';
// import { searchPlugin } from '@react-pdf-viewer/search';
// import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
// import { highlightPlugin, HighlightArea, MessageIcon } from '@react-pdf-viewer/highlight';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { selectionModePlugin, SelectionMode } from '@react-pdf-viewer/selection-mode';
// import './PdfViewer.css';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import '@react-pdf-viewer/zoom/lib/styles/index.css';
// import '@react-pdf-viewer/search/lib/styles/index.css';
// import '@react-pdf-viewer/full-screen/lib/styles/index.css';
// import '@react-pdf-viewer/selection-mode/lib/styles/index.css';
// import { PDFDocument, rgb } from 'pdf-lib';

// const PdfMarkupViewer = ({ fileUrl }) => {
//   const [message, setMessage] = React.useState('');
//   const [notes, setNotes] = React.useState([]);
//   console.log('notes', notes);
//   let noteId = notes.length;

//   const zoomPluginInstance = zoomPlugin();
//   const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level
//   const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
//   const searchPluginInstance = searchPlugin();
//   const fullscreenPluginInstance = fullScreenPlugin();
//   const selectionModePluginInstance = selectionModePlugin();

//   const renderHighlightTarget = (prop) => (
//     <div
//       style={{
//         background: '#eee',
//         display: 'flex',
//         position: 'absolute',
//         left: `${prop.selectionRegion.left}%`,
//         top: `${prop.selectionRegion.top + prop.selectionRegion.height}%`,
//         transform: 'translate(0, 8px)',
//         zIndex: 1,
//       }}
//     >
//       <Tooltip
//         position={Position.TopCenter}
//         target={
//           <Button onClick={prop.toggle}>
//             <MessageIcon />
//           </Button>
//         }
//         content={() => <div style={{ width: '100px' }}>Add a note</div>}
//         offset={{ left: 0, top: -8 }}
//       />
//     </div>
//   );

//   const renderHighlightContent = (prop) => {
//     const addNote = () => {
//       if (message !== '') {
//         noteId = +1;
//         const note = {
//           id: noteId,
//           content: message,
//           highlightAreas: prop.highlightAreas,
//           quote: prop.selectedText,
//         };
//         setNotes(notes.concat([note]));
//         prop.cancel();
//       }
//     };

//     return (
//       <div
//         style={{
//           background: '#fff',
//           border: '1px solid rgba(0, 0, 0, .3)',
//           borderRadius: '2px',
//           padding: '8px',
//           position: 'absolute',
//           left: `${prop.selectionRegion.left}%`,
//           top: `${prop.selectionRegion.top + prop.selectionRegion.height}%`,
//           zIndex: 1,
//         }}
//       >
//         <div>
//           <textarea
//             rows={3}
//             style={{
//               border: '1px solid rgba(0, 0, 0, .3)',
//             }}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//         </div>
//         <div
//           style={{
//             display: 'flex',
//             marginTop: '8px',
//           }}
//         >
//           <div style={{ marginRight: '8px' }}>
//             <PrimaryButton onClick={addNote}>Add</PrimaryButton>
//           </div>
//           <Button onClick={prop.cancel}>Cancel</Button>
//         </div>
//       </div>
//     );
//   };

//   const renderHighlights = (prop) => (
//     <div>
//       {notes.map((note) => (
//         <React.Fragment key={note.id}>
//           {note.highlightAreas
//             .filter((area) => area.pageIndex === prop.pageIndex)
//             .map((area, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   background: 'yellow',
//                   opacity: 0.4,
//                   ...prop.getCssProperties(area, prop.rotation),
//                 }}
//               />
//             ))}
//         </React.Fragment>
//       ))}
//     </div>
//   );

//   const highlightPluginInstance = highlightPlugin({
//     renderHighlightTarget,
//     renderHighlightContent,
//     renderHighlights,
//   });

//   const handlePreviousPage = () => {
//     // if (currentSheetIndex > 0) setCurrentSheetIndex(currentSheetIndex - 1);
//   };

//   const handleNextPage = () => {
//     // if (planroom.sheets.length - 1 > currentSheetIndex) setCurrentSheetIndex(currentSheetIndex + 1);
//   };

//   useEffect(() => {
//     const handleZoom = (event) => {
//       if (event.ctrlKey) {
//         event.preventDefault();

//         const zoomStep = event.deltaY < 0 ? 0.05 : -0.05;
//         setZoomLevel((prevZoom) => {
//           const newZoom = Math.max(0.1, Math.min(prevZoom + zoomStep, 5));
//           zoomPluginInstance.zoomTo(newZoom);
//           return newZoom;
//         });
//       }
//     };
//     window.addEventListener('wheel', handleZoom, { passive: false });

//     return () => {
//       window.removeEventListener('wheel', handleZoom);
//     };
//   }, [zoomPluginInstance]);

//   const viewerStyle = {
//     width: '100%',
//     maxWidth: '100%', // Ensure viewer does not exceed container width
//     height: '100%',
//     overflow: 'hidden', // Hide any overflow
//     whiteSpace: 'nowrap', // Prevent content from wrapping
//   };
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//     sidebarTabs: () => [],
//     renderToolbar: useCallback(
//       (Toolbar) => (
//         <Toolbar>
//           {({ FullScreen, SwitchSelectionMode, selectionMode }) => (
//             <div className="rpv-toolbar">
//               <div className="rpv-toolbar__center">
//                 <div className="btn-1">
//                   <button type="button" onClick={handlePreviousPage}>
//                     <i className="fas fa-arrow-up" />
//                   </button>
//                 </div>
//                 <div className="btn-2">
//                   <button type="button" onClick={handleNextPage}>
//                     <i className="fas fa-arrow-down" />
//                   </button>
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <searchPluginInstance.ShowSearchPopover />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <ZoomOutButton />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <ZoomPopover />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <ZoomInButton />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <fullscreenPluginInstance.EnterFullScreen />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <SwitchSelectionMode mode={SelectionMode.Hand} />
//                 </div>
//                 <div className="rpv-toolbar__item">
//                   <SwitchSelectionMode mode={SelectionMode.Text} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </Toolbar>
//       ),
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       []
//     ),
//   });

//   const download = async () => {
//     const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     const pages = pdfDoc.getPages();

//     notes.forEach((note) => {
//       const { highlightAreas, content } = note;
//       highlightAreas.forEach((area) => {
//         const page = pages[area.pageIndex];
//         page.drawText(content, {
//           x: area.width * page.getWidth(),
//           y: page.getHeight() - area.height * page.getHeight(),
//           size: 12,
//           color: rgb(1, 0, 0),
//         });
//       });
//     });

//     const pdfBytes = await pdfDoc.save();
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
//     link.download = 'annotated.pdf';
//     link.click();
//   };
//   return (
//     <div
//       style={{
//         width: '100%',
//         height: '85vh',
//         backgroundColor: '#E4E4E4',
//         overflowY: 'auto',
//         overflowX: 'hidden',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       {fileUrl && (
//         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//           <Viewer
//             fileUrl={fileUrl}
//             plugins={[
//               defaultLayoutPluginInstance,
//               zoomPluginInstance,
//               searchPluginInstance,
//               fullscreenPluginInstance,
//               selectionModePluginInstance,
//               highlightPluginInstance,
//             ]}
//             initialPage={1}
//             style={viewerStyle} // Apply viewerStyle here
//           />
//         </Worker>
//       )}
//       <button type='button' onClick={download}>Download</button>
//     </div>
//   );
// };

// export default React.memo(PdfMarkupViewer);

// PdfMarkupViewer.propTypes = {
//   fileUrl: PropTypes.string,
// };

import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { searchPlugin } from '@react-pdf-viewer/search';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

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
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import { PDFDocument, rgb } from 'pdf-lib';
import Scrollbar from '../scrollbar';

const PdfMarkupViewer = ({ fileUrl, notes }) => {
  // const fileUrl =
  // 'https://res.cloudinary.com/dojo-dev/image/upload/v1724944400/studly-dev/1724944398715.pdf';
  console.log('notes', notes);
  // let noteId = notes.length;
  const zoomPluginInstance = zoomPlugin();
  const [zoomLevel, setZoomLevel] = useState(1); // Initial zoom level
  const [hoveredNote, setHoveredNote] = useState(null);
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const searchPluginInstance = searchPlugin();
  const fullscreenPluginInstance = fullScreenPlugin();
  const selectionModePluginInstance = selectionModePlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    GoToNextPage,
    GoToPreviousPage,

    GoToNextPageButton,
  } = pageNavigationPluginInstance;
  const noteEles = new Map();

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
      // if (message !== '') {
      //   noteId = +1;
      //   const note = {
      //     id: noteId,
      //     content: message,
      //     highlightAreas: prop.highlightAreas,
      //     quote: prop.selectedText,
      //   };
      //   setNotes(notes.concat([note]));
      //   prop.cancel();
      // }
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
        {/* <div>
          <textarea
            rows={3}
            style={{
              border: '1px solid rgba(0, 0, 0, .3)',
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div> */}
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
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={idx}
                // style={Object.assign(
                //   {},
                //   {
                //     background: 'yellow',
                //     opacity: 0.4,
                //   },
                //   prop.getCssProperties(area, prop.rotation)
                // )}
                style={{
                  background: 'yellow',
                  opacity: 0.4,
                  ...prop.getCssProperties(area, prop.rotation),
                }}
                onClick={() => jumpToNote(note)}
                ref={(ref) => {
                  noteEles.set(note.id, ref);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );
  const highlightPluginInstance = highlightPlugin({
    // renderHighlightTarget,
    // renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

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
                <div className="rpv-toolbar__item">
                  <GoToNextPage />
                </div>
                <div className="rpv-toolbar__item">
                  <GoToPreviousPage />
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

                {/* <div className="rpv-toolbar__item">
                  <GoToPreviousPage />
                </div> */}
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
    // Fetch the PDF from the URL
    const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());

    // Load the PDF with PDF-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // Iterate over all notes
    notes.forEach((note) => {
      const { highlightAreas, content } = note;

      // Iterate over all highlight areas in the note
      highlightAreas.forEach((area) => {
        const page = pages[area.pageIndex];

        // Calculate the position and size for the highlight
        const x = (area.left * page.getWidth()) / 100; // Convert from percentage to actual position
        const y = page.getHeight() - (area.top * page.getHeight()) / 100;
        const width = (area.width * page.getWidth()) / 100;
        const height = (area.height * page.getHeight()) / 100;

        // Draw a rectangle for the highlight (simulated)
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: rgb(1, 1, 0), // Yellow highlight
          opacity: 0.5,
        });

        // Add text annotation (comment) on the PDF
        page.drawText(content, {
          x: x + 5, // Position text a bit inside the highlight
          y: y + height - 15, // Position text near the bottom of the highlight
          size: 12,
          color: rgb(0, 0, 0), // Black text color
          maxWidth: width - 10, // Text width
        });
      });
    });

    // Save the PDF with annotations
    const pdfBytes = await pdfDoc.save();

    // Create a link to download the annotated PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    link.download = 'annotated.pdf';
    link.click();
  };

  const jumpToNote = (note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id).scrollIntoView();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '90vh',
        backgroundColor: '#E4E4E4',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          borderRight: '1px solid rgba(0, 0, 0, 0.3)',
          width: '25%',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9', // Light background for better contrast
          padding: '16px', // Add padding to give space around content
        }}
      >
        <Scrollbar sx={{ p: 3, pt: 2, height: '85vh' }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
              There are no notes
            </div>
          ) : (
            notes.map((note) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={note.id}
                style={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  padding: '12px', // Increase padding for better readability
                  marginBottom: '8px', // Add spacing between note items
                  backgroundColor: '#fff', // White background for notes
                  borderRadius: '4px', // Rounded corners for a softer look
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                  transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                }}
                // Jump to the associated highlight area
                onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'; // Highlight on hover
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Deepen shadow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff'; // Reset background on hover out
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // Reset shadow
                }}
              >
                <blockquote
                  style={{
                    borderLeft: '4px solid rgba(0, 0, 0, 0.2)',
                    fontSize: '1rem', // Slightly larger font size for better readability
                    lineHeight: 1.6,
                    margin: '0 0 12px 0', // Increase margin below blockquote
                    paddingLeft: '12px', // Increase padding for blockquote
                    color: '#333', // Darker text for better contrast
                    fontStyle: 'italic', // Italicize quote for emphasis
                  }}
                >
                  {note.quote}
                </blockquote>
                <p style={{ margin: 0, color: '#555' }}>{note.content}</p>
              </div>
            ))
          )}
        </Scrollbar>
      </div>

      {fileUrl && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              defaultLayoutPluginInstance,
              zoomPluginInstance,
              searchPluginInstance,
              pageNavigationPluginInstance,
              fullscreenPluginInstance,
              selectionModePluginInstance,
              highlightPluginInstance,
            ]}
            initialPage={0}
            style={viewerStyle} // Apply viewerStyle here
          />
        </Worker>
      )}
      {/* <button type="button" onClick={download}>
        Download
      </button> */}
    </div>
  );
};
export default React.memo(PdfMarkupViewer);

PdfMarkupViewer.propTypes = {
  fileUrl: PropTypes.string,
  notes: PropTypes.array,
  // setNotes: PropTypes.func,
};
