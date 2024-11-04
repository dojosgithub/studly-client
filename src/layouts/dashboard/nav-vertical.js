import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// hooks

// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hooks';
import { ProjectView } from 'src/sections/project/view';
//
import { NavSectionVertical } from 'src/components/nav-section';
import { CustomDrawer } from 'src/components/custom-drawer';
import { CustomNavCollapseList } from 'src/components/custom-nav-collapse-list';
//
import { resetCreateProject, setProjectDrawerState } from 'src/redux/slices/projectSlice';
import { resetWorkflow } from 'src/redux/slices/workflowSlice';
import { resetTemplate } from 'src/redux/slices/templateSlice';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');
  const user = useSelector((state) => state.user.user);
  const isProjectDrawerOpen = useSelector((state) => state.project.isProjectDrawerOpen);

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderContent = (
    <Box
      sx={{ backgroundColor: (theme) => theme.palette.background.brandSecondary, height: '100%' }}
    >
      <Scrollbar
        sx={{
          height: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: (theme) => theme.palette.background.brandSecondary,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginY: 3, // shorthand alternative for my: 3
          }}
        >
          <Logo
            sx={{
              padding: lgUp ? '1rem .5rem' : '.5rem',
              width: 'auto',
            }}
          />
        </Box>

        {user?.userType === 'Subscriber' && (
          <CustomNavCollapseList
            onOpen={() => {
              dispatch(setProjectDrawerState(true));
            }}
          />
        )}
        {user?.userType === 'Subscriber' &&
          (user?.role?.shortName === 'CAD' || user?.role?.shortName === 'PWU') && (
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
        <NavSectionVertical
          data={navData}
          config={{
            currentRole: user?.role?.shortName, // if current role is not allowed
          }}
        />

        <Box sx={{ flexGrow: 1 }} />
      </Scrollbar>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  onCloseNav: PropTypes.func,
  openNav: PropTypes.bool,
};
