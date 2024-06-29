import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
// components
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
// mock
import { PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES } from 'src/_mock';
import { setAddExternalUser, setAddInternalUser } from 'src/redux/slices/projectSlice';
// components


// ----------------------------------------------------------------------

export default function MeetingMinutesInviteAttendeeDialog({
  //
  open,
  onClose,
  type,
  ...other
}) {

  const dispatch = useDispatch()
  const InviteAttendeeSchema = Yup.object().shape({
    // inviteUser: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    company: Yup.string().required('Company is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    attended: Yup.string().required('Attended is required'),
    _id: Yup.string(),
    // })

  });

  const defaultValues = useMemo(() => ({
    name: '',
    company: '',
    email: '',
    attended: '',
    _id: uuidv4(),
  }), []);

  const methods = useForm({
    resolver: yupResolver(InviteAttendeeSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const handleSelectAttended = useCallback(
    (option) => {
      console.log('option', option)
      setValue(
        `attended`,
        option
      );
    },
    [setValue]
  );
  const handleSelectEmail = useCallback(
    (index, option) => {
      console.log('email', option)
      setValue(
        `email`,
        option
      );
    },
    [setValue]
  );


  const onSubmit = handleSubmit(async (data) => {
    try {
      const setUsersAction = type === "internal" ? setAddInternalUser : setAddExternalUser
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Invite sent successfully!');
      const updatedData = { ...data, _id: uuidv4(), }
      console.log('updatedData Final', updatedData);
      reset();
      onClose()
      dispatch(setUsersAction(updatedData))
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite Attendee</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            my={2}
          >
            <RHFTextField name="name" label="Name" InputLabelProps={{ shrink: true }} />
            <RHFTextField name="company" label="Company" InputLabelProps={{ shrink: true }} />
            <RHFTextField name="email" label="Email" InputLabelProps={{ shrink: true }} />
            <RHFSelect name='attended' label="Attended" InputLabelProps={{ shrink: true }}>
              <MenuItem value='yes' onClick={() => handleSelectAttended('yes')}>
                Yes
              </MenuItem>
              <MenuItem value='yes' onClick={() => handleSelectAttended('yes')}>
                No
              </MenuItem>
            </RHFSelect>

            {/* <RHFSelect name='email' label="Email" InputLabelProps={{ shrink: true }}>
              {PROJECT_INVITE_USERS_INTERNAL.map((user, index) => (
                <MenuItem key={user.email} value={user.email} onClick={() => handleSelectEmail(index, user.email)}>
                  {user.email}
                </MenuItem>
              ))}
            </RHFSelect> */}

          </Box>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <Button color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MeetingMinutesInviteAttendeeDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  type: PropTypes.string,
};
