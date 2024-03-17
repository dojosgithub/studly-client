import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';

// hook-form
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDays } from 'date-fns';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Button, Container } from '@mui/material'
//
import { useSnackbar } from 'notistack';
// mock
import format from 'date-fns/format';
import { PROJECT_STATUS_TREE } from 'src/_mock'
//
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
//
import OrganizationalChart from 'src/components/organizational-chart/organizational-chart'
import { createNewWorkflow, getWorkflowList, setCurrentWorkflow } from 'src/redux/slices/workflowSlice';
import Scrollbar from 'src/components/scrollbar'
import { KanbanView } from '../kanban/view'


const ProjectCreateWorkflow = ({ type, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();


    const ProjectSchema = Yup.object().shape({
        name: Yup.string().required('Workflow Name is required'),
        statuses: Yup.array().min(1, 'At least one status is required'),
        returnDate: Yup.date().min(addDays(new Date(), 1)),


    });



    const defaultValues = useMemo(
        () => ({
            name: '',
            statuses: [],
            returnDate: null,
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(ProjectSchema),
        defaultValues,
    });

    const {
        reset,
        control, watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting, isValid },
        trigger
    } = methods;
    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log('data', data);
            const statuses = data?.statuses?.map(object => object.name);
            console.log('statuses', statuses);
            const { error, payload } = await dispatch(createNewWorkflow({ ...data, statuses }))
            console.log('e-p', { error, payload });
            if (!isEmpty(error)) {
                enqueueSnackbar(error.message, { variant: "error" });
                return
            }
            console.log('payload', payload);
            enqueueSnackbar('Workflow created successfully!', { variant: 'success' });
            dispatch(getWorkflowList())
            dispatch(setCurrentWorkflow(payload))

            onClose()
            reset();

        } catch (error) {
            console.error(error);
        }
    });


    return (
        <Container>


            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Box
                    rowGap={4}
                    columnGap={2}
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    my={2}
                    display="flex"
                    flexDirection="column"
                >
                    <Box sx={{ display: 'flex', gap: 4, px: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        <RHFTextField name="name" label="Workflow Name" />
                        <Controller
                            name="returnDate"
                            control={control}
                            defaultValue={new Date()}
                            render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                    label="Select Return Date"
                                    views={['day', 'month', 'year']}
                                    value={field.value || null}
                                    minDate={addDays(new Date(), 1)}
                                    onChange={(date) => field.onChange(date)}
                                    error={!!error}
                                    helperText={error && error?.message}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!error,
                                            helperText: error?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <Scrollbar sx={{ 'py': 4, maxHeight: 360 }}>
                        {/* <OrganizationalChart data={PROJECT_STATUS_TREE} variant='simple' /> */}
                        <KanbanView />
                    </Scrollbar>





                    <Button type="submit" variant='contained' >Create</Button>

                </Box>
            </FormProvider>
        </Container >
    )
}

export default ProjectCreateWorkflow

ProjectCreateWorkflow.propTypes = {
    onClose: PropTypes.func,
    type: PropTypes.string,
};
