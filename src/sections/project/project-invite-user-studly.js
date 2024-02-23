import React, { useState } from 'react'
// mui
import { Box, Divider, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material'
// components
import ProjectInviteUserListView from './project-invite-user-list-view'

const ProjectInviteUserStudly = () => {
    const [arr, setArr] = useState()
    return (
            <Stack gap={2} rowGap={7} textAlign='center'>
                <Box>
                    <FormControlLabel
                        control={<Radio color="primary" defaultChecked />}
                        label="Internal Team"
                        sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                    />
                    <Typography sx={{ mb: 4, maxWidth: 300, mx: 'auto', color: (theme) => alpha(theme.palette.grey[500], 0.7) }} fontSize='1rem' fontWeight='normal'>Permissions of internal team members can vary depending on their role</Typography>
                    <ProjectInviteUserListView type='internal'/>
                </Box>
                <Box>
                    <FormControlLabel
                        control={<Radio color="primary" defaultChecked />}
                        label="External Team"
                        sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                    />
                    <Typography sx={{ mb: 4, maxWidth: 300, mx: 'auto', color: (theme) => alpha(theme.palette.grey[500], 0.7) }} fontSize='1rem' fontWeight='normal'>Permissions of external team members can vary depending on their role</Typography>
                    <ProjectInviteUserListView type='external'/>
                </Box>
            </Stack>
    )
}

export default ProjectInviteUserStudly