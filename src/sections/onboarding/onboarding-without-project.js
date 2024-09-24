import { useState } from 'react';
import { useSelector } from 'react-redux';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// theme
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { STUDLY_ROLES_ACTION, SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { ProjectView } from '../project/view';
// components

// ----------------------------------------------------------------------

export default function OnboardingWithoutProjects() {
  const user = useSelector((state) => state?.user?.user);
  const [openDrawer, setOpenDrawer] = useState(false);

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
          maxWidth: { md: 580, lg: 680 },
          mx: 'auto',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Let’s get started by creating a new project!
        </Typography>

        <Stack p={2} maxWidth={400} mx="auto">
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
          {/* )} */}
        </Stack>
      </Stack>
      {user?.userType === 'Subscriber' &&
        (user?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
          user?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
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
