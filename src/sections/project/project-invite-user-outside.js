import React, { useCallback, useState } from 'react'
// mui
import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, MenuItem, Stack, Typography, alpha } from '@mui/material'
//
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form'
// components
import Iconify from 'src/components/iconify'
import uuidv4 from 'src/utils/uuidv4';
import { INVOICE_SERVICE_OPTIONS, PROJECT_INVITE_USER_ROLES, USER_STATUS_OPTIONS } from 'src/_mock';


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
const currentDefaultValues = {
    name: '',
    status: '',
    email: '',
    _id: uuidv4(),
}
const ProjectInviteUserOutside = () => {
    // const { getValues, setValue } = useFormContext();
    // const formValues = getValues()
    // console.log('formValues-->', formValues)

    // const { inviteUsers: { outside } } = getValues()
    // const [rows, setRows] = useState([currentDefaultValues])
    const { control, setValue, getValues, watch, resetField } = useFormContext();
    const { inviteUsers: { outside } } = getValues()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'inviteUsers.outside',
    });
    const values = watch();
    console.log('values', values.inviteUsers.outside)
    console.log('fields', fields)

    const handleAdd = () => {
        append({
            name: '',
            role: '',
            email: '',
            _id: uuidv4(),
        });
    };

    const handleRemove = (index) => {
        remove(index);
    };

    const handleClearService = useCallback(
        (index) => {
            resetField(`inviteUsers.outside[${index}].name`);
            resetField(`inviteUsers.outside[${index}].email`);
            resetField(`inviteUsers.outside[${index}].role`);
        },
        [resetField]
    );

    const handleSelectRole = useCallback(
        (index, option) => {
            console.log('option', option)
            setValue(
                `inviteUsers.outside[${index}].role`,
                outside?.find((user) => user.role === option)?.role
            );
        },
        [setValue, outside]
    );

    // const handleDelete = (id) => {
    //     console.log('id', id)
    //     const filteredOutsideUsers = rows?.filter(row => row._id !== id);
    //     console.log('filteredOutsideUsers', filteredOutsideUsers)
    //     setRows(filteredOutsideUsers)


    //     setValue("inviteUsers.outside", filteredOutsideUsers)


    // }
    // const handleAddField = () => {
    //     const updatedOutsideUsers = [...rows, { ...currentDefaultValues, _id: uuidv4() }]
    //     console.log('addfield updatedOutsideUsers', updatedOutsideUsers)
    //     setRows(updatedOutsideUsers)

    //     setValue("inviteUsers.outside", updatedOutsideUsers)

    // }
    return (
        <Stack gap={2} rowGap={7} textAlign='center'>
            {/* <Typography sx={{ mb: 4, }} fontSize='1.5rem' fontWeight='bold'>Invite users from outside</Typography> */}
            {/* <Typography sx={{ mb: 4, maxWidth: 300, mx: 'auto', color: (theme) => alpha(theme.palette.grey[500], 0.7) }} fontSize='1rem' fontWeight='normal'>Permissions of internal team members can vary depending on their role</Typography> */}
            <Stack gap='1.5rem'>
                {fields.length > 0 && fields?.map(({ _id }, index) => (
                    <Box
                        key={_id}
                        sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                    >
                        <RHFTextField name={`inviteUsers.outside[${index}].name`} label="Name" InputLabelProps={{ shrink: true }} />
                        <RHFTextField name={`inviteUsers.outside[${index}].email`} label="Email" InputLabelProps={{ shrink: true }} />
                        <RHFSelect name={`inviteUsers.outside[${index}].role`} label="Role" InputLabelProps={{ shrink: true }}>
                            {PROJECT_INVITE_USER_ROLES.map((role) => (
                                <MenuItem key={role.value} value={role.value} onClick={() => handleSelectRole(index, role.value)}>
                                    {role.label}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                        <StyledIconButton color="inherit" onClick={() => handleRemove(index)}>
                            <Iconify icon='ic:sharp-remove-circle-outline' width='40px' height='40px' />
                        </StyledIconButton>
                    </Box>

                ))}
            </Stack>
            <Button
                component='button'
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color='secondary'
                onClick={handleAdd}
                sx={{ flexShrink: 0, maxWidth: 'max-content' }}
            >
                Add Another Trade
            </Button>
        </Stack>
    )
}

export default ProjectInviteUserOutside