import { useEffect } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { startCase } from 'lodash';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import { getProjectList } from 'src/redux/slices/projectSlice';
import SearchIllustration from 'src/assets/illustrations/search-illustration.svg';
import OnboardingProjects from '../onboarding-projects';
import OnboardingWithoutProjects from '../onboarding-without-project';

// ----------------------------------------------------------------------

export default function OnboardingView() {
  const { method, user } = useAuthContext();
  const projects = useSelector((state) => state.project.list);
  const theme = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  const upMd = useResponsive('up', 'md');

  const renderContent = (
    <Box
      sx={{
        flexGrow: 1,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: { xs: 5, md: 5 },
      }}
    >
      {projects?.length > 0 ? (
        <OnboardingProjects projects={projects} />
      ) : (
        <OnboardingWithoutProjects />
      )}
    </Box>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={SearchIllustration || '/assets/illustrations/search-illustration.svg'}
        sx={{ maxWidth: 720 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      width="100%"
      sx={
        {
          // minHeight: '100vh',
        }
      }
    >
      <Typography
        variant="h3"
        my={2}
        sx={{
          textAlign: 'center',
          height: '10rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hi {startCase(user?.firstName)}! Which project would you <br /> like to start working on
        today?
      </Typography>

      <Grid container alignItems="center" justifyContent="center" columnGap={4}>
        {upMd && <Grid>{renderSection}</Grid>}

        <Grid>{renderContent}</Grid>
      </Grid>
    </Stack>
  );
}
