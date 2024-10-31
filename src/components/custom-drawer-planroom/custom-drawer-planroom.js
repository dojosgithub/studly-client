import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isEmpty, truncate } from 'lodash';
import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice';
import { useResponsive } from 'src/hooks/use-responsive';
import PlanRoomNav from 'src/sections/subscriber/plan-room/plan-room-nav';
import Iconify from '../iconify';
import PdfViewer from '../lighboxcustom/PdfViewer';

// ----------------------------------------------------------------------

const CustomDrawerPlanRoom = React.memo(
  ({ open, onClose, isOnboarding = false, Component, type = 'project', setTrades, activeRow }) => {
    const dispatch = useDispatch();
    const [currentSheetIndex, setCurrentSheetIndex] = useState(null);
    const planroom = useSelector((state) => state?.planRoom?.current);
    const isMobile = useResponsive('down', 'md');
    console.log('CustomDrawerPlanRoom');
    const renderHead = (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 2.5, pl: 5 }}
      >
        <Typography fontSize="1.5rem" fontWeight="bold">
          {truncate(planroom?.planName, {
            length: isMobile ? 16 : 20,
            omission: '...',
          })}
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

        <Box sx={{ display: 'flex' }}>
          <PlanRoomNav
            currentSheetIndex={currentSheetIndex}
            setCurrentSheetIndex={(i) => setCurrentSheetIndex(i)}
          />

          {!isEmpty(planroom) && (
            <Box width={1} height={1}>
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
            </Box>
          )}
        </Box>
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
