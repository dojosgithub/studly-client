import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { addDays, startOfDay, isTomorrow } from 'date-fns';

const MeetingMinutesTimePicker = ({ name, label, ...other }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={new Date().getTime()}
      render={({ field, fieldState: { error } }) => {
        const selectedDate = field.value || null;
        // const isDateNextDay = selectedDate && isTomorrow(selectedDate);
        // const dateStyle = isDateNextDay
        // ? {
        //   '.MuiInputBase-root.MuiOutlinedInput-root': {
        //     color: 'red',
        //     borderColor: 'red',
        //     border: '1px solid',
        //   },
        // }
        // : {};


        return (
          <TimePicker
            ampm
            label={label}
            value={field.value}
            onChange={(time) => field.onChange(time)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
};

export default MeetingMinutesTimePicker;

MeetingMinutesTimePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};
