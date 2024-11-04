import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Alert, Button } from '@mui/material';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { exitCompanyAccess } from 'src/redux/slices/companySlice';
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
import { AccountPopover } from '../_common';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav, isOnboarding = false }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isViewAs, setIsViewAs] = useState(false);
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const accessToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.temp) {
      setIsViewAs(true);
    } else {
      setIsViewAs(false);
    }
  }, [accessToken]);

  const exitAccess = useCallback(async () => {
    try {
      await dispatch(exitCompanyAccess({ id: 1 }));
      router.push('/');
      router.reload();
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, router]);

  const renderContent = (
    <>
      {lgUp && isOnboarding && <Logo sx={{ padding: '1rem .5rem', width: 'auto' }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}
      {!lgUp && isOnboarding && <Logo sx={{ padding: '.75rem .5rem', width: 'auto' }} />}

      {isViewAs ? (
        <Alert
          severity="info"
          action={
            <Button
              type="button"
              variant="contained"
              onClick={exitAccess}
              sx={{
                ml: { xs: 0, md: 1 },

                minWidth: 'max-content',
              }} // Add some margin for spacing
            >
              Exit Access
            </Button>
          }
          sx={{
            backgroundColor: '#f0f4ff', // Light background color
            border: '1px solid #3f51b5', // Border color matching the theme
            '& .MuiAlert-action': {
              margin: { xs: 0 },
              width: { xs: '100%' },
              padding: { xs: 0 },
              justifyContent: { md: 'flex-end', lg: 'center' },
            },
            '& .MuiAlert-icon': {
              color: '#3f51b5', // Icon color matching the theme
              display: { xs: 'none', md: 'flex' },
            },
            '& .MuiAlert-message': {
              fontWeight: '500', // Slightly bolder text for emphasis
              minWidth: 'max-content', //
              '@media (max-width:600px)': {
                display: 'none',
              },
            },
            display: 'flex',
            flexWrap: { xs: 'nowrap' }, // xs: 'wrap', md: 'nowrap'
            marginTop: { xs: 0, md: 0 }, //  xs:'2rem'
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            // position: 'absolute',
            // right: '5%',
            maxWidth: '475px',
            gap: { xs: '.75rem', md: '.25rem' },
            '@media (max-width:600px)': {
              width: 'auto',
              background: 'transparent',
              border: 0,
            },
          }}
        >
          You are now operating as the Company Admin.
        </Alert>
      ) : (
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1 }}
        >
          <AccountPopover />
        </Stack>
      )}
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: isOnboarding ? '#3E3E3E' : 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
          // if it is onboarding
          ...(isOnboarding && {
            width: `100%`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          backgroundColor: isOnboarding ? '#3E3E3E' : theme.palette.background.brandPrimary,
          justifyContent: isOnboarding || !lgUp ? 'space-between' : 'flex-end',
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
  isOnboarding: PropTypes.bool,
};
