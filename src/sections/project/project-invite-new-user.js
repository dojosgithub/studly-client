import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// mui
import { styled } from '@mui/material/styles';
import { Box, IconButton, MenuItem, Stack, TableCell, TableRow, alpha } from '@mui/material'
//
import { enqueueSnackbar } from 'notistack';
import { setAddExternalUser, setAddInternalUser } from 'src/redux/slices/projectSlice';
import FormProvider, { RHFSelect } from 'src/components/hook-form'

// components
import Iconify from 'src/components/iconify'
import uuidv4 from 'src/utils/uuidv4';
import { PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES } from 'src/_mock';


const StyledIconButton = styled(IconButton)(({ theme, variant }) => ({
    width: 50,
    height: 50,
    opacity: 1,
    borderRadius: '10px',
    outline: `1px solid ${alpha(theme.palette.grey[700], .2)} `,
    backgroundColor: variant === 'contained' ? theme.palette.secondary.main : 'transparent', // Set background color for contained variant
    color: variant === 'contained' ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary, // Set text color for contained variant
    '&:hover': {
        opacity: 1,
        backgroundColor: variant === 'contained' ? alpha(theme.palette.secondary.main, .9) : 'transparent', // Set background color for contained variant

    },
}));

const ProjectInviteNewUser = ({ type = 'internal' }) => {
    const dispatch = useDispatch()


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
        status: 'joined'

        // }
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
            const setUsersActions = type === "internal" ? setAddInternalUser : setAddExternalUser
            await new Promise((resolve) => setTimeout(resolve, 500));
            enqueueSnackbar('User added in the team successfully!');
            const updatedData = { ...data, _id: uuidv4(), }
            console.log('updatedData Final', updatedData);
            reset();
            dispatch(setUsersActions(updatedData))
        } catch (e) {
            console.error(e);
        }
    });


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

        // <Stack gap={2} rowGap={7} textAlign='center'>

        //     <Stack gap='1.5rem'>
        <TableRow>
            <TableCell colSpan="3"  variant='footer'>

                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Box
                        sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                    >
                        {/* <TableCell> */}
                        <RHFSelect name='email' label="Email" InputLabelProps={{ shrink: true }}>
                            {PROJECT_INVITE_USERS_INTERNAL.map((user, index) => (
                                <MenuItem key={user.email} value={user.email} onClick={() => handleSelectEmail(index, user.email)}>
                                    {user.email}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                        {/* </TableCell>
                <TableCell> */}
                        <RHFSelect name='role' label="Role" InputLabelProps={{ shrink: true }}>
                            {PROJECT_INVITE_USER_ROLES.map((role, index) => (
                                <MenuItem key={role.value} value={role.value} onClick={() => handleSelectRole(index, role.value)}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                        {/* </TableCell> */}
                        {/* <TableCell> */}
                        <StyledIconButton color="inherit" onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
                            <Iconify icon='flowbite:user-add-solid' width='40px' height='40px' sx={{ color: 'white' }} />
                        </StyledIconButton>
                        {/* </TableCell> */}
                    </Box>
                </FormProvider>
            </TableCell>
        </TableRow>


        //     </Stack>
        // </Stack>



    )
}

export default ProjectInviteNewUser
ProjectInviteNewUser.propTypes = {
    type: PropTypes.string,

}
