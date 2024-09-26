import PropTypes from 'prop-types';
import React from 'react';
import { Box, Stack } from '@mui/material';
import DailyLogsStepperForm from '../daily-logs-stepper-form';

const DailyLogsStepperView = ({ isEdit = false }) => (
  <Box sx={{ my: 0, flex: 1 }}>
    <Stack spacing={7} direction="row" height="100%">
      <DailyLogsStepperForm isEdit={isEdit} />
    </Stack>
  </Box>
);

export default DailyLogsStepperView;

DailyLogsStepperView.propTypes = {
  isEdit: PropTypes.bool,
};
