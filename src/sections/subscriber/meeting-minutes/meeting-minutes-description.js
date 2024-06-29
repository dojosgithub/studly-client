// @mui
import { Divider, Typography, Box, alpha } from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
// form
import { addDays, isTomorrow, startOfDay } from 'date-fns';
import {
  RHFTextField,
} from 'src/components/hook-form';
import MeetingMinutesTimePicker from './meeting-minutes-time-picker';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';






const MeetingMinutesDescription = () => {
  const { trigger } = useFormContext()
  return (
    <>
      <Typography sx={{ my: 2 }} fontSize='1.5rem' fontWeight='bold'>Meeting Description</Typography>


      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
        my={5}
      >
        <RHFTextField name="meetingNumber" label="Meeting Number" onBlur={() => trigger('meetingNumber')} />
        <RHFTextField name="title" label="Meeting Title" onBlur={() => trigger('title')} />

        <RHFTextField name="name" label="Project Name" onBlur={() => trigger('name')} />
        <RHFTextField name="site" label="Meeting Site" onBlur={() => trigger('site')} />

        
        <MeetingMinutesDatePicker sx={{alignSelf:"center"}} name='date' label='Meeting Date' onBlur={() => trigger('date')}/>
        
        <MeetingMinutesTimePicker name='time' label='Meeting Time' onBlur={() => trigger('time')} />
        <RHFTextField name="minutesBy" label="Minutes By" onBlur={() => trigger('minutesBy')} />
        <RHFTextField name="conferenceCall" label="Conference Call" onBlur={() => trigger('conferenceCall')} />

        <RHFTextField name="meetingID" label="Meeting ID" onBlur={() => trigger('meetingID')} />
        <RHFTextField name="url" label="Meeting URL" onBlur={() => trigger('url')} />
      </Box>
    </>)
}

export default MeetingMinutesDescription

