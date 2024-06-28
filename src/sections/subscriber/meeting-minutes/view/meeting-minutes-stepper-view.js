import React from 'react'
import { Box, Stack } from '@mui/material'
import MeetingMinutesStepperForm from '../meeting-minutes-stepper-form'

const MeetingMinutesStepperView = () => (
  <Box sx={{ my: 0, flex: 1 }}>
    <Stack spacing={7} direction='row' height='100%'>

      <MeetingMinutesStepperForm />
    </Stack>
  </Box>
)


export default MeetingMinutesStepperView