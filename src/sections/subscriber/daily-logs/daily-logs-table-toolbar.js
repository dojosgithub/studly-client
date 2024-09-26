import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DailyLogsTableToolbar({
  filters,
  onFilters,
  //
  roleOptions,
}) {
  const [inputValue, setInputValue] = useState('');

  // Debounce the call to onFilters
  const debouncedOnFilters = debounce((query) => {
    onFilters('query', query);
  }, 1000);

  useEffect(() => {
    // Call the debounced function in the effect whenever inputValue changes
    debouncedOnFilters(inputValue);

    // Cleanup function to cancel the debounce on component unmount or before re-running the effect
    return () => debouncedOnFilters.cancel();
  }, [inputValue, debouncedOnFilters]);

  // Event handler for input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}

DailyLogsTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
