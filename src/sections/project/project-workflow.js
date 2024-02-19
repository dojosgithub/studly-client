import { useState } from 'react'
// @mui
import { Typography } from '@mui/material'

// components
import { CustomDrawer } from 'src/components/custom-drawer'
import { CustomSelect } from 'src/components/custom-select'
import ProjectCreateWorkflow from './project-create-workflow'



// Draft
// Submitted
// Reviewed
//   Reviewed for record
//   Approved (APR)
//   Make Corrections Noted (MCN)
//   Make Corrections and Resubmit (MCNR)
//   Rejected (RJT)
//   Custom [Add Text]
// Sent to Subcontractor


const ProjectWorkflow = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);


  const handleSelect = (val) => {
    console.log('val', val);
    setSelectedWorkflow(val)
    if (val === 'create') {
      setOpenDrawer(true)
    }
  }

  return (<>
    <Typography sx={{ mt: 1, mb: 4 }} fontSize='1.5rem' fontWeight='bold'>Create a Project Workflow</Typography>
    <CustomSelect selectedOption={selectedWorkflow} onSelect={handleSelect} type="workflow" options={[]} />
    <CustomDrawer open={openDrawer} onClose={() => {
      setOpenDrawer(false);
      handleSelect('')
    }} Component={ProjectCreateWorkflow} type='workflow' />
  </>)
}


export default ProjectWorkflow