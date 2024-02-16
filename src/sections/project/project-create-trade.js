import React, { useMemo, useState } from 'react'
import * as Yup from 'yup';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
// @mui 
import { IconButton, Grid, alpha, Box, Button, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import ProjectTemplateName from 'src/sections/project/project-template-name-dialog';


// hook-form 
import FormProvider, {
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




// const NewTradeSchema = Yup.object().shape({
//     trades: Yup.array()
//         .of(
//             Yup.object().shape({
//                 tradeId: Yup.string().required('Trade ID is required'),
//                 name: Yup.string().required('Trade Name is required'),
//                 _id: Yup.string()
//             })
//         )
//         .min(1, 'At least one trade is required'),

// })


const ProjectCreateTrade = () => {
    // const { trades } = useFormContext().getValues();
    // const [open, setOpen] = useState(false)
    const { getValues, setValue } = useFormContext();
    const { trades } = getValues()
    const [rows, setRows] = useState(trades)
    console.log('trades:', trades)

    const currentDefaultValues = {
        name: '',
        tradeId: '',
        _id: uuidv4(),
    }
    // const defaultValues = {
    //     trades:[
    //         { ...currentDefaultValues }
    //     ]
    // }
    // const methods = useForm({
    //     resolver: yupResolver(NewTradeSchema),
    //     defaultValues
    // });

    // const {
    //     reset,
    //     watch,
    //     control,
    //     setValue,
    //     getValues,
    //     handleSubmit,
    //     formState: { isSubmitting },
    // } = methods;

    // const values = watch();
    // const formValues = getValues();
    // console.info('formValues', formValues);

    // const onSubmit = handleSubmit(async (data) => {
    //     try {
    //         console.info('DATA', data);
    //         console.info('values inside', values);
    //         setOpen(true)
    //         await new Promise((resolve) => setTimeout(resolve, 500));
    //         reset();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });

    const handleDelete = (id) => {
        console.log('id', id)
        const filteredTrades = trades?.filter(row => row._id !== id);
        console.log('filteredTrades', filteredTrades)
        setRows(filteredTrades )

        setValue("trades", filteredTrades)


    }
    const handleAddField = () => {
        const updatedTrades = [...trades, { ...currentDefaultValues, _id: uuidv4() }]
        console.log('addfield updatedTrades', updatedTrades)
        setRows(updatedTrades)
        setValue("trades", updatedTrades)

    }



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
                {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
                <Stack gap='1.5rem'>
                    {rows && rows?.map(({ _id, name, tradeId }, index) => (
                        <Box
                            key={_id}
                            sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <RHFTextField name={`trades[${index}].tradeId`} placeholder='Trade ID' />
                            <RHFTextField name={`trades[${index}].name`} placeholder='Trade Name' />
                            <StyledIconButton color="inherit" onClick={() => handleDelete(_id)}>
                                <Iconify icon='ic:sharp-remove-circle-outline' width='40px' height='40px' />
                            </StyledIconButton>
                        </Box>

                    ))}
                </Stack>
                {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 2 }}>
                        Submit
                    </LoadingButton> */}
                {/* </FormProvider> */}
            </Box >

            <Button
                component='button'
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color='secondary'
                onClick={handleAddField}
            >
                Add Another Trade
            </Button>
            {/* <ProjectTemplateName title='asvs' open={open} onClose={() => setOpen(false)} /> */}
        </>
    )
}

export default ProjectCreateTrade

