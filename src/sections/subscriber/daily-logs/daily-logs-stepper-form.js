import React from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import CreateDailyLog from './daily-logs-create'; // Adjust this import based on your project structure

const DailyLogsStepperForm = ({ isEdit }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { create: DailyLogs } = useSelector((state) => state.dailyLogs);

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', p: 2 }}>
        <CreateDailyLog isEdit={isEdit} />
        {/* {console.log('hehehe', isEdit)} */}
      </Box>
    </FormProvider>
  );
};

DailyLogsStepperForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default DailyLogsStepperForm;
