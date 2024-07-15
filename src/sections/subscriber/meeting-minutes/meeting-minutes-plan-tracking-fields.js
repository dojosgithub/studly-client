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
  const { control, resetField, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plan',
  });

  const handleAdd = useCallback(() => {
    append({
      planTracking: '',
      dateRecieved: null,
      stampDate: null,
      _id: uuidv4(),
    });
  }, [append]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Tab') {
        console.log('Tab key pressed');
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

//   const handleClearService = useCallback(
//     (index) => {
//       resetField(`plan[${index}].planTracking`);
//       resetField(`plan[${index}].stampDate`);
//       resetField(`plan[${index}].dateRecieved`);
//     },
//     [resetField]
//   );

  return (
    <>
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
          Plan/Ask Tracking
        </Typography>
        <Stack gap="1.5rem">
          {fields.map(({ _id }, index) => (
            <Box
              key={_id}
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
                onBlur={() => trigger(`plan[${index}].stampDate`)}
              />
              <MeetingMinutesDatePicker
                sx={{ alignSelf: 'center' }}
                name={`plan[${index}].dateRecieved`}
                label="Date Received"
                onBlur={() => trigger(`plan[${index}].dateRecieved`)}
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
