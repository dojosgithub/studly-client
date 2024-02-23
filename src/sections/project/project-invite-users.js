import React, { useState } from 'react'
// mui
import { Box, Divider, FormControlLabel, Radio, Stack, Typography, alpha } from '@mui/material'
//
import { RHFRadioGroup } from 'src/components/hook-form'
// components
import ProjectInviteUserOutside from './project-invite-user-outside'
import ProjectInviteUserStudly from './project-invite-user-studly'

const ProjectInviteUsers = () => {
    const [selectedOption, setSelectedOption] = useState('Studly'); // Default selected option

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            <Typography sx={{ mt: 1, mb: 2 }} fontSize='1.5rem' fontWeight='bold'>Invite Users</Typography>
            <Divider sx={{
                minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                mb: 7
            }} />
            <Box sx={{ display: 'flex', justifyContent: "center", mb: 4 }}>
                <FormControlLabel
                    control={<Radio color="primary" checked={selectedOption === 'Studly'} onChange={handleOptionChange} value="Studly" />}
                    label="Invite users from Studly"
                    sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                />
                <FormControlLabel
                    control={<Radio color="primary" defaultChecked checked={selectedOption === 'Outside'} onChange={handleOptionChange} value="Outside" />}
                    label="Invite users from Outside"
                    sx={{ mb: 1, "& .MuiFormControlLabel-label": { fontSize: '1rem', fontWeight: 'semiBold' } }}
                />
            </Box>
            {selectedOption === 'Studly' ? <ProjectInviteUserStudly /> : <ProjectInviteUserOutside />}
        </>
    )
}

export default ProjectInviteUsers