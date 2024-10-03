import PropTypes from 'prop-types';
import React from 'react';
import { Box, Stack } from '@mui/material';
import DailyLogsStepperForm from '../daily-logs-stepper-form';

const DailyLogsStepperView = ({ isEdit = false }) => (
 
      <DailyLogsStepperForm isEdit={isEdit} />
   

);

export default DailyLogsStepperView;

DailyLogsStepperView.propTypes = {
  isEdit: PropTypes.bool,
};
