import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react'
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
// @mui 
import { IconButton, Grid, alpha, Box, Button } from '@mui/material'
// hook-form 
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
import Iconify from '../iconify';

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



const CustomTwoFields = () => {
    const [rows, setRows] = useState([{ fieldID: 'ID', name: 'name', id: '1' }])


    const NewUserSchema = [Yup.object().shape({
        fieldID: Yup.string().required('Field ID is required'),
        name: Yup.string().required('Name is required'),
        id: Yup.string()

    })];

    const defaultValues = useMemo(
        () => ({
            fieldID: '',
            name: '',
            id: 1
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });



    return (
        <>
            <Box sx={{ marginBottom: '2rem' }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>

                    <Grid container gap="1rem" >
                        {rows.map(({ id, fieldID, name }) => (
                            <>
                                <Grid item xs={12} md={5}>
                                    <RHFTextField name={fieldID} label={fieldID} />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <RHFTextField name={name} label={name} />
                                </Grid>
                                <Grid item>
                                    <StyledIconButton color="inherit" onClick={() => console.log("delete")}>
                                        <Iconify icon='ic:sharp-remove-circle-outline' width='40px' height='40px' />
                                    </StyledIconButton>
                                </Grid>
                            </>
                        )
                        )}
                    </Grid >

                </FormProvider>
            </Box>

            <Button
                component='button'
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color='secondary'
            >
                Add Another Trade
            </Button>
        </>
    )
}

export default CustomTwoFields