import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import { Menu } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from 'src/components/iconify';
import { getRFILogPDF } from 'src/redux/slices/rfiSlice';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';

// ----------------------------------------------------------------------

export default function RfiTableToolbar({
  filters,
  onFilters,
  //
  roleOptions,
}) {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters(
        'status',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

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

  const handleDownloadReport = async (e) => {
    handleClose();
    setIsLoading(true);
    await dispatch(getRFILogPDF(e));
    setIsLoading(false);
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

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Status</InputLabel>

        <Select
          multiple
          value={filters.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {roleOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.status.includes(option)} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LoadingButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        type="button"
        variant="contained"
        loading={isLoading}
        sx={{ ml: 'auto', width: { xs: '100%', md: 'auto' } }}
        disabled={
          !(
            userRole?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
            userRole?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU
          )
        }
      >
        <Iconify icon="solar:export-bold" style={{ height: '2rem', width: '3rem' }} />
        Export
      </LoadingButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleDownloadReport('pdf')}>Export As PDF</MenuItem>
        <MenuItem onClick={() => handleDownloadReport('csv')}>Export As CSV</MenuItem>
      </Menu>
    </Stack>
  );
}

RfiTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
};
