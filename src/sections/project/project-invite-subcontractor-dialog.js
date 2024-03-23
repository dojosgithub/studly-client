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
  RHFSelect, RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
// mock
import { PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES } from 'src/_mock';
import { setAddExternalUser, setAddInternalUser } from 'src/redux/slices/projectSlice';
// components


// ----------------------------------------------------------------------

export default function ProjectInviteSubcontractorDialog({
  //
  open,
  onClose,
  ...other
}) {

  const dispatch = useDispatch()
  const InviteUserSchema = Yup.object().shape({
    name: Yup.string().required('User email is required'),
    email: Yup.string().email('Invalid email').required('User email is required'),
    status: Yup.string(),
    role: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
    name: '',
    email: '',
    role: 'Sub Contractor',
    status: 'invited'
  }), []);

  const methods = useForm({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

//   const handleSelectRole = useCallback(
//     (index, option) => {
//       console.log('option', option)
//       setValue(
//         `role`,
//         option
//       );
//     },
//     [setValue]
//   );
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
    
      enqueueSnackbar('Invite sent successfully!');
      const updatedData = { ...data, _id: uuidv4(), }
      console.log('updatedData Final', updatedData);
      reset();
      onClose()
    //   dispatch(setSubcontractor(updatedData))
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{ display: 'flex', gap: '1rem', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
          >
            <RHFTextField name='name' label="Name" InputLabelProps={{ shrink: true }}/>
            <RHFSelect name='email' label="Email" InputLabelProps={{ shrink: true }}>
              {PROJECT_INVITE_USERS_INTERNAL.map((user, index) => (
                <MenuItem key={user.email} value={user.email} onClick={() => handleSelectEmail(index, user.email)}>
                  {user.email}
                </MenuItem>
              ))}
            </RHFSelect>
            {/* <RHFSelect name='role' label="Role" InputLabelProps={{ shrink: true }}>
              {PROJECT_INVITE_USER_ROLES.map((role, index) => (
                <MenuItem key={role.value} value={role.value} onClick={() => handleSelectRole(index, role.value)}>
                  {role.label}
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
          Invite Subcontractor
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProjectInviteSubcontractorDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
