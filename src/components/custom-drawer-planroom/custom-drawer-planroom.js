import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactPinchZoomPan } from 'react-pinch-zoom-pan';
import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice';
import Iconify from '../iconify';
import SimpleSlider from '../lighboxcustom/CustomReactSwipe';
import ThumbnailsViewer from '../lighboxcustom/thumbnails';
// import useResponsive from 'src/hooks/useResponsive';

// ----------------------------------------------------------------------

const CustomDrawerPlanRoom = React.memo(
  ({ open, onClose, isOnboarding = false, Component, type = 'project', setTrades, activeRow }) => {
    const dispatch = useDispatch();
    const [currentSheetIndex, setCurrentSheetIndex] = useState(null);
    const planroom = useSelector((state) => state?.planRoom?.current);

    const renderHead = (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 2.5, pl: 5 }}
      >
        <Typography fontSize="1.5rem" fontWeight="bold">
          {planroom?.planName}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="gg:close-o" color="black" height={32} width={32} />
        </IconButton>
      </Stack>
    );

    useEffect(() => {
      if (activeRow?.planRoomId) {
        dispatch(getPlanRoomDetails(activeRow.planRoomId));
      }
    }, [dispatch, activeRow?.planRoomId]);

    useEffect(() => {
      if (planroom?.sheets && activeRow?._id) {
        const index = planroom.sheets.findIndex((sheet) => sheet._id === activeRow._id);
        if (index !== -1) {
          setCurrentSheetIndex(index);
        }
      }
    }, [planroom, activeRow]);

    if (!activeRow?.planRoomId) return null;

    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            width: '100%',
          },
        }}
      >
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Grid container spacing={2}>
          {/* ThumbnailsViewer is visible on both mobile and desktop */}
          <Grid item xs={4} sm={2}>
            <ThumbnailsViewer
              currentSheetIndex={currentSheetIndex}
              setCurrentSheetIndex={(i) => setCurrentSheetIndex(i)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto', // Allows vertical scrolling if needed
                height: '80vh', // Sets height for the thumbnails viewer
              }}
            />
          </Grid>
          {/* Main content area for zoomable images */}
          <Grid item xs={10}>
            <SimpleSlider
              currentSheetIndex={currentSheetIndex}
              setCurrentSheetIndex={(i) => setCurrentSheetIndex(i)}
            />
          </Grid>
        </Grid>
      </Drawer>
    );
  }
);

CustomDrawerPlanRoom.propTypes = {
  onClose: PropTypes.func.isRequired, // Close function is now required
  setTrades: PropTypes.func,
  open: PropTypes.bool.isRequired, // This prop is required
  Component: PropTypes.node,
  type: PropTypes.string,
  isOnboarding: PropTypes.bool,
  activeRow: PropTypes.object,
};

export default CustomDrawerPlanRoom;
