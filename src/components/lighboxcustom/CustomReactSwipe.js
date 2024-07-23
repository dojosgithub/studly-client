import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import PdfViewer from './PdfViewer';

const SimpleSlider = ({ currentSheetIndex, setCurrentSheetIndex }) => {
  const sliderRef = useRef(null);
  const settings = {
    speed: 500,
    slidesToScroll: 1,
    swipe: false, // Disable swipe gestures
    arrows: false,
    key: currentSheetIndex, // Ensure slider re-mounts when currentSheetIndex changes
  };
  const planroom = useSelector((state) => state?.planRoom?.current);


  // useEffect(() => {
  //   if (sliderRef.current && typeof currentSheetIndex === 'number') {
  //     console.log('Going to slide:', currentSheetIndex);
  //     sliderRef.current.slickGoTo(currentSheetIndex);
  //   }
  // }, [currentSheetIndex]);

  if (isEmpty(planroom)) return null;

  return (
    <div className="slider-container" key={currentSheetIndex} style={{ maxHeight: '85vh' }}>
      {/* <Slider {...settings} ref={sliderRef}>
        {planroom?.sheets?.map((sheet) => (
          <PdfViewer
            sheet={sheet}
            currentSheetIndex={currentSheetIndex}
            setCurrentSheetIndex={setCurrentSheetIndex}
          />
        ))}
      </Slider> */}
      <PdfViewer
        sheet={planroom?.sheets[currentSheetIndex]}
        currentSheetIndex={currentSheetIndex}
        setCurrentSheetIndex={setCurrentSheetIndex}
      />
    </div>
  );
};

// export default SimpleSlider;
export default React.memo(SimpleSlider);

SimpleSlider.propTypes = {
  currentSheetIndex: PropTypes.number,
  setCurrentSheetIndex: PropTypes.func,
};
