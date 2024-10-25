// WrappedViewer.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Viewer } from '@react-pdf-viewer/core';
import withPinchZoom from './pinch-wrapper'; // Adjust the import based on your file structure

const WrappedViewer = forwardRef(({ sheet, zoomLevelRef, viewerStyle, plugins }) => (
  <Viewer
    defaultScale={zoomLevelRef?.current}
    fileUrl={sheet?.src?.preview}
    plugins={plugins}
    initialPage={1}
    style={viewerStyle}
  />
));

// PropTypes validation
WrappedViewer.propTypes = {
  sheet: PropTypes.shape({
    src: PropTypes.shape({
      preview: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  zoomLevelRef: PropTypes.object.isRequired, // updated type
  viewerStyle: PropTypes.object, // You might want to specify more specific prop types for styles
  plugins: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of plugin objects
};

export default withPinchZoom(WrappedViewer);
