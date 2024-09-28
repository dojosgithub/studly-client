import React from 'react';
// mui
import { Box, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material';
// components
import ProjectInviteUserListView from './project-invite-user-list-view';

const ProjectInviteUserStudly = () => (
  <Stack gap={2} rowGap={7} textAlign="left">
    <Stack>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box>
          <FormControlLabel
            control={<Radio color="primary" defaultChecked />}
            label="Internal Team"
            sx={{
              mb: 1,
              '& .MuiFormControlLabel-label': { fontSize: '1rem', fontWeight: 'semiBold' },
            }}
          />
          <Typography
            sx={{ mb: 4, maxWidth: 300, color: (theme) => alpha(theme.palette.grey[500], 0.7) }}
            fontSize="1rem"
            fontWeight="normal"
          >
            Permissions of internal team members can vary depending on their role
          </Typography>
        </Box>
      </Box>
      <ProjectInviteUserListView type="internal" />
    </Stack>
    <Stack>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box>
          <FormControlLabel
            control={<Radio color="primary" defaultChecked />}
            label="External Team"
            sx={{
              mb: 1,
              '& .MuiFormControlLabel-label': { fontSize: '1rem', fontWeight: 'semiBold' },
            }}
          />
          <Typography
            sx={{ mb: 4, maxWidth: 300, color: (theme) => alpha(theme.palette.grey[500], 0.7) }}
            fontSize="1rem"
            fontWeight="normal"
          >
            Permissions of external team members can vary depending on their role
          </Typography>
        </Box>
      </Box>
      <ProjectInviteUserListView type="external" />
    </Stack>
  </Stack>
);

export default ProjectInviteUserStudly;
