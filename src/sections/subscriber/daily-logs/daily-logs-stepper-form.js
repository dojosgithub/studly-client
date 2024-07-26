import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import CreateDailyLog from './daily-logs-create'; // Adjust this import based on your project structure

const DailyLogsStepperForm = () => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { create: DailyLogs } = useSelector((state) => state.dailyLogs);

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%', p: 2 }}>
        <CreateDailyLog />
      </Box>
    </FormProvider>
  );
};

export default DailyLogsStepperForm;
