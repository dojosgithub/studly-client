import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { isEmpty } from 'lodash';
import { styled } from '@mui/material/styles';
import { IconButton, Grid, alpha, Box, Button, Stack, Typography, Container } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

// components
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import Iconify from 'src/components/iconify';
import { createNewTemplate, getTemplateList, setCurrentTemplate } from 'src/redux/slices/templateSlice';


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

const NewTemplateSchema = Yup.object().shape({
    name: Yup.string().required('Template Name is required').min(3, "Template name should be atleast three charachters long"),
    trades: Yup.array()
        .of(
            Yup.object().shape({
                // tradeId: Yup.string().required('Trade ID is required'),
                tradeId: Yup.string()
                    .matches(/^[0-9.-]+$/, 'Trade id must contain only numeric characters, dots, and hyphens')
                    .required('Trade id is required'),
                name: Yup.string().required('Trade Name is required'),
                _id: Yup.string()
            })
        )
        .min(1, 'At least one trade is required'),


});

const tradesDefaultVal = [{
    name: '',
    tradeId: '',
    _id: uuidv4(),
}]


const ProjectNewTemplateDrawer = ({ onClose }) => {

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const defaultValues = useMemo(
        () => ({
            name: '',
            trades: tradesDefaultVal,
        }),
        []
    );
    // const [rows, setRows] = useState(tradesDefaultVal)
    // const values = watch();



    // const currentDefaultValues = {
    //     name: '',
    //     tradeId: '',
    //     // _id: uuidv4(),
    // }

    const methods = useForm({
        resolver: yupResolver(NewTemplateSchema),
        defaultValues
    });

    const {
        reset,
        watch,
        control,
        setValue,
        getValues,
        handleSubmit,
        resetField,
        formState: { isSubmitting },
        trigger
    } = methods;
    const { trades } = getValues()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'trades',
    });

    const handleAdd = () => {
        append({
            name: '',
            tradeId: '',
            _id: uuidv4(),
        });
    };

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

    const onSubmit = handleSubmit(async (data) => {
        try {
            // setRows(tradesDefaultVal)
            console.info('DATA', data);
            const updatedTrades = data?.trades?.map(({ _id, ...rest }) => rest);
            console.info('updatedTrades', updatedTrades);
            const { error, payload } = await dispatch(createNewTemplate({ ...data, trades: updatedTrades }))
            console.log('e-p', { error, payload });
            if (!isEmpty(error)) {
                enqueueSnackbar(error.message, { variant: "error" });
                return
            }
            enqueueSnackbar('Template created successfully!', { variant: 'success' });
            dispatch(getTemplateList())
            dispatch(setCurrentTemplate(payload))
            reset();
            onClose()
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Error creating Template!', { variant: 'error' });

        }
    });


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
        <Container>
            <Box sx={{ paddingBlock: '2rem' }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Stack gap='1.5rem'>
                        <Stack gap='.5rem'>
                            <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Template Name</Typography>
                            <RHFTextField name="name" label="" />
                        </Stack>
                        <Box
                            sx={{ display: 'grid', marginBottom: '-1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>ID</Typography>
                            <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Name</Typography>
                            <Typography>{" "}</Typography>

                        </Box>
                        {fields && fields?.map(({ _id, name, tradeId }, index) => (
                            <Box
                                key={_id}
                                sx={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr) 50px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                            >
                                <RHFTextField name={`trades[${index}].tradeId`} placeholder='Trade ID'  />
                                <RHFTextField name={`trades[${index}].name`} placeholder='Trade Name' />
                                <StyledIconButton color="inherit" onClick={() => handleRemove(index)}>
                                    <Iconify icon='ic:sharp-remove-circle-outline' width='40px' height='40px' />
                                </StyledIconButton>
                            </Box>

                        ))}
                        <Box>
                            <Button
                                component='button'
                                variant="outlined"
                                startIcon={<Iconify icon="mingcute:add-line" />}
                                color='secondary'
                                onClick={handleAdd}
                            >
                                Add Another Trade
                            </Button>
                        </Box>
                        <Box alignSelf='flex-end'>
                            <LoadingButton type="submit" variant="contained" size='large' loading={isSubmitting} sx={{ mt: 2, minWidth: 140 }}>
                                Create
                            </LoadingButton>
                        </Box>
                    </Stack>

                </FormProvider>
            </Box>

        </Container>
    )
}

export default ProjectNewTemplateDrawer

ProjectNewTemplateDrawer.propTypes = {
    onClose: PropTypes.func,

};