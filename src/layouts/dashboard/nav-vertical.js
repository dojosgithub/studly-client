import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// hooks

// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { ProjectView } from 'src/sections/project/view';
import { NavSectionVertical } from 'src/components/nav-section';
import { CustomDrawer } from 'src/components/custom-drawer';
import { CustomNavCollapseList } from 'src/components/custom-nav-collapse-list';
//
import { resetCreateProject } from 'src/redux/slices/projectSlice';
import { resetWorkflow } from 'src/redux/slices/workflowSlice';
import { resetTemplate } from 'src/redux/slices/templateSlice';
//
import { NAV } from '../config-layout';
import { useNavData, useNavDataSubscriber } from './config-navigation';
import { NavToggleButton, NavUpgrade } from '../_common';


// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { user } = useAuthContext();
  const lgUp = useResponsive('up', 'lg');
  const projects = useSelector(state => state.project.list)

  const navData = useNavData();
  const navDataSubscriber = useNavDataSubscriber();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
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
      {/* {user?.userType !== "Subscriber" && <Logo sx={{ my: 3, mx: "auto" }} />} */}
       <Logo sx={{ my: 3, mx: "auto" }} />
      {(user?.userType === "Subscriber") && (
        // && user?.role?.shortName === "CAD"
        <CustomNavCollapseList onOpen={() => setOpenDrawer(true)} />
      )}
      {(user?.userType === "Subscriber" && (user?.role?.shortName === "CAD" || user?.role?.shortName === "PWU")) && (
        <CustomDrawer open={openDrawer} onClose={() => {
          setOpenDrawer(false)
          dispatch(resetCreateProject())
          dispatch(resetWorkflow())
          dispatch(resetTemplate())
        }
        } Component={ProjectView} />
      )}
      <NavSectionVertical data={navData} config={
        {
          currentRole: user?.role?.shortName, // if current role is not allowed
          // // currentUserType: user?.userType, // if current userType is not allowed
        }
      } />

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavUpgrade /> */}
    </Scrollbar>
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
