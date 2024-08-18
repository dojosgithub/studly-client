import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

// components
import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
//
import { resetCreateProject, setProjectDrawerState } from 'src/redux/slices/projectSlice';
import { resetWorkflow } from 'src/redux/slices/workflowSlice';
import { resetTemplate } from 'src/redux/slices/templateSlice';
//
import { CustomNavCollapseList } from 'src/components/custom-nav-collapse-list';
import { CustomDrawer } from 'src/components/custom-drawer';
import { ProjectView } from 'src/sections/project/view';
//
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { NAV } from '../config-layout';
import { useNavData, useNavDataSubscriber } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();
  // // const navDataSubscriber = useNavDataSubscriber();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { user } = useAuthContext();
  const isProjectDrawerOpen = useSelector((state) => state.project.isProjectDrawerOpen);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        backgroundColor: (theme) => theme.palette.background.brandSecondary,
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2, height: '1.25rem', width: '100%' }} />

        {user?.userType === 'Subscriber' && (
          // && user?.role?.shortName === "CAD"
          <CustomNavCollapseList
            onOpen={() => {
              // setOpenDrawer(true)
              dispatch(setProjectDrawerState(true));
            }}
            isShirinked
          />
        )}
        {user?.userType === 'Subscriber' &&
          (user?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
            user?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
            <CustomDrawer
              onClose={() => {
                dispatch(setProjectDrawerState(false));
                // setOpenDrawer(false)
                dispatch(resetCreateProject());
                dispatch(resetWorkflow());
                dispatch(resetTemplate());
              }}
              open={isProjectDrawerOpen}
              // open={openDrawer}
              Component={ProjectView}
            />
          )}
        <NavSectionMini
          // // data={user?.role === "subscriber" ? navDataSubscriber : navData}
          data={navData}
          config={{
            currentRole: user?.role?.shortName, // if current role is not allowed
            // // currentUserType: user?.userType, // if current userType is not allowed
          }}
        />
      </Stack>
    </Box>
  );
}
