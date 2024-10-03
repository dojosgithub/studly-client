import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, Divider, alpha, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';

// Define the styled component for IconButton
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

// Define Yup schema for validation

export default function MeetingMinutesInviteAttendeeView({ isEdit }) {
  const { trigger, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inviteAttendee',
  });
  const mdDown = useResponsive('down', 'md');
  const handleRemoveAttendee = (index) => {
    remove(index);
  };

  return (
    <Box position="relative">
      <Box sx={{ mt: 1, mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography fontSize="1.5rem" fontWeight="bold">
          Meeting Attendees
        </Typography>
      </Box>
      <Box sx={{ padding: '6px 6px' }}>
        {fields.map((attendee, index) => (
          <Box key={attendee._id}>
            <Box
              rowGap={5}
              columnGap={4}
              display="grid"
              gridTemplateColumns={
                isEdit
                  ? { md: 'repeat(3, 1fr) 0.5fr 50px' } // Include the smaller checkbox column if isEdit is true
                  : { md: 'repeat(3, 1fr) 50px' } // Exclude the checkbox column if isEdit is false
              }
              my={3}
            >
              <RHFTextField
                name={`inviteAttendee[${index}].name`}
                label="Name"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`inviteAttendee[${index}].name`)}
              />
              <RHFTextField
                name={`inviteAttendee[${index}].company`}
                label="Company"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`inviteAttendee[${index}].company`)}
              />
              <RHFTextField
                name={`inviteAttendee[${index}].email`}
                label="Email"
                InputLabelProps={{ shrink: true }}
                onBlur={() => trigger(`inviteAttendee[${index}].email`)}
              />

              {isEdit && (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <RHFCheckbox name={`inviteAttendee[${index}].attended`} label="Attended" />
                </Box>
              )}
              {/* Remove button */}
              <StyledIconButton color="inherit" onClick={() => handleRemoveAttendee(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                {mdDown && <Typography fontWeight={700}>Remove</Typography>}
              </StyledIconButton>
            </Box>
            {index < fields.length - 1 && <Divider sx={{ my: 2, borderColor: 'grey.500' }} />}
          </Box>
        ))}

        {/* Button to add new invitee */}
        <Button
          component="button"
          variant="outlined"
          startIcon={<Iconify icon="mingcute:add-line" />}
          color="secondary"
          onClick={() => append({ name: '', company: '', email: '', attended: false })}
        >
          Add Another Attendee
        </Button>
      </Box>
    </Box>
  );
}

MeetingMinutesInviteAttendeeView.propTypes = {
  isEdit: PropTypes.bool,
};
