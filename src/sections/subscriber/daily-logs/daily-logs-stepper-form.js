import React from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import DailyLogsNewEditForm from './daily-logs-new-edit-form'; // Adjust this import based on your project structure

const DailyLogsStepperForm = ({ isEdit }) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', p: 2 }}>
        <DailyLogsNewEditForm isEdit={isEdit} />
      </Box>
    </FormProvider>
  );
};

DailyLogsStepperForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default DailyLogsStepperForm;
