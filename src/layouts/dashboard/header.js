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
import { CompanyMenu } from 'src/components/company-menu';
import { HEADER, NAV } from '../config-layout';
import {
  Searchbar,
  AccountPopover,
  SettingsButton,
  ContactsPopover,
  NotificationsPopover,
} from '../_common';

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
    // console.log(decodedToken);
    if (decodedToken.temp) {
      setIsViewAs(true);
    } else {
      setIsViewAs(false);
    }
  }, [accessToken]);

  const exitAccess = useCallback(async () => {
    try {
      const data = await dispatch(exitCompanyAccess({ id: 1 }));
      router.push('/');
      router.reload();
    } catch (e) {
      // console.log(e);
    }
  }, [dispatch, router]);

  const renderContent = (
    <>
      {/* {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />} */}
      {lgUp && isOnboarding && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}
      {!lgUp && isOnboarding && (
        <Logo sx={{ mx: 'auto', my: 2, height: '1.25rem', width: '100%' }} />
      )}

      {/* <Searchbar /> */}

      {/* {lgUp && !isOnboarding && <CompanyMenu />} */}
      {isViewAs ? (
        // <Button type="button" variant="contained" onClick={exitAccess}>
        //   Exit Access
        // </Button>
        <Alert
          severity="info"
          action={
            <Button type="button" variant="contained" onClick={exitAccess}>
              Exit Access
            </Button>
          }
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
          justifyContent: isOnboarding ? 'space-between' : 'flex-end',
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
