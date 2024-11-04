import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';

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
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

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
        <Logo sx={{ padding: '1rem .5rem' }} />

        {user?.userType === 'Subscriber' && (
          <CustomNavCollapseList
            onOpen={() => {
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
                dispatch(resetCreateProject());
                dispatch(resetWorkflow());
                dispatch(resetTemplate());
              }}
              open={isProjectDrawerOpen}
              Component={ProjectView}
            />
          )}
        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role?.shortName, // if current role is not allowed
          }}
        />
      </Stack>
    </Box>
  );
}
