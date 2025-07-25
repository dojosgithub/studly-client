import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Box, Divider, Typography, alpha } from '@mui/material'
// components
import { getCompanyUserList } from 'src/redux/slices/projectSlice'
import ProjectInviteUserStudly from './project-invite-user-studly'

const ProjectInviteUsers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getCompanyUserList())
    }, [dispatch])

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