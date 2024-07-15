// @mui
import { Divider, Typography, Box } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
// form
import { addDays, isTomorrow, startOfDay } from 'date-fns';
import { RHFTextField } from 'src/components/hook-form';
import MeetingMinutesTimePicker from './meeting-minutes-time-picker';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';

const MeetingMinutesDescription = () => {
  const { trigger, getValues, setValue } = useFormContext();

  const handleBlur = (fieldName) => {

    trigger(`description.${fieldName}`);
  };

  return (
    <>
      <Typography sx={{ my: 4 }} fontSize="1.5rem" fontWeight="bold">
        Meeting Description
      </Typography>

      <Box
        rowGap={3}
        columnGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 2fr)',
          sm: 'repeat(2, 2fr)',
        }}
        my={7} // Increase the top margin to create more space below the heading
      >
        <RHFTextField
          name="description.meetingNumber"
          label="Meeting Number"
          onBlur={() => handleBlur('meetingNumber')}
        />
        <RHFTextField
          name="description.title"
          label="Meeting Title"
          onBlur={() => handleBlur('title')}
        />
        <RHFTextField
          name="description.site"
          label="Meeting Site"
          onBlur={() => handleBlur('site')}
        />
        
        <RHFTextField
          name="description.minutesBy"
          label="Minutes By"
          onBlur={() => handleBlur('minutesBy')}
        />
        <RHFTextField
          name="description.url"
          label="Video Conference Link"
          onBlur={() => handleBlur('url')}
        />
        <RHFTextField
          name="description.meetingID"
          label="Video Conference Link"
          onBlur={() => handleBlur('meetingID')}
        />
        <MeetingMinutesDatePicker
          sx={{ alignSelf: 'center' }}
          name="description.date"
          label="Meeting Date"
          onBlur={() => handleBlur('date')}
        />
        <MeetingMinutesTimePicker
          name="description.time"
          label="Meeting Time"
          onBlur={() => handleBlur('time')}
        />
        
      </Box>
    </>
  );
};

export default MeetingMinutesDescription;
