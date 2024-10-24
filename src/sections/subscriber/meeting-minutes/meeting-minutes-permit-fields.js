import { Box, Button, IconButton, Stack, Typography, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { RHFTextField } from 'src/components/hook-form';
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
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 50,
    gap: '.5rem',
  },
}));

const MeetingMinutesPermitFields = () => {
  const mdDown = useResponsive('down', 'md');

  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'permit',
  });

  const handleAdd = useCallback(() => {
    append({
      status: '',
      permitNumber: '',
      date: null,
    });
  }, [append]);

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <Box sx={{ marginBottom: '2rem' }}>
        <Typography sx={{ mt: 2, mb: 4 }} fontSize="1.5rem" fontWeight="bold">
          Permit
        </Typography>
        <Stack gap="1.5rem">
          {fields.map(({ id }, index) => (
            <Box
              key={id}
              sx={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: { md: 'repeat(3, 1fr) 50px' },
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
                {mdDown && <Typography fontWeight={700}>Remove</Typography>}
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
