import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Box, Divider, Typography, alpha } from '@mui/material'
// components
import { getCompanyUserList } from 'src/redux/slices/projectSlice'
import MeetingMinutesInviteAttendeeView from './meeting-minutes-invite-attendee-view'

const MeetingMinutesInviteAttendees = () => {
    const dispatch = useDispatch()
    return (
        <Box position='relative'>
            <Box sx={{ mt: 1, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontSize='1.5rem' fontWeight='bold'>Meeting Attendees</Typography>
            </Box>

            <MeetingMinutesInviteAttendeeView />
        </Box>
    )
}

export default MeetingMinutesInviteAttendees