import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

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




const ProjectExistingTrade = () => {

    // const [open, setOpen] = useState(false)
    // const { getValues, setValue } = useFormContext();
    // const { trades } = getValues()
    // const [rows, setRows] = useState(trades)

    const currentTemplate = useSelector(state => state.template.current);
    // const currentProjectTrades = useSelector(state => state.project?.create?.trades);

    const { control, setValue, getValues, watch, resetField } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'trades',
    });
    // const { trades } = getValues()
    // const [rows, setRows] = useState(trades)
   
    // useEffect(() => {
    //     console.log("template changed->", currentProjectTrades)
    //     setValue('trades', currentProjectTrades)
    // }, [currentProjectTrades, setValue])

useEffect(() => {
    console.log('FIELDS-->',fields)

}, [fields])


    const values = watch();


    // const handleAdd = () => {
    //     append({
    //         name: '',
    //         tradeId: '',
    //         _id: uuidv4(),
    //     });
    // };
    const handleAdd = useCallback(() => {
        append({
            name: '',
            tradeId: '',
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

    const handleRemove = (index) => {
        remove(index);
    };

    const handleClearService = useCallback(
        (index) => {
            resetField(`trades[${index}].name`);
            resetField(`trades[${index}].tradeId`);
        },
        [resetField]
    );



    // useEffect(() => {
    //     console.log('useEffect trades', trades)
    //     setRows(trades)
    // }, [trades])



    // const currentDefaultValues = {
    //     name: '',
    //     tradeId: '',
    //     _id: uuidv4(),
    // }

    // const handleDelete = (id) => {
    //     console.log('id', id)
    //     const filteredTrades = trades?.filter(row => row._id !== id);
    //     console.log('filteredTrades', filteredTrades)
    //     setRows(filteredTrades)

    //     setValue("trades", filteredTrades)


    // }
    // const handleAddField = () => {
    //     const updatedTrades = [...trades, { ...currentDefaultValues, _id: uuidv4() }]
    //     console.log('addfield updatedTrades', updatedTrades)
    //     setRows(updatedTrades)

    //     setValue("trades", updatedTrades)

    // }



    return (
        <>
            <Box sx={{ marginBottom: '2rem' }}>

                <Box
                    sx={{ display: 'grid', marginBottom: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                >
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>ID</Typography>
                    <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Name</Typography>
                    <Typography>{" "}</Typography>

                </Box>
                <Stack gap='1.5rem'>
                    {fields && fields?.map(({ _id, name, tradeId }, index) => (
                        <Box
                            key={_id}
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <RHFTextField name={`trades[${index}].tradeId`} label="Trade Id" InputLabelProps={{ shrink: true }} />
                            <RHFTextField name={`trades[${index}].name`} label="Trade Name" InputLabelProps={{ shrink: true }} />
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

export default ProjectExistingTrade


