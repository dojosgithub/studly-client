import PropTypes from 'prop-types';
import React from 'react';
import { Box, Stack } from '@mui/material';
import MeetingMinutesStepperForm from '../meeting-minutes-stepper-form';

const MeetingMinutesStepperView = ({ isEdit = false }) => (
  <Box sx={{ my: 0, flex: 1 }}>
    <Stack spacing={7} direction="row" height="100%">
      <MeetingMinutesStepperForm isEdit = {isEdit} />
    </Stack>
  </Box>
);

export default MeetingMinutesStepperView;

MeetingMinutesStepperView.propTypes = {
  isEdit: PropTypes.bool,
};
