import React, { useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { IconButton, alpha, Box, Button, Stack, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import uuidv4 from 'src/utils/uuidv4';
import Iconify from 'src/components/iconify';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 50,
  height: 50,
  opacity: 1,
  borderRadius: '10px',
  outline: `1px solid ${alpha(theme.palette.grey[700], 0.2)}`,
  '&:hover': {
    opacity: 1,
    outline: `1px solid ${alpha(theme.palette.grey[700], 1)}`,
  },
}));

const MeetingMinutesPlanTrackingFields = () => {
  const { control, resetField, trigger, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plan',
  });

  const handleAdd = useCallback(() => {
    append({
      planTracking: '',
      dateRecieved: null, // Set default date to current date
      stampDate: null, // Set default date to current date
      // _id: uuidv4(),
    });
  }, [append]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Tab') {
        handleAdd();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleAdd]);

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
          Plan/Ask Tracking
        </Typography>
        <Stack gap="1.5rem">
          {fields.map(({ id }, index) => (
            <Box
              key={id}
              sx={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(3, 1fr) 50px',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <RHFTextField
                name={`plan[${index}].planTracking`}
                label="Plan Tracking"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`plan[${index}].planTracking`)}
              />
              <MeetingMinutesDatePicker
                sx={{ alignSelf: 'center' }}
                name={`plan[${index}].stampDate`}
                label="Stamp Date"
                value={watch(`plan[${index}].stampDate`)}
                onChange={(newValue) => setValue(`plan[${index}].stampDate`, newValue)}
                onBlur={() => trigger(`plan[${index}].stampDate`)}
                disableFuture
              />
              <MeetingMinutesDatePicker
                sx={{ alignSelf: 'center' }}
                name={`plan[${index}].dateRecieved`}
                label="Date Received"
                value={watch(`plan[${index}].dateRecieved`)}
                onChange={(newValue) => setValue(`plan[${index}].dateRecieved`, newValue)}
                onBlur={() => trigger(`plan[${index}].dateRecieved`)}
                disableFuture
              />
              <StyledIconButton color="inherit" onClick={() => handleRemove(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
              </StyledIconButton>
            </Box>
          ))}
        </Stack>
      </Box>

      <Button
        component="button"
        variant="outlined"
        startIcon={<Iconify icon="mingcute:add-line" />}
        color="secondary"
        onClick={handleAdd}
        style={{ marginBottom: '20px' }} // Adjust the value as needed
      >
        Add Another Plan
      </Button>
    </>
  );
};

export default MeetingMinutesPlanTrackingFields;
