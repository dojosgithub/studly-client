import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { startCase } from 'lodash';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
import { ProjectView } from '../project/view';
// components


// ----------------------------------------------------------------------


export default function OnboardingWithoutProjects() {

  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user);
  const [openDrawer, setOpenDrawer] = useState(false)


  return (
    <>
      <Stack
        component="main"
        gap={1}
        justifyContent="center"
        sx={{
          border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
          p: 6,
          maxWidth: { md: 580, lg: 680 },
          mx: 'auto'
        }}
      >
        <Typography variant="p" sx={{ color: (theme) => theme.palette.text.secondary, textAlign: 'center' }}>
          Hello Mr. {startCase(user?.firstName)}
        </Typography>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Let’s get started by creating a new project!
        </Typography>



        <Stack
          p={2}
          maxWidth={400}
          mx='auto'
        >

          <Button
            variant="contained"
            color="secondary"
            size='large'
            onClick={() => setOpenDrawer(true)}
          // onClick={() => navigate(paths.subscriber.submittals.list)}
          >
            Create a new Project
          </Button>

        </Stack>

      </Stack>
      {/* <CustomDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} Component={ProjectView} /> */}
      {(user?.userType === "Subscriber" && (user?.role?.shortName === "CAD" || user?.role?.shortName === "PWU")) && (<CustomDrawer isOnboarding open={openDrawer} onClose={() => setOpenDrawer(false)} Component={ProjectView} />)}

    </>
  );
}

