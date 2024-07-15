import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import uuidv4 from 'src/utils/uuidv4';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 50,
  height: 50,
  opacity: 1,
  borderRadius: '10px',
  outline: `1px solid ${theme.palette.grey[700]} .2`,
  '&:hover': {
    opacity: 1,
    outline: `1px solid ${theme.palette.grey[700]} 1`,
  },
}));

const MeetingMinutesPermitFields = () => {
  const { control, setValue, getValues, watch, resetField,trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permit',
  });

  const handleAdd = useCallback(() => {
    append({
      status: '',
      permitNumber: '',
      date: null,
      _id: uuidv4(),
    });
  }, [append]);

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`permit[${index}].status`);
      resetField(`permit[${index}].date`);
      resetField(`permit[${index}].permitNumber`);
    },
    [resetField]
  );

  return (
    <>
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
          Permit
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
                name={`permit[${index}].status`}
                label="Permit Status"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`permit[${index}].status`)}
              />
              <MeetingMinutesDatePicker name={`permit[${index}].date`} label="Date" />
              <RHFTextField
                name={`permit[${index}].permitNumber`}
                label="Permit Number"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`permit[${index}].permitNumber`)}
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
      >
        Add Another Permit
      </Button>
    </>
  );
};

export default MeetingMinutesPermitFields;
