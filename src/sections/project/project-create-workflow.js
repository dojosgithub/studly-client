import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types';

// hook-form
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Button, Container } from '@mui/material'
import { addDays } from 'date-fns';

// mock
import format from 'date-fns/format';
import { PROJECT_STATUS_TREE } from 'src/_mock'
//
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';
//
import OrganizationalChart from 'src/components/organizational-chart/organizational-chart'
import Scrollbar from 'src/components/scrollbar'
import { KanbanView } from '../kanban/view'


const ProjectCreateWorkflow = ({ type, onClose }) => {


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
    const formValues = getValues();
    console.log('formValues', formValues)
    console.log('isValid', isValid)
    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            onClose()
            console.log('data', data);
            // console.log('JSON DATA', JSON.stringify(data));
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
                    my={3}
                    display="flex"
                    flexDirection="column"
                >
                    <RHFTextField name="name" label="Project Name" />
                    <Scrollbar sx={{ 'py': 4 }}>
                        {/* <OrganizationalChart data={PROJECT_STATUS_TREE} variant='simple' /> */}
                        <KanbanView />
                    </Scrollbar>




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
