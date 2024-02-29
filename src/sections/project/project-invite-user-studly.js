import React, { useState } from 'react'
// mui
import { Box, Button, Divider, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material'
// components
import Iconify from 'src/components/iconify'
import ProjectInviteUserListView from './project-invite-user-list-view'
import ProjectInviteUserDialog from './project-invite-user-dialog'

const ProjectInviteUserStudly = () => {
    const [openInviteUser, setOpenInviteUser] = useState(false)
    const [type, setType] = useState('')
    const handleInviteUser = (value) => {
        setOpenInviteUser(true)
        setType(value)
    }
    return (
        <>
            <Stack gap={2} rowGap={7} textAlign='left'>
                <Stack>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        <Box>
                            <FormControlLabel
                                control={<Radio color="primary" defaultChecked />}
                                label="Internal Team"
                                sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                            />
                            <Typography sx={{ mb: 4, maxWidth: 300, color: (theme) => alpha(theme.palette.grey[500], 0.7) }} fontSize='1rem' fontWeight='normal'>Permissions of internal team members can vary depending on their role</Typography>
                        </Box>
                        <Button
                            component='button'
                            variant="outlined"
                            startIcon={<Iconify icon="mdi:invite" />}
                            color='secondary'
                            type="button"
                            onClick={() => handleInviteUser('internal')}
                            sx={{ flexShrink: 0, maxWidth: 'max-content', mt: '2px' }}
                        >
                            Invite User
                        </Button>
                    </Box>
                    <ProjectInviteUserListView type='internal' />
                </Stack>
                <Stack>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

                        <Box>
                            <FormControlLabel
                                control={<Radio color="primary" defaultChecked />}
                                label="External Team"
                                sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                            />
                            <Typography sx={{ mb: 4, maxWidth: 300, color: (theme) => alpha(theme.palette.grey[500], 0.7) }} fontSize='1rem' fontWeight='normal'>Permissions of external team members can vary depending on their role</Typography>
                        </Box>
                        <Button
                            component='button'
                            variant="outlined"
                            startIcon={<Iconify icon="mdi:invite" />}
                            color='secondary'
                            type="button"
                            onClick={() => handleInviteUser('external')}
                            sx={{ flexShrink: 0, maxWidth: 'max-content', mt: '2px' }}
                        >
                            Invite User
                        </Button>
                    </Box>
                    <ProjectInviteUserListView type='external' />
                </Stack>
            </Stack>
            <ProjectInviteUserDialog
                open={openInviteUser}
                onClose={() => setOpenInviteUser(false)}
                type={type}
            />
        </>
    )
}

export default ProjectInviteUserStudly