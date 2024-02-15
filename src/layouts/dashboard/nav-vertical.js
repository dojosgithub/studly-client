import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
//
import { NAV } from '../config-layout';
import { useNavData, useNavDataSubscriber } from './config-navigation';
import { NavToggleButton, NavUpgrade } from '../_common';


// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { role } = useAuthContext();

  const lgUp = useResponsive('up', 'lg');

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
      {/* <Logo sx={{ mt: 3, ml: 4, mb: 1 }} /> */}
      {role === "subscriber" && (<Button variant="contained" color='primary' onClick={() => setOpenDrawer(true)}>
        Project
      </Button>)}
      {role === "subscriber" && (<CustomDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} Component={ProjectView}/>)}
      <NavSectionVertical data={role === "subscriber" ? navDataSubscriber : navData} />

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
