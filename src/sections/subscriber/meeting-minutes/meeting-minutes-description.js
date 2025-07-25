// @mui
import { Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
// form
import { dropdownOptions2 } from 'src/_mock';
import { RHFTextField } from 'src/components/hook-form';
import MeetingMinutesTimePicker from './meeting-minutes-time-picker';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';

const MeetingMinutesDescription = () => {
  const { trigger, control } = useFormContext();
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
          disabled
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
          name="description.conferenceCallLink"
          label="Video Conference Link"
          onBlur={() => handleBlur('conferenceCallLink')}
        />
        <RHFTextField
          name="description.conferenceCallId"
          label="Video Conference ID"
          onBlur={() => handleBlur('conferenceCallId')}
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

        <FormControl>
          <InputLabel>Timezone</InputLabel>
          <Controller
            name="description.timezone"
            control={control}
            defaultValue={dropdownOptions2[0].zone} // Set the default value to the zone identifier
            render={({ field }) => (
              <Select
                {...field}
                label="timezone"
                onChange={(event) => {
                  const selectedZone = event.target.value;
                  const selectedTimezone = dropdownOptions2.find(
                    (timezone) => timezone.zone === selectedZone
                  );
                  field.onChange(selectedTimezone); // Save the whole object in the form state
                }}
                value={field.value.zone || ''} // Ensure the correct value is displayed
              >
                {dropdownOptions2.map((timezone) => (
                  <MenuItem key={timezone.zone} value={timezone.zone}>
                    {`${timezone.utc} ${timezone.name}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>
    </>
  );
};

export default MeetingMinutesDescription;
