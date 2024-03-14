import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Chip, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

export default function RHFMultiSelectChip({ name, label, options, disabled, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value: renderVal, ...fieldProps }, fieldState: { error } }) => (
        <TextField
          {...fieldProps}
          select
          SelectProps={{
            multiple: true,
            value: renderVal || [], // Ensure the value is always an array
            onChange: (event) => {
              onChange(event.target.value);
            },
            renderValue: (selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: ".5rem" }}>
                {selected.slice(0, 3).map((value) => (
                  <Chip key={value} variant='default' label={options.find(option => option.value === value)?.label || value} />
                ))}
                {options?.length > 2 &&
                  <Chip variant='default' label={`${options.length - 2}+`} />
                }
              </div>
            ),
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 224, // Adjust based on your needs
                  width: 250,
                },
              },
            },
            disabled, // Apply the disabled prop here
          }}
          fullWidth
          label={label}
          error={!!error}
          helperText={error?.message || other.helperText}
          {...other}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

RHFMultiSelectChip.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
};
