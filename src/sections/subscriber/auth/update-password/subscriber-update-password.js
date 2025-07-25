import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { setUserData, setUserTokens, updatePasswordFirstLogin } from 'src/redux/slices/userSlice';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export default function SubscriberUpdatePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user?.user?.email);
  const password = useBoolean();
  const router = useRouter();

  const ChangePassWordSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(7, 'Password must be at least 7 characters'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { firstName, lastName, newPassword } = data;
      const newData = { password: newPassword, email, firstName, lastName };
      const { error, payload } = await dispatch(updatePasswordFirstLogin(newData));
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      reset();

      //
      enqueueSnackbar('Password updated successfully!', { variant: 'success' });
      router.push(paths.subscriber.onboarding);
    } catch (error) {
      enqueueSnackbar(`Error Updating Password`, { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography fontSize={27} fontWeight="bold" mb={1} textAlign="center">
        Welcome to Studly!
      </Typography>
      <Typography fontSize={15} fontWeight="bold" mb={2} textAlign="center">
        Please set a new password.
      </Typography>
      <Stack component={Card} spacing={3} sx={{ p: 3, minWidth: { xs: '100%', sm: 400 } }}>
        <RHFTextField name="firstName" label="First Name" />
        <RHFTextField name="lastName" label="Last Name" />

        <RHFTextField
          name="newPassword"
          label="New Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum
              7+
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Confirm New Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
