
import { Paper, Typography, alpha } from '@mui/material'
import React, { useState } from 'react'

const ProjectFinal = () => {
    const [first, setfirst] = useState('second')
    return (
        <Paper
            sx={{
                p: 3,
                my: 3,
                minHeight: 120,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
        >
            <Typography sx={{ my: 1 }}>Project Final View</Typography>
        </Paper>
    )
}

export default ProjectFinal