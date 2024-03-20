import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  chip = false,
  disabled = false,
  ...other
}) {
  const { control } = useFormContext();

  const renderSelectedValue = (selected, chipProp) => {
    if (chipProp) {
      // Render selected options as chips
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {Array.isArray(selected)
            ? selected.map(value => <Chip key={value} disabled={disabled} label={value} sx={{ bgcolor: 'lightgrey' }} />)
            : <Chip label={selected} disabled={disabled} sx={{ bgcolor: 'lightgrey' }} />}
        </div>
      );
    }
    // Otherwise, return the selected value(s) as a string
    return Array.isArray(selected) ? selected.join(', ') : selected;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            sx: { textTransform: 'capitalize' },
            renderValue: selected => renderSelectedValue(selected, chip),
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          disabled={disabled}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

RHFSelect.propTypes = {
  PaperPropsSx: PropTypes.object,
  children: PropTypes.node,
  helperText: PropTypes.object,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  native: PropTypes.bool,
  chip: PropTypes.bool,
  disabled: PropTypes.bool,
};

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  sx,
  ...other
}) {
  const { control } = useFormContext();

  const renderValues = (selectedIds) => {
    const selectedItems = options.filter((item) => selectedIds.includes(item.value));

    if (!selectedItems.length && placeholder) {
      return (
        <Box component="em" sx={{ color: 'text.disabled' }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={sx}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            labelId={name}
            input={<OutlinedInput fullWidth label={label} error={!!error} />}
            renderValue={renderValues}
            {...other}
          >
            {placeholder && (
              <MenuItem disabled value="">
                <em> {placeholder} </em>
              </MenuItem>
            )}

            {options.map((option) => {
              const selected = field.value.includes(option.value);

              return (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

RHFMultiSelect.propTypes = {
  checkbox: PropTypes.bool,
  chip: PropTypes.bool,
  helperText: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};


// ----------------------------------------------------------------------


export function RHFSelectChip({
  name,
  chip,
  children,
  helperText,
  PaperPropsSx,
  ...other
}) {
  const { control } = useFormContext();

  const renderChipsOrString = (selectedValue) => {
    if (!selectedValue) return null;

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip size="small" label={selectedValue} />
        </Box>
      );
    }
    console.log('selectedValue', selectedValue)
    console.log('chip', chip)
    return selectedValue;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select={!chip} // Render select if chip prop is not true
          fullWidth
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!chip && PaperPropsSx),
                },
              },
            },
            sx: { textTransform: 'capitalize' },
            renderValue: () => renderChipsOrString(field.value),
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >{children}</TextField>
      )}
    />
  );
}

RHFSelectChip.propTypes = {
  children: PropTypes.node,
  PaperPropsSx: PropTypes.object,
  helperText: PropTypes.object,
  name: PropTypes.string,
  chip: PropTypes.bool, // New prop for rendering chips instead of select dropdown
};