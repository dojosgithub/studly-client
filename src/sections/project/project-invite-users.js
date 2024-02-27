import React, { useCallback, useState } from 'react'
// mui
import { Box, Button, Divider, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material'
//
import { RHFRadioGroup } from 'src/components/hook-form'
// components
import Iconify from 'src/components/iconify'
import ProjectInviteUserOutside from './project-invite-user-outside'
import ProjectInviteUserStudly from './project-invite-user-studly'
import ProjectInviteNewUser from './project-invite-new-user'
import ProjectInviteUserDialog from './project-invite-user-dialog'

const ProjectInviteUsers = () => {
    const [openInviteUser, setOpenInviteUser] = useState(false)
    // // const [inviteEmail, setInviteEmail] = useState('')
    // // const handleOptionChange = (event) => {
    // //     setSelectedOption(event.target.value);
    // // };
    // // const handleChangeInvite = useCallback((event) => {
    // //     const email = event.target.value;
    // //     setInviteEmail(email);

    //     // Validate email format
    // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // //     const isValidEmail = emailRegex.test(email);

    // //     if (!isValidEmail) {
    // //         setError(true);
    // //         setHelperText('Invalid email format');
    // //     } else {
    // //         setError(false);
    // //         setHelperText('');
    // //     }
    // // }, []);


    // // const handleSendInvite = () => {
    //     // Handle sending invite
    // //     console.log('email', inviteEmail)
    // //     setInviteEmail('')
    // //     // snackbar
    // //     setOpenInviteUser(false)
    // // };

    return (
        <>
            <Box sx={{ mt: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontSize='1.5rem' fontWeight='bold'>Invite Users</Typography>
            </Box>
            <Divider sx={{
                minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                mb: 7
            }} />


            <ProjectInviteUserStudly />
        </>
    )
}

export default ProjectInviteUsers