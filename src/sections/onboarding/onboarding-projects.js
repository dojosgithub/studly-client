import { useState } from 'react';
import PropTypes from 'prop-types';
//
import { useDispatch, useSelector } from 'react-redux';
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
import { setCurrentProject, setCurrentProjectRole } from 'src/redux/slices/projectSlice';
import { CustomDrawer } from 'src/components/custom-drawer';
import { ProjectView } from '../project/view';
// components


// ----------------------------------------------------------------------


export default function OnboardingProjects({ projects }) {
  const dispatch = useDispatch();
  const email = useSelector(state => state?.user?.user?.email);
  const role = useSelector(state => state?.user?.user?.role?.shortName);
  const user = useSelector(state => state?.user?.user);
  const [openDrawer, setOpenDrawer] = useState(false)
  const navigate = useNavigate();

  const handleProject = (project) => {
    dispatch(setCurrentProject(project))
    const { members } = project;
    if (role !== "CAD" || role !== "PWU") {
      // Check if members array is not empty and find the member by email
      if (members && members.length > 0) {
        const projectRole = members.find(member => member.email === email);
        dispatch(setCurrentProjectRole(projectRole?.role))
      }

    }

    navigate(paths.subscriber.submittals.list)
  }

  return (
    <>
      <Stack
        component="main"
        gap={1}
        justifyContent="center"
        sx={{
          border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
          borderRadius: '1rem',
          p: 6,
          maxWidth: 780,
          mx: 'auto'
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Choose a Project to Continue
        </Typography>

        <Typography variant="p" sx={{ color: (theme) => theme.palette.text.secondary, textAlign: 'center' }}>
          {email} is part of multiple projects
        </Typography>


        <Stack
          p={5}
          gap={2}
        >
          {projects.slice(0, 4).map(project => (

            <Button
              sx={{
                minHeight: '60px',
                borderRadius: 1,
                border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleProject(project)}
              key={project?._id}
            >
              {/* <RouterLink href="/subscriber" style={{ textDecoration: 'none', color: '#3e3e3e' }}>
            </RouterLink> */}
              {project?.name}
            </Button>)
          )
          }
          {(user?.userType === "Subscriber" && (user?.role?.shortName === "CAD" || user?.role?.shortName === "PWU")) && <Button
            variant="contained"
            color="secondary"
            size='large'
            onClick={() => setOpenDrawer(true)}
          // onClick={() => navigate(paths.subscriber.submittals.list)}
          >
            Create a new Project
          </Button>}
        </Stack>

      </Stack>
      {(user?.userType === "Subscriber" && (user?.role?.shortName === "CAD" || user?.role?.shortName === "PWU")) && (<CustomDrawer isOnboarding open={openDrawer} onClose={() => setOpenDrawer(false)} Component={ProjectView} />)}

    </>
  );
}

OnboardingProjects.propTypes = {
  projects: PropTypes.array,
};
