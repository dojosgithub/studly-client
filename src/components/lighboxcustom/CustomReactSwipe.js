import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import PdfViewer from './PdfViewer';

const SimpleSlider = ({ currentSheetIndex, setCurrentSheetIndex }) => {
  const planroom = useSelector((state) => state?.planRoom?.current);

  if (isEmpty(planroom)) return null;

  return (
    <div
      className="slider-container"
      key={currentSheetIndex}
      style={{ height: '100%' }}
      // maxHeight: '85vh',
    >
      <PdfViewer
        sheet={planroom?.sheets[currentSheetIndex]}
        currentSheetIndex={currentSheetIndex}
        setCurrentSheetIndex={setCurrentSheetIndex}
      />
    </div>
  );
};

export default React.memo(SimpleSlider);

SimpleSlider.propTypes = {
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
