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
import { dropdownOptions2, PROJECT_DEFAULT_TEMPLATE, PROJECT_TEMPLATES } from 'src/_mock';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
// redux
import {
  createMeetingMinutes,
  getMeetingMinutesDetails,
  setCreateMeetingMinutes,
  setMeetingMinutesDescription,
  setMeetingMinutesInviteAttendee,
  setMeetingMinutesNotes,
  setMeetingMinutesPermit,
  setMeetingMinutesPlanTracking,
  updateMeetingMinutes,
} from 'src/redux/slices/meetingMinutesSlice';
//
import MeetingMinutesDescription from './meeting-minutes-description';
import MeetingMinutesPermitFields from './meeting-minutes-permit-fields';
import MeetingMinutesInviteAttendeeView from './meeting-minutes-invite-attendee-dialog';
import ProjectFinal from './project-final';
import MeetingMinutesPlanTrackingFields from './meeting-minutes-plan-tracking-fields';
import MeetingMinutesNotes from './meeting-minutes-notes';
import meetingMinutesSchema from './meeting-minutes-schema';

// ----------------------------------------------------------------------

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

export default function MeetingMinutesStepperForm({ isEdit }) {
  const params = useParams();
  const { id } = params;

  const currentMeeting = useSelector((state) => state?.meetingMinutes?.current);
  const currentProject = useSelector((state) => state?.project?.current);

  const [activeStep, setActiveStep] = useState(0);

  const [isLoading, setIsLoading] = useState(0);

  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3]));
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isStepOptional = (step) => step === 3 || step === 4;

  const isStepSkipped = (step) => skipped?.has(step);

  const defaultValues = useMemo(
    () => ({
      description: {
        meetingNumber: currentProject ? currentProject.meetingsCount + 1 : '',
        name: '',
        // title: '',
        site: '',
        date: new Date(),
        time: '',
        // timezone: {
        //   zone: '',
        //   utc: '',
        //   name: '',
        // },
        timezone: dropdownOptions2[0],
        minutesBy: '',
        conferenceCallId: '',
        conferenceCallLink: '',
      },
      inviteAttendee: [
        {
          name: '',
          company: '',
          email: '',
          attended: false,
          // _id: uuidv4(),
        },
      ],
      notes: [
        {
          subject: '',
          topics: [
            {
              topic: '',
              date: new Date(),
              assignee: null,
              status: 'Open',
              priority: 'Low',
              description: '',
              // _id: uuidv4(),
            },
          ],
          // _id: uuidv4(),
        },
      ],
      permit: [
        {
          status: '',
          date: null,
          permitNumber: '',
          // _id: uuidv4(),
        },
      ],
      plan: [
        {
          planTracking: '',
          stampDate: null,
          dateRecieved: null,
          // _id: uuidv4(),
        },
      ],
      projectId: '', // Assuming you want a unique ID
      company: '', // Assuming you want a unique ID
    }),
    [currentProject]
  );

  const methods = useForm({
    resolver: yupResolver(meetingMinutesSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid },
    trigger,
  } = methods;

  const { description, inviteAttendee, notes, permit, plan } = getValues();
  // const { name, address, state, city, zipCode } = formValues;

  useEffect(() => {
    if (isEdit) {
      dispatch(getMeetingMinutesDetails(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && !isEmpty(currentMeeting)) {
      const meeting = cloneDeep(currentMeeting);
      meeting.description.time = new Date(meeting.description.time);
      meeting.description.date = new Date(meeting.description.date);
      meeting.notes = meeting.notes?.map((note) => ({
        ...note,
        topics: note.topics?.map((topic) => ({
          ...topic,
          date: new Date(topic.date),
        })),
      }));
      meeting.permit = meeting.permit?.map((perm) => ({
        ...perm,
        date: perm.date && new Date(perm.date),
      }));

      meeting.plan = meeting.plan?.map((pl) => ({
        ...pl,
        dateRecieved: pl.dateRecieved && new Date(pl.dateRecieved),
        stampDate: pl.stampDate && new Date(pl.stampDate),
      }));

      dispatch(setCreateMeetingMinutes(meeting));
      reset(meeting);
    }
  }, [isEdit, currentMeeting, dispatch, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // const { error, payload } = await dispatch(createNewProject(finalData))
      // console.log('e-p', { error, payload });
      // if (!isEmpty(error)) {
      //   enqueueSnackbar(error.message, { variant: "error" });
      //   return
      // }
      // handleReset()
      // enqueueSnackbar('Project created successfully!', { variant: 'success' });
      // await dispatch(getProjectList())
      // dispatch(getSubmittalList({ search: '', page: 1, status: [] }))
      // dispatch(resetTemplate())
      // dispatch(resetWorkflow())
      // dispatch(resetCreateProject())
      // dispatch(setProjectDrawerState(false))
      // // if(isEmpty(projectList)){
      // //   router.push(paths.subscriber.onboarding);
      // //   return
      // // }
      // // router.push(paths.subscriber.submittals.list);
      // navigate(paths.subscriber.submittals.list)
    } catch (error) {
      // console.error(error);
      enqueueSnackbar('Error Updating Password', { variant: 'error' });
    }
  });

  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value;

    const isFormValid = await trigger(currentStepValue);

    // }
    return { isFormValid, currentStepValue };
  };

  const handleNext = async () => {
    if (activeStep === steps.length) return; // Prevent submission if already on last step

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const { isFormValid, currentStepValue } = await getFormValidation();

    // Dispatch form data or perform other actions based on current step value
    if (isFormValid) {
      switch (currentStepValue) {
        case 'description':
          dispatch(setMeetingMinutesDescription(cloneDeep(description)));
          break;
        case 'inviteAttendee':
          dispatch(setMeetingMinutesInviteAttendee(cloneDeep(inviteAttendee)));
          break;
        case 'notes':
          dispatch(setMeetingMinutesNotes(cloneDeep(notes)));
          break;
        case 'permit':
          dispatch(setMeetingMinutesPermit(cloneDeep(permit)));
          break;
        case 'plan':
          dispatch(setMeetingMinutesPlanTracking(cloneDeep(plan)));
          break;
        default:
          break;
      }
    }

    setSkipped(newSkipped);
    if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
    // dispatch(resetCreateProject())
  };

  const handleFinish = async (status) => {
    setIsLoading(true);
    // Clone the plan array using lodash's cloneDeep
    const clonedPlan = cloneDeep(plan);

    // Dispatch the clonedPlan to your Redux store or perform other actions
    dispatch(setMeetingMinutesPlanTracking(clonedPlan));

    let formattedTime = '';
    if (description.time) {
      const date = new Date(description.time);

      // Extract the time components
      const hours = date.getHours();
      const minutes = date.getMinutes();

      // Format the time in HH:MM:SS format
      formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    if (isEdit) {
      await dispatch(
        updateMeetingMinutes({
          data: {
            description: {
              ...description,
              timeInString: formattedTime,
            },
            inviteAttendee,
            notes,
            permit,
            plan: clonedPlan,
            ...(status && { status }),
          },
          id,
        })
      );
    } else {
      await dispatch(
        createMeetingMinutes({
          description: {
            ...description,
            timeInString: formattedTime,
          },
          inviteAttendee,
          notes,
          permit,
          plan: clonedPlan,
        })
      );
    }

    enqueueSnackbar(`Meeting ${isEdit ? 'updated' : 'created'} successfully!`, {
      variant: 'success',
    });
    setIsLoading(false);

    router.push(paths.subscriber.meetingMinutes.list);
    // Optionally, you can submit the form
    // methods.handleSubmit(onSubmit)();
  };

  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <MeetingMinutesDescription />;
        break;
      case 1:
        component = <MeetingMinutesInviteAttendeeView isEdit={isEdit} />;
        break;

      case 2:
        component = <MeetingMinutesNotes />;
        break;
      case 3:
        component = <MeetingMinutesPermitFields />;
        break;

      default:
        component = <MeetingMinutesDescription />;
    }
    return component;
  }

  return (
    <>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          maxHeight: '360px',
          marginTop: '2rem',
          '&.MuiStepper-root .MuiStepConnector-line': { height: '100%' },
          '& .MuiStepLabel-root': { gap: '.75rem' },
        }}
      >
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel
                {...labelProps}
                // optional={<Typography variant="caption">{step.description}<br />{index === 0 && step.description2}</Typography>}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Divider sx={{ width: '1px', background: 'rgb(145 158 171 / 20%)' }} />

      <Stack flex={1} position="relative">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          {activeStep === steps.length - 1 ? (
            <>
              <MeetingMinutesPlanTrackingFields />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  color="inherit"
                  variant="outlined"
                  disabled={isSubmitting}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                {!isEdit && (
                  <Button onClick={handleReset} disabled={isSubmitting}>
                    Reset
                  </Button>
                )}
                <LoadingButton
                  type="button"
                  variant="contained"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={() => handleFinish(null)}
                >
                  {isEdit ? 'Update' : 'Finish'}
                </LoadingButton>
                {isEdit && (
                  <Button
                    type="button"
                    variant="contained"
                    disabled={isLoading}
                    loading={isLoading}
                    onClick={() => handleFinish('Minutes')}
                  >
                    Convert to Minutes
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <>
              <Paper
                sx={{
                  // py: 3,
                  my: 3,
                  minHeight: 120,
                  background: 'transparent',
                  // // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                {getComponent()}
              </Paper>
              <Box
                sx={{
                  display: 'flex',
                  position: 'sticky',
                  bottom: 0,
                  p: '1rem 0',
                  width: '100%',
                  bgcolor: '#fff',
                }}
              >
                {activeStep !== 0 && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />

                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                {/* steps.length - 1 new change */}

                {activeStep !== steps.length - 1 && (
                  <Button onClick={handleNext} variant="contained">
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </FormProvider>
      </Stack>
    </>
  );
}

MeetingMinutesStepperForm.propTypes = {
  isEdit: PropTypes.bool,
};
