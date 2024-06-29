import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form';
import { styled } from '@mui/material/styles';
// @mui 
import { IconButton, alpha, Box, Button, Stack, Typography } from '@mui/material'


// hook-form 
import {
    RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import Iconify from 'src/components/iconify';
import MeetingMinutesDatePicker from './meeting-minutes-date-picker';


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


const MeetingMinutesPermitFields = () => {

    const { control, setValue, getValues, watch, resetField } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'trades',
    });

    const handleAdd = useCallback(() => {
        append({
            status: '',
            permitNumber: '',
            date: null,
            _id: uuidv4(),
        });
    }, [append]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Tab') {
                console.log('Tab key pressed');

                handleAdd();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleAdd]);

    const values = watch();




    const handleRemove = (index) => {
        remove(index);
    };

    const handleClearService = useCallback(
        (index) => {
            resetField(`trades[${index}].status`);
            resetField(`trades[${index}].date`);
            resetField(`trades[${index}].permitNumber`);
        },
        [resetField]
    );





    return (
        <>
            <Box sx={{ marginBottom: '2rem' }}>
            <Typography sx={{ mt: 2,mb:4 }} fontSize='1.5rem' fontWeight='bold'>Permit</Typography>

                {/* <Box
                    sx={{ display: 'grid', marginBottom: '2rem', gridTemplateColumns: 'repeat(3, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                >
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Permit Status</Typography>
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Date</Typography>
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Permit Number</Typography>
                    <Typography>{" "}</Typography>

                </Box> */}
                <Stack gap='1.5rem'>
                    {fields && fields?.map(({ _id, name, tradeId }, index) => (
                        <Box
                            key={_id}
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >


                            <RHFTextField name={`trades[${index}].status`} label="Permit Status" InputLabelProps={{ shrink: true }} />
                            <MeetingMinutesDatePicker name={`trades[${index}].date`} label='Date'/>
                            <RHFTextField name={`trades[${index}].permitNumber`} label="Permit Number" InputLabelProps={{ shrink: true }} />
                            <StyledIconButton color="inherit" onClick={() => handleRemove(index)}>
                                <Iconify icon='ic:sharp-remove-circle-outline' width='40px' height='40px' />
                            </StyledIconButton>
                        </Box>

                    ))}
                </Stack>

            </Box >

            <Button
                component='button'
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color='secondary'
                onClick={handleAdd}
            >
                Add Another Trade
            </Button>
        </>
    )
}

export default MeetingMinutesPermitFields

