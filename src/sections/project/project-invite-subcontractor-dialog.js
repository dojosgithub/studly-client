import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
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
import { Stack, Table, Typography } from '@mui/material';
// components
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFSelect, RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
// mock
import { PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES, SUBSCRIBER_USER_ROLE_STUDLY, USER_TYPES_STUDLY, getRoleKeyByValue } from 'src/_mock';
import { setAddExternalUser, setAddInternalUser, setInvitedSubcontractor, setMembers } from 'src/redux/slices/projectSlice';
// inviteSubcontractor, 
import CustomAutoComplete from 'src/components/custom-automcomplete';
// components


// ----------------------------------------------------------------------

export default function ProjectInviteSubcontractorDialog({
  //
  open,
  onClose,
  ...other
}) {
  // Get List of Subcontractors in DB
  const subcontractorListOptions = useSelector(state => state?.project?.subcontractors?.list?.all);

  const dispatch = useDispatch()
  const InviteUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('User email is required'),
    // user: Yup.object().shape({ email: Yup.string().email('Invalid email').required('User email is required'), id: Yup.string() }, { message: "Email is required" }),
    status: Yup.string(),
    role: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
    firstName: '',
    lastName: '',
    // user: null,
    email: '',
    role: SUBSCRIBER_USER_ROLE_STUDLY.SCO,
    status: 'invited',
    team: null
  }), []);

  const methods = useForm({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = methods;
  // const { user: userObj } = getValues;


  // const handleSelectUser = useCallback(
  //   (option) => {
  //     console.log("option", option)

  //     setValue('user', option)
  //     // setValue('email', option.email);
  //   },
  //   [setValue]
  // );


  const onSubmit = handleSubmit(async (data) => {
    try {


      console.log('data', data)
      // const { role, user, ...rest } = data;
      // const hasEmailAndId = 'email' in user && 'id' in user;
      // const finalData = {
      //   role: {
      //     name: role, shortName: getRoleKeyByValue(role), loggedInAs: USER_TYPES_STUDLY.SUB
      //   },
      //   email: user?.email,
      //   team: null,
      //   status: "invited",
      //   ...rest
      // }
      // if (hasEmailAndId) {
      //   finalData.user = data.user.id
      //   finalData.status = 'joined'
      // }
      const { role } = data;
      const finalData = {
        ...data,
        role: {
          name: role, shortName: getRoleKeyByValue(role), loggedInAs: USER_TYPES_STUDLY.SUB
        },
        team: null,
        status: "invited",
      }

      console.log('finalData', finalData)
      // ? if user id exists then the user already exist in the system we directly add in the project but if it doesn't we need to create new user first send invitation via email along with login credentials 
      //  // dispatch(setMembers(finalData))
      dispatch(setInvitedSubcontractor(finalData))
      reset()
      // // const { error, payload } = await dispatch(inviteSubcontractor(finalData))
      // // if (error) {
      //  //   enqueueSnackbar(error?.message||'There was an error sending Invite!', { variant: "error" });
      //  //   return
      //  // }
      //  // console.log('updatedData Final', updatedData);
      enqueueSnackbar('Invite sent successfully!');
      onClose()


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
            sx={{ display: 'flex', flexDirection: "column", gap: '1rem', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
          // sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
          >
            <Box
              sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
            >
              <RHFTextField name='firstName' label="First Name" InputLabelProps={{ shrink: true }} />
              <RHFTextField name='lastName' label="Last Name" InputLabelProps={{ shrink: true }} />
            </Box>

            {/* <RHFSelect name='email' label="Email" InputLabelProps={{ shrink: true }}>
              {PROJECT_INVITE_USERS_INTERNAL.map((user, index) => (
                <MenuItem key={user.email} value={user.email} onClick={() => handleSelectEmail(index, user.email)}>
                  {user.email}
                </MenuItem>
              ))}
            </RHFSelect> */}
            <Stack>
            <RHFTextField name="email" label="Email address"  />
              {/* <CustomAutoComplete listOptions={subcontractorListOptions}
                error={errors && errors.user && (errors.user.message) || (errors?.user?.email && errors?.user?.email?.message)}
                value={userObj} setValue={(val) => handleSelectUser(val)} /> */}
              {/* {errors && errors?.email?.message && <Typography color='red' fontSize=".75rem">{errors?.email?.message}</Typography>} */}
            </Stack>

          </Box>

        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <Button color="inherit"onClick={handleSubmit(onSubmit)}  variant="contained">
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
