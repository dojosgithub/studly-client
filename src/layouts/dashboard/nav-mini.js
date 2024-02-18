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
import { NAV } from '../config-layout';
import { useNavData, useNavDataSubscriber } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();
  // // const navDataSubscriber = useNavDataSubscriber();
  const { user } = useAuthContext();

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
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
        // // data={user?.role === "subscriber" ? navDataSubscriber : navData}
         data={navData}
          config={
            {
              currentRole: user?.role, // if current role is not allowed
            }
          }
        />
      </Stack>
    </Box>
  );
}
