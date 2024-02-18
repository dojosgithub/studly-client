import { Container } from '@mui/material'
import React, { useState } from 'react'
import { PROJECT_STATUS_TREE } from 'src/_mock'
import OrganizationalChart from 'src/components/organizational-chart/organizational-chart'
import Scrollbar from 'src/components/scrollbar'

const ProjectCreateWorkflow = () => {
    const [state, setState] = useState('')
    return (
        <Container>
            <Scrollbar sx={{ 'py': 4 }}>
                <OrganizationalChart data={PROJECT_STATUS_TREE} variant='simple' />
            </Scrollbar>
        </Container>
    )
}

export default ProjectCreateWorkflow