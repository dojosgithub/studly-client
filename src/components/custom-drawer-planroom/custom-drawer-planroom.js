import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';

import React, { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
// // import { ProjectView } from 'src/sections/project/view';

// theme
import { paper } from 'src/theme/css';

import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice'; //
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
import Logo from '../logo';
import SimpleSlider from '../lighboxcustom/CustomReactSwipe';
import ThumbnailsViewer from '../lighboxcustom/thumbnails';

//
// import { useSettingsContext } from './context';

// ----------------------------------------------------------------------

// export default function CustomDrawerPlanRoom({
const CustomDrawerPlanRoom = React.memo(
  ({ open, onClose, isOnboarding = false, Component, type = 'project', setTrades, activeRow }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [currentSheetIndex, setCurrentSheetIndex] = useState(null);
    const planroom = useSelector((state) => state?.planRoom?.current);
    const renderHead = (
      <Stack
        direction="row"
        // // alignItems="flex-start"
        // // justifyContent={((type === "template") || (type === "workflow")) ? "flex-end" : "space-between"}
        // sx={{ py: 2, pr: 2.5, pl: 5 }}
        // alignItems={((type === "template") || (type === "workflow")) ? "center" : "flex-start"}
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 2.5, pl: 5 }}
      >
        <>
          <Typography fontSize="1.5rem" fontWeight="bold">
            {planroom?.planName}
          </Typography>
          {/* <Logo /> */}
          <IconButton onClick={onClose}>
            <Iconify icon="gg:close-o" color="black" height={32} width={32} />
          </IconButton>
        </>
        {/* {((type === "template") || (type === "workflow")) ?
                (
                    <>
                        <Typography fontSize='1.5rem' fontWeight='bold'>Create New {type}</Typography>
                        <IconButton onClick={onClose} >
                            <Iconify icon="gg:close-o" color="black" height={32} width={32} />
                        </IconButton>
                    </>
                )
                : (<CustomBreadcrumbs
                    heading="Create Project"
                    links={[
                        {
                            name: 'Dashboard',
                            // href: paths.subscriber.root
                        },
                        { name: 'Projects', href: paths.subscriber.submittals.list },
                        { name: 'Create' },
                    ]}

                    action={
                        <IconButton onClick={onClose} >
                            <Iconify icon="gg:close-o" color="black" height={32} width={32} />
                        </IconButton>
                    }
                    sx={{
                        mb: { xs: 3, md: 5 },
                        mt: { xs: 3, md: 5 },
                        flexGrow: 1
                    }}
                />)} */}
      </Stack>
    );

    useEffect(() => {
      if (activeRow?.planRoomId) dispatch(getPlanRoomDetails(activeRow.planRoomId));
    }, [dispatch, activeRow?.planRoomId]);

    // useEffect(() => {
    //   const index = planroom?.sheets?.findIndex((sheet) => sheet._id === activeRow?._id);
    //   console.log(index);
    //   if (index !== -1) setCurrentSheetIndex(index);
    // }, [activeRow?._id, planroom]);

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
            // ...paper({ theme, bgcolor: theme.palette.background.default }),
            // width: `calc(100% - ${280}px)`,
            // 'background': 'white',
            // ...isOnboarding && {
            //     width: '100%',
            // }
            width: '100%',
          },
          // height:"100vh"
        }}
      >
        {/* <Box sx={{maxHeight:"80vh"}}> */}
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <ProjectView /> */}
        {/* <Component type={type} onClose={onClose} open={open} setTrades={setTrades}/> */}

        <Grid container spacing={2}>
          <Grid item xs={2}>
            <ThumbnailsViewer
              currentSheetIndex={currentSheetIndex}
              setCurrentSheetIndex={(i) => setCurrentSheetIndex(i)}
            />
          </Grid>
          <Grid item xs={10}>
            <SimpleSlider
              currentSheetIndex={currentSheetIndex}
              setCurrentSheetIndex={(i) => setCurrentSheetIndex(i)}
            />
          </Grid>
        </Grid>
        {/* </Box> */}
      </Drawer>
    );
  }
);

CustomDrawerPlanRoom.propTypes = {
  onClose: PropTypes.func,
  setTrades: PropTypes.func,
  open: PropTypes.bool,
  Component: PropTypes.node,
  type: PropTypes.string,
  isOnboarding: PropTypes.bool,
  activeRow: PropTypes.object,
};

export default CustomDrawerPlanRoom;
