import React, { useState } from 'react'
// mui
import { Box, Divider, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material'
//
import { RHFRadioGroup } from 'src/components/hook-form'
// components
import ProjectInviteUserOutside from './project-invite-user-outside'
import ProjectInviteUserStudly from './project-invite-user-studly'

const ProjectInviteUsers = () => {
    const [showFirst, setShowFirst] = useState(true)
    return (
        <>
            <Typography sx={{ mt: 1, mb: 2 }} fontSize='1.5rem' fontWeight='bold'>Invite Users</Typography>
            <Divider sx={{
                minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                mb: 7
            }} />

            {showFirst ? <ProjectInviteUserOutside /> :
                <ProjectInviteUserStudly />}
        </>
    )
}

export default ProjectInviteUsers