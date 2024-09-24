import { useState } from 'react';
import PropTypes from 'prop-types';
//
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// @mui
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// theme
import {
  setCurrentProject,
  setCurrentProjectRole,
  setUpdateProject,
} from 'src/redux/slices/projectSlice';
import { authSwitchProject } from 'src/redux/slices/userSlice';
//
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { CustomDrawer } from 'src/components/custom-drawer';
//
import Scrollbar from 'src/components/scrollbar';
import {
  getUserRoleKeyByValue,
  STUDLY_ROLES_ACTION,
  SUBSCRIBER_USER_ROLE_STUDLY,
  USER_TYPES_STUDLY,
} from 'src/_mock';
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

    const { members, admin, _id: projectId, company: companyId } = project;
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
      updatedRole = {
        name: SUBSCRIBER_USER_ROLE_STUDLY.CAD,
        shortName: getUserRoleKeyByValue(SUBSCRIBER_USER_ROLE_STUDLY.CAD),
        loggedInAs: USER_TYPES_STUDLY.SUB,
      };
      projectData = {
        role: updatedRole,
        userType: USER_TYPES_STUDLY.SUB,
        projectId,
        companyId,
      };
    }

    dispatch(setUpdateProject());
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
          sx={{ color: (theme) => theme.palette.text.secondary, textAlign: 'center', mb: 2 }}
        >
          {email} is part of multiple projects
        </Typography>

        <Stack gap={2}>
          <Scrollbar sx={{ height: '14.75rem', py: 0, p: 3 }}>
            <Stack gap={2}>
              {projects.map((project) => (
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
                  {project?.name}
                </Button>
              ))}
            </Stack>
          </Scrollbar>
          <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.project.create}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setOpenDrawer(true)}
            >
              Create a new Project
            </Button>
          </RoleAccessWrapper>
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
