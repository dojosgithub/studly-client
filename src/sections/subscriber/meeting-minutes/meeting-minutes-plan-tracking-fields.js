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


const MeetingMinutesPlanTrackingFields = () => {

    const { control, setValue, getValues, watch, resetField } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'trades',
    });

    const handleAdd = useCallback(() => {
        append({
            planTracking: '',
            dateRecieved: null,
            stampDate: null,
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
            resetField(`trades[${index}].planTracking`);
            resetField(`trades[${index}].stampDate`);
            resetField(`trades[${index}].dateRecieved`);
        },
        [resetField]
    );





    return (
        <>
            <Box sx={{ marginBottom: '2rem' }}>

                <Box
                    sx={{ display: 'grid', marginBottom: '2rem', gridTemplateColumns: 'repeat(3, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                >
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Plan Tracking</Typography>
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Stamp Date</Typography>
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Date Recieved</Typography>
                    <Typography>{" "}</Typography>

                </Box>
                <Stack gap='1.5rem'>
                    {fields && fields?.map(({ _id, name, tradeId }, index) => (
                        <Box
                            key={_id}
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >


                            <RHFTextField name={`trades[${index}].planTracking`} label="Plan Tracking" InputLabelProps={{ shrink: true }} />
                            <RHFTextField name={`trades[${index}].stampDate`} label="Stamp Date" InputLabelProps={{ shrink: true }} />
                            <RHFTextField name={`trades[${index}].dateRecieved`} label="Date Recieved" InputLabelProps={{ shrink: true }} />
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

export default MeetingMinutesPlanTrackingFields

