import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components


// ----------------------------------------------------------------------


export default function OnboardingWithoutProjects() {

  const navigate = useNavigate()


  return (
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
        Hello Mr. John
      </Typography>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Create a new project to get started with Studly
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
          onClick={() => navigate('/submittals')}
        >
          Create a new Project
        </Button>

      </Stack>

    </Stack>
  );
}

