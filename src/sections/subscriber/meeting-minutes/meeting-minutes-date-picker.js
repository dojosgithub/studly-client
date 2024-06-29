import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { addDays, startOfDay, isTomorrow } from 'date-fns';

const MeetingMinutesDatePicker = ({ name, label, ...other }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={new Date()}
      render={({ field, fieldState: { error } }) => {
        const selectedDate = field.value || null;
        const isDateNextDay = selectedDate && isTomorrow(selectedDate);
        const dateStyle = isDateNextDay
          ? {
            '.MuiInputBase-root.MuiOutlinedInput-root': {
              color: 'red',
              borderColor: 'red',
              border: '1px solid',
            },
          }
          : {};
        console.log(isDateNextDay);
        return (
          <DatePicker
            label={label}
            views={['day']}
            value={selectedDate}
            minDate={startOfDay(addDays(new Date(), 1))}
            onChange={(date) => field.onChange(date)}
            format="MM/dd/yyyy" // Specify the desired date format
            error={!!error}
            helperText={error && error?.message}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
            {...other}
          // sx={dateStyle} // Apply conditional style based on the date comparison
          />
        );
      }}
    />
  );
};

export default MeetingMinutesDatePicker;

MeetingMinutesDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};
