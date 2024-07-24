import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { cloneDeep, isEmpty } from 'lodash';
// hook-form
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Divider, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { addDays } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useParams, useRouter } from 'src/routes/hooks';
//
import {
  createNewProject,
  getAllSubcontractorList,
  getCompanySubcontractorList,
  getProjectList,
  resetCreateProject,
  resetMembers,
  setCreateTemplate,
  setDefaultTemplateModified,
  setProjectDrawerState,
  setProjectName,
  setProjectTrades,
  setProjectWorkflow,
} from 'src/redux/slices/projectSlice';
// utils
import uuidv4 from 'src/utils/uuidv4';
import { PROJECT_DEFAULT_TEMPLATE, PROJECT_TEMPLATES } from 'src/_mock';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
// redux
// import {
//   createMeetingMinutes,
//   getMeetingMinutesDetails,
//   setCreateMeetingMinutes,
//   setMeetingMinutesDescription,
//   setMeetingMinutesInviteAttendee,
//   setMeetingMinutesNotes,
//   setMeetingMinutesPermit,
//   setMeetingMinutesPlanTracking,
//   updateMeetingMinutes,
// } from 'src/redux/slices/meetingMinutesSlice';
//
// import MeetingMinutesDescription from './meeting-minutes-description';
// import MeetingMinutesPermitFields from './meeting-minutes-permit-fields';
// import MeetingMinutesInviteAttendeeView from './meeting-minutes-invite-attendee-dialog';
// import ProjectFinal from './project-final';
// import MeetingMinutesPlanTrackingFields from './meeting-minutes-plan-tracking-fields';
// import MeetingMinutesNotes from './meeting-minutes-notes';
// import meetingMinutesSchema from './meeting-minutes-schema';

// // ----------------------------------------------------------------------

const steps = [
  {
    label: 'Meeting Description',
    // description: Name your Project,
    value: 'description',
  },
  {
    label: 'Meeting Attendees',
    // description: 'Create trades for your project',
    value: 'inviteAttendee',
  },
  {
    label: 'Meeting Agenda',
    // description: Create  your project workflow,
    value: 'notes',
  },
  {
    label: 'Permit',
    // description: Assign subcontractors to your project,
    value: 'permit',
  },
  {
    label: 'Plan Tracking',
    // description: Invite users to project,
    value: 'plan',
  },
];

export default function DailyLogsStepperForm({ isEdit }) {
  const params = useParams();
  const { id } = params;
}

DailyLogsStepperForm.propTypes = {
  isEdit: PropTypes.bool,
};
