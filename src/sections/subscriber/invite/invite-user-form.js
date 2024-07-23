import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Box, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
// 
import { useParams } from 'react-router';
import { useSnackbar } from 'src/components/snackbar';
//
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { sendInviteUserCredentials } from 'src/redux/slices/inviteSlice';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function InviteUserForm() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()
    const params = useParams();
    const password = useBoolean();
    const router = useRouter();

    const NewUserSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        password: Yup.string()
            .required('New Password is required')
            .min(7, 'Password must be at least 7 characters')

    });

    const defaultValues = useMemo(
        () => ({
            firstName: '',
            lastName: '',
            password: '',
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {

            const { error, payload } = await dispatch(sendInviteUserCredentials({ inviteId: params?.inviteId, ...data }))
            if (!isEmpty(error)) {
                enqueueSnackbar(error.message, { variant: "error" });
                return
            }
            enqueueSnackbar('User invite has been accepted successfully!', { variant: 'success' });
            reset();
            router.push(paths.auth.jwt.login);

        } catch (error) {
            console.error(error);
        }
    });

    return (

        <FormProvider methods={methods} onSubmit={onSubmit}>

            <Stack py='1rem' gap={3} maxWidth={400} mx="auto">
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <RHFTextField name="firstName" label="First name" />
                    <RHFTextField name="lastName" label="Last name" />
                </Box>
                <RHFTextField
                    name="password"
                    label="Password"
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

                <Box>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Submit
                    </LoadingButton>
                </Box>
            </Stack>

        </FormProvider>
    );
}


