import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, Divider, alpha, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack'; // Import useSnackbar hook
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import uuidv4 from 'src/utils/uuidv4';
// import {
//   setMeetingMinutesInviteAttendee,
//   setMeetingMinutesDescription,
//   setMeetingMinutesNotes,
//   setMeetingMinutesPermit,
//   setMeetingMinutesPlanTracking,
// } from 'src/redux/slices/meetingMinutesSlice'; // Import actions accordingly
import Iconify from 'src/components/iconify';

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
}));

// Define Yup schema for validation

const inviteAttendeeSchema = Yup.object().shape({
  attendees: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      company: Yup.string().required('Company is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      attended: Yup.boolean(),
    })
  ),
});

export default function MeetingMinutesInviteAttendeeView() {
  const dispatch = useDispatch();
  // const { trigger } = useFormContext();
  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar hook

  // Initialize useForm from react-hook-form
  // const methods = useForm({
  //   resolver: yupResolver(inviteAttendeeSchema),
  //   defaultValues: {
  //     attendees: [{name: '', company: '', email: '', attended: false}],
  //   },
  // });

  // const { handleSubmit, control, reset } = methods;
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'attendees',
  // });

  const { trigger, control, setValue, getValues, watch, resetField } = useFormContext();
  const { notes } = getValues();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inviteAttendee',
  });
  // console.log('notes',notes)

  // Handle removing an attendee
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
              columnGap={3}
              display="grid"
              gridTemplateColumns="repeat(3, 1fr) 50px" // Set columns to 3 equal parts and a fixed size for the button
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
              {/* Remove button */}
              <StyledIconButton color="inherit" onClick={() => handleRemoveAttendee(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
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
          onClick={() =>
            // append({ name: '', company: '', email: '', _id: uuidv4(), attended: false })
            append({ name: '', company: '', email: '', attended: false })
          }
        >
          Add Another Attendee
        </Button>
      </Box>
    </Box>
  );
}
