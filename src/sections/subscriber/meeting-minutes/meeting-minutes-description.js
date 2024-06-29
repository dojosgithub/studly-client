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
        <RHFTextField name="description.meetingNumber" label="Meeting Number" onBlur={() => trigger('description.meetingNumber')} />
        <RHFTextField name="description.title" label="Meeting Title" onBlur={() => trigger('description.title')} />

        <RHFTextField name="description.name" label="Project Name" onBlur={() => trigger('description.name')} />
        <RHFTextField name="description.site" label="Meeting Site" onBlur={() => trigger('description.site')} />

        
        <MeetingMinutesDatePicker sx={{alignSelf:"center"}} name='description.date' label='Meeting Date' onBlur={() => trigger('description.date')}/>
        
        <MeetingMinutesTimePicker name='description.time' label='Meeting Time' onBlur={() => trigger('description.time')} />
        <RHFTextField name="description.minutesBy" label="Minutes By" onBlur={() => trigger('description.minutesBy')} />
        <RHFTextField name="description.conferenceCall" label="Conference Call" onBlur={() => trigger('description.conferenceCall')} />

        <RHFTextField name="description.meetingID" label="Meeting ID" onBlur={() => trigger('description.meetingID')} />
        <RHFTextField name="description.url" label="Meeting URL" onBlur={() => trigger('description.url')} />
      </Box>
    </>)
}

export default MeetingMinutesDescription

