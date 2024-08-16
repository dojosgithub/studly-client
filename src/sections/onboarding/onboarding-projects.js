import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
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
import { authSwitchProject } from 'src/redux/slices/userSlice';
//
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { CustomDrawer } from 'src/components/custom-drawer';
//
import { getKeyByValue, SUBSCRIBER_USER_ROLE_STUDLY, USER_TYPES_STUDLY } from 'src/_mock';
import { ProjectView } from '../project/view';
// components

// ----------------------------------------------------------------------

export default function OnboardingProjects({ projects }) {
  const dispatch = useDispatch();
  const email = useSelector((state) => state?.user?.user?.email);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const user = useSelector((state) => state?.user?.user);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const handleProject = (project) => {
    dispatch(setCurrentProject(project));

    const { members, admin, id: projectId, company: companyId } = project;
    const isCompanyAdmin = role === 'CAD';

    let projectData;
    let updatedRole;

    if (!isCompanyAdmin) {
      // Non-Company Admin Logic
      const projectMember = members.find((member) => member.email === email);

      if (projectMember) {
        updatedRole = projectMember.role;
        projectData = {
          role: updatedRole,
          userType: updatedRole.loggedInAs,
          projectId,
          companyId,
        };
      }
    } else {
      // Company Admin Logic
      const isAdmin = admin === user._id;
      updatedRole = {
        name: SUBSCRIBER_USER_ROLE_STUDLY.CAD,
        shortName: getKeyByValue(SUBSCRIBER_USER_ROLE_STUDLY, SUBSCRIBER_USER_ROLE_STUDLY.CAD),
        loggedInAs: USER_TYPES_STUDLY.SUB,
      };
      projectData = {
        role: updatedRole,
        userType: USER_TYPES_STUDLY.SUB,
        projectId,
        companyId,
      };

      console.log('Company Admin or Power User', isAdmin);
    }

    if (projectData) {
      dispatch(authSwitchProject(projectData));
      dispatch(setCurrentProjectRole(updatedRole));
    }

    // TODO: update current project through token role CAD and PWU

    navigate(paths.subscriber.submittals.list);
  };

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
          mx: 'auto',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Choose a Project to Continue
        </Typography>

        <Typography
          variant="p"
          sx={{ color: (theme) => theme.palette.text.secondary, textAlign: 'center' }}
        >
          {email} is part of multiple projects
        </Typography>

        <Stack p={5} gap={2}>
          {projects.slice(0, 4).map((project) => (
            <Button
              sx={{
                minHeight: '60px',
                borderRadius: 1,
                border: (theme) => `2px solid ${theme.palette.background.brandPrimary}`,
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleProject(project)}
              key={project?._id}
            >
              {/* <RouterLink href="/subscriber" style={{ textDecoration: 'none', color: '#3e3e3e' }}>
            </RouterLink> */}
              {project?.name}
            </Button>
          ))}
          {/* // {user?.userType === 'Subscriber' && */}
          {/* // (user?.role?.shortName === 'CAD' || user?.role?.shortName === 'PWU') && ( */}
          <RoleAccessWrapper>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setOpenDrawer(true)}
              // onClick={() => navigate(paths.subscriber.submittals.list)}
            >
              Create a new Project
            </Button>
          </RoleAccessWrapper>
          {/* // )} */}
        </Stack>
      </Stack>
      {user?.userType === 'Subscriber' &&
        (user?.role?.shortName === 'CAD' || user?.role?.shortName === 'PWU') && (
          <CustomDrawer
            isOnboarding
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            Component={ProjectView}
          />
        )}
    </>
  );
}

OnboardingProjects.propTypes = {
  projects: PropTypes.array,
};
