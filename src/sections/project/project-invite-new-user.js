import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm, Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// mui
import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, MenuItem, Stack, Typography, alpha } from '@mui/material'
//
import { enqueueSnackbar } from 'notistack';
import { RHFSelect, RHFTextField } from 'src/components/hook-form'
// components
import Iconify from 'src/components/iconify'
import uuidv4 from 'src/utils/uuidv4';
import { INVOICE_SERVICE_OPTIONS, PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES, PROJECT_SHARED_PERSONS, USER_STATUS_OPTIONS } from 'src/_mock';
import FormProvider from 'src/components/hook-form/form-provider';
import ProjectInviteUserDialog from './project-invite-user-dialog';


const StyledIconButton = styled(IconButton)(({ theme }) => ({
    width: 50,
    height: 50,
    opacity: 1,
    borderRadius: '10px',
    outline: `1px solid ${alpha(theme.palette.grey[700], .2)} `,
    '&:hover': {
        opacity: 1,
        outline: `1px solid ${alpha(theme.palette.grey[700], 1)} `,

    },
}));

const ProjectInviteNewUser = ({ type = 'internal' }) => {
    const { internal, external } = useSelector(state => state.project.inviteUsers)
    const dispatch = useDispatch()
    const [openInviteUser, setOpenInviteUser] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [error, setError] = useState(false)
    const [helperText, setHelperText] = useState('')

    const InviteUserSchema = Yup.object().shape({
        // inviteUser: Yup.object().shape({
        email: Yup.string().email('Invalid email').required('User email is required'),
        role: Yup.string().required('User role is required'),
        _id: Yup.string(),
        status: Yup.string(),
        // })

    });

    const defaultValues = useMemo(() => ({
        // inviteUser: {
        email: '',
        role: '',
        _id: uuidv4(),
        status: 'invited'

        // }
    }), []);

    const methods = useForm({
        resolver: yupResolver(InviteUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = methods;

    const handleSelectRole = useCallback(
        (index, option) => {
            console.log('option', option)
            setValue(
                `role`,
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
            await new Promise((resolve) => setTimeout(resolve, 500));
            enqueueSnackbar('Update success!');

            console.log('data Final', data);
            reset();
            // dispatch(resetCreateProject())
        } catch (e) {
            console.error(e);
        }
    });
    const handleChangeInvite = useCallback((event) => {
        const email = event.target.value;
        setInviteEmail(email);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);

        if (!isValidEmail) {
            setError(true);
            setHelperText('Invalid email format');
        } else {
            setError(false);
            setHelperText('');
        }
    }, []);


    const handleSendInvite = () => {
        // Handle sending invite
        console.log('email', inviteEmail)
        setInviteEmail('')
        // snackbar
        setOpenInviteUser(false)
    };


    // const handleClearService = useCallback(
    //     (index) => {
    //         resetField(`inviteUsers.internal[${index}].name`);
    //         resetField(`inviteUsers.internal[${index}].email`);
    //         resetField(`inviteUsers.internal[${index}].role`);
    //     },
    //     [resetField]
    // );
    // const handleRemove = (index) => {
    //     remove(index);
    // };


    // // const handleDelete = (id) => {
    // //     console.log('id', id)
    // //     const filteredOutsideUsers = rows?.filter(row => row._id !== id);
    // //     console.log('filteredOutsideUsers', filteredOutsideUsers)
    // //     setRows(filteredOutsideUsers)


    // //     setValue("inviteUsers.outside", filteredOutsideUsers)


    // // }
    // // const handleAddField = () => {
    // //     const updatedOutsideUsers = [...rows, { ...currentDefaultValues, _id: uuidv4() }]
    // //     console.log('addfield updatedOutsideUsers', updatedOutsideUsers)
    // //     setRows(updatedOutsideUsers)

    // //     setValue("inviteUsers.outside", updatedOutsideUsers)

    // // }
    return (
        <>
            <Stack gap={2} rowGap={7} textAlign='center'>

                <Stack gap='1.5rem'>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Box
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <RHFSelect name='email' label="Email" InputLabelProps={{ shrink: true }}>
                                {PROJECT_INVITE_USERS_INTERNAL.map((user, index) => (
                                    <MenuItem key={user.email} value={user.email} onClick={() => handleSelectEmail(index, user.email)}>
                                        {user.email}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <RHFSelect name='role' label="Role" InputLabelProps={{ shrink: true }}>
                                {PROJECT_INVITE_USER_ROLES.map((role, index) => (
                                    <MenuItem key={role.value} value={role.value} onClick={() => handleSelectRole(index, role.value)}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <StyledIconButton color="inherit" onClick={handleSubmit(onSubmit)}>
                                <Iconify icon='mingcute:add-line' width='40px' height='40px' />
                            </StyledIconButton>
                        </Box>
                    </FormProvider>
                    <Button
                        component='button'
                        variant="outlined"
                        startIcon={<Iconify icon="mdi:invite" />}
                        color='secondary'
                        type="button"
                        onClick={() => setOpenInviteUser(true)}
                        sx={{ flexShrink: 0, maxWidth: 'max-content' }}
                    >
                        Invite User
                    </Button>

                </Stack>
            </Stack>
            <ProjectInviteUserDialog
                open={openInviteUser}
                // shared={PROJECT_SHARED_PERSONS.slice(0, 5)}
                inviteEmail={inviteEmail}
                onChangeInvite={handleChangeInvite}
                onSendInvite={handleSendInvite}
                error={error}
                helperText={helperText}
                onClose={() => {
                    console.log('close')
                    setOpenInviteUser(false)
                    setInviteEmail('')
                }}
            />
        </>

    )
}

export default ProjectInviteNewUser
ProjectInviteNewUser.propTypes = {
    type: PropTypes.string,

}
