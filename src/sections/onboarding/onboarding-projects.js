import PropTypes from 'prop-types';
//
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
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
import { setCurrentProject } from 'src/redux/slices/projectSlice';
// components


// ----------------------------------------------------------------------


export default function OnboardingProjects({ projects }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProject = (project) => {
    dispatch(setCurrentProject(project))
    navigate('/subscriber')
  }

  return (
    <Stack
      component="main"
      gap={1}
      justifyContent="center"
      sx={{
        border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
        p: 6,
        maxWidth: 780,
        mx: 'auto'
      }}
    >
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Choose a Project to Continue
      </Typography>

      <Typography variant="p" sx={{ color: (theme) => theme.palette.text.secondary, textAlign: 'center' }}>
        1234@email.com is part of multiple projects
      </Typography>


      <Stack
        p={5}
        gap={2}
      >
        {projects.map(project => (

          <Button
            sx={{
              minHeight: '60px',
              borderRadius: 1,
              border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleProject(project)}
          >
            {/* <RouterLink href="/subscriber" style={{ textDecoration: 'none', color: '#3e3e3e' }}>
            </RouterLink> */}
              {project?.name}
          </Button>)
        )
        }
      </Stack>

    </Stack>
  );
}

OnboardingProjects.propTypes = {
  projects: PropTypes.array,
};
