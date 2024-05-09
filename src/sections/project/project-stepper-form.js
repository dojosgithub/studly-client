import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
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
//
import { addDays } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
//
import { createNewProject, getAllSubcontractorList, getCompanySubcontractorList, getProjectList, resetCreateProject, resetMembers, setCreateTemplate, setProjectName, setProjectTrades, setProjectWorkflow } from 'src/redux/slices/projectSlice';
import ProjectName from 'src/sections/project/project-name';
import ProjectTrade from 'src/sections/project/project-trade';
import ProjectWorkflow from 'src/sections/project/project-workflow';
// utils
import uuidv4 from 'src/utils/uuidv4';
import { PROJECT_DEFAULT_TEMPLATE, PROJECT_TEMPLATES } from 'src/_mock';
//
import { CustomDrawer } from 'src/components/custom-drawer';
// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import { getTemplateList, resetTemplate, setIsDefaultTemplate, setIsNewTemplate, setIsTemplateNameAdded } from 'src/redux/slices/templateSlice';
import { getWorkflowList, resetWorkflow, setIsNewWorkflow } from 'src/redux/slices/workflowSlice';

import ProjectNewTemplateDrawer from './project-new-template-drawer';
import ProjectTemplateName from './project-template-name-dialog';
import ProjectSubcontractor from './project-subcontractor';
import ProjectInviteUsers from './project-invite-users';
import ProjectFinal from './project-final';
import ProjectCreateWorkflow from './project-create-workflow';


// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Project Name',
    description: `Name your Project`,
    description2: `Enter and press next`,
    value: 'name',
  },
  {
    label: 'Trades',
    description: 'Create trades for your project',
    value: 'trades',
  },
  {
    label: 'Workflow',
    description: `Create  your project workflow`,
    value: 'workflow',
  },
  {
    label: 'Assign Subcontractors',
    description: `Assign subcontractors to your project`,
    value: 'subcontractors',
  },
  {
    label: 'Invite Users',
    description: `Invite users to project`,
    value: 'invite-users',
  },
];


export default function ProjectStepperForm() {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [activeTab, setActiveTab] = useState('')
  const [skipped, setSkipped] = useState(new Set([0, 1, 2, 3, 4]));

  const [open, setOpen] = useState(false)
  const [openNewTemplateDrawer, setOpenNewTemplateDrawer] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const dispatch = useDispatch();
  const projectList = useSelector(state => state.project.list);
  const newTemplate = useSelector(state => state.project.template);
  const inviteUsers = useSelector(state => state.project.inviteUsers);
  const members = useSelector(state => state.project.members);
  const companies = useSelector(state => state.user.user.companies);

  const templateList = useSelector(state => state.template.list);
  const workflowList = useSelector(state => state.workflow.list);

  // creating new trade template
  const isDefaultTemplate = useSelector(state => state.template.isDefaultTemplate);
  const isTemplateNameAdded = useSelector(state => state.template.isTemplateNameAdded);
  const isNewTemplate = useSelector(state => state.template.isNewTemplate);

  // creating new workflow template
  const isNewWorkflow = useSelector(state => state.workflow.isNewWorkflow);


  const isStepOptional = (step) => (step === 3 || step === 4);

  const isStepSkipped = (step) => skipped?.has(step);

  useEffect(() => {
    dispatch(getTemplateList())
    dispatch(getWorkflowList())
    dispatch(getAllSubcontractorList())
    dispatch(getCompanySubcontractorList())

  }, [dispatch])



  const getTemplateTrades = useCallback(
    // templates
    (val) => {
      let trades = templateList.filter(template => template.name === val);
      trades = trades.length > 0 ? trades[0]?.trades : []
      return trades
    },
    [templateList]
  );


  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Project Name is required'),
    trades: Yup.array()
      .of(
        Yup.object().shape({
          // tradeId: Yup.string().required('Trade ID is required'),
          tradeId: Yup.string()
            .matches(/^[0-9.-]+$/, 'Trade id must contain only numeric characters, dots, and hyphens')
            .required('Trade id is required'),
          name: Yup.string().required('Trade Name is required'),
          _id: Yup.string(),
          subcontractorId: Yup.string()
        })
      )
      .min(1, 'At least one trade is required'),
    workflow: Yup.object().shape({
      name: Yup.string().required('Workflow Name is required'),
      statuses: Yup.array().min(1, 'At least one status is required'),
      // returnDate: Yup.date().min(addDays(new Date(), 1)), 
      returnDate: Yup.string().required('Date is required'),
    }),
    // inviteUsers: Yup.lazy((value) => (
    //   value ? Yup.object().shape({
    //     inside: Yup.object().shape({
    //       internal: Yup.array(),
    //       external: Yup.array(),
    //     }).nullable(), // Make inside object optional
    //     outside: Yup.array()
    //       .of(
    //         Yup.object().shape({
    //           email: Yup.string().email('Invalid email').required('User email is required'),
    //           name: Yup.string().required('User name is required'),
    //           role: Yup.string().required('User role is required'),
    //           _id: Yup.string(),
    //         })
    //       )
    //       .nullable() // Make outside array optional
    //       .default([]) // Provide a default empty array
    //   })
    //     : Yup.object().nullable()
    // ))
    // inviteUsers: Yup.object().shape({
    //   inside: Yup.object().shape({
    //     internal: Yup.array(),
    //     external: Yup.array(),
    //   }),
    //   outside: Yup.array()
    //     .of(
    //       Yup.object().shape({
    //         email: Yup.string().email('Invalid email').required('User email is required'),
    //         name: Yup.string().required('User name is required'),
    //         role: Yup.string().required('User role is required'),
    //         _id: Yup.string(),
    //       })
    //     ).min(1,"1 value")
    // })

  });

  const defaultValues = useMemo(() => {
    // Check if form is being edited or a new entry is being created
    // For example, check if selectedTemplate is present or not
    const isNewEntry = activeStep === 3 || activeStep === 4;
    // TODO: currentSelectedTemplate from redux 
    return {
      name: '',
      trades: selectedTemplate ? getTemplateTrades(selectedTemplate) : [{
        name: '',
        tradeId: '',
        _id: uuidv4(),
      }],
      workflow: {
        name: 'default',
        statuses: ['Draft', 'Submitted'],
        returnDate: new Date()
        // returnDate: "2024-03-05T07:23:21.004Z"
      },
      // inviteUsers: {
      //   inside: {
      //     internal: [],
      //     external: []
      //   },
      //   outside: isNewEntry ? [{
      //     name: '',
      //     email: '',
      //     _id: uuidv4()
      //   }] : [] // Provide default value conditionally
      // }
    };
  }, [selectedTemplate, getTemplateTrades, activeStep]);

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
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
    trigger
  } = methods;

  const formValues = getValues();
  const watchValues = watch();

  function processInviteUsers() {
    // Check if both internal and external arrays are not empty
    const hasInternal = inviteUsers.internal && inviteUsers.internal.length > 0;
    const hasExternal = inviteUsers.external && inviteUsers.external.length > 0;

    // Process internal array if not empty, otherwise return as-is
    const updatedInternalTeams = hasInternal
      ? inviteUsers.internal.map(({ _id, ...rest }) => rest)
      : inviteUsers.internal;

    // Process external array if not empty, otherwise return as-is
    const updatedExternalTeams = hasExternal
      ? inviteUsers.external.map(({ _id, ...rest }) => rest)
      : inviteUsers.external;

    return {
      internal: updatedInternalTeams,
      external: updatedExternalTeams,
    };
  }

  const onSubmit = handleSubmit(async (data, e) => {
    e.preventDefault()

    try {
      console.log('data->', data);
      if (!companies) {
        return
      }

      const updatedTrades = data?.trades?.map(({ _id, ...rest }) => rest);
      console.log("updatedTrades", updatedTrades)
      // const teams = processInviteUsers(inviteUsers);
      // const members = teamMembers?.map(({ _id, ...rest }) => rest);
      const { id, ...rest } = data.workflow;
      const updatedWorkflow = rest;
      console.log("updatedWorkflow", updatedWorkflow)

      const finalData = { ...data, trades: updatedTrades, workflow: updatedWorkflow, members }
      console.log("finalData", finalData)

      const { error, payload } = await dispatch(createNewProject(finalData))
      console.log('e-p', { error, payload });
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: "error" });
        return
      }
      handleReset()
      enqueueSnackbar('Project created successfully!', { variant: 'success' });
      await dispatch(getProjectList())
      dispatch(resetTemplate())
      dispatch(resetWorkflow())
      dispatch(resetCreateProject())
      // if(isEmpty(projectList)){
      //   router.push(paths.subscriber.onboarding);
      //   return
      // }
      router.push(paths.subscriber.submittals.list);


    } catch (error) {
      // console.error(error);
      console.log('error-->', error);
      enqueueSnackbar(`Error Updating Password`, { variant: "error" });
    }
  });


  const getFormValidation = async () => {
    const currentStepValue = steps[activeStep].value
    const isFormValid = await trigger(currentStepValue);
    return { isFormValid, currentStepValue }
  }

  // const handleNext = async () => {
  //   // new change
  //   if (activeStep === steps.length) return;

  //   let newSkipped = skipped;
  //   // console.log('newSkipped Before', newSkipped)
  //   if (isStepSkipped(activeStep)) {
  //     newSkipped = new Set(newSkipped.values());
  //     newSkipped.delete(activeStep);
  //   }
  //   // console.log('newSkipped After', newSkipped)

  //   const { isFormValid, currentStepValue } = await getFormValidation();
  //   // console.log('isFormValid', { isFormValid, currentStepValue })

  //   // ?  setting name to redux
  //   if ((currentStepValue === 'name') && isFormValid) {
  //     // console.log('formValues.name', formValues?.name);
  //     dispatch(setProjectName(formValues?.name))
  //   }
  //   // ?  setting trades to redux
  //   if ((currentStepValue === 'trades') && isFormValid) {
  //     dispatch(setProjectTrades(formValues?.trades))
  //   }

  //   if ((currentStepValue === 'workflow') && isFormValid) {
  //     dispatch(setProjectWorkflow(formValues?.workflow))
  //   }
  //   // TODO:  NEW CODE
  //   if (isDefaultTemplate && !isTemplateNameAdded && activeStep === 1) {
  //     setOpen(true)
  //     return
  //   }
  //   // TODO:  NEW CODE END




  //   if (activeTab === "existing" && isFormValid && selectedTemplate === 'default' && activeStep === 1) {
  //     setOpen(true)
  //     return
  //   }
  //   if (isFormValid) {
  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   }
  //   setSkipped(newSkipped);
  // };
  const handleNext = async () => {
    if (activeStep === steps.length) return; // Prevent submission if already on last step

    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const { isFormValid, currentStepValue } = await getFormValidation();

    if (!isFormValid && currentStepValue === "trades") {
      enqueueSnackbar('Please add a trade', { variant: "warning" });
      return
    }
    // Dispatch form data or perform other actions based on current step value
    if (isFormValid) {
      switch (currentStepValue) {
        case 'name':
          dispatch(setProjectName(formValues?.name));
          break;
        case 'trades':
          dispatch(setProjectTrades(formValues?.trades));
          break;
        case 'workflow':
          dispatch(setProjectWorkflow(formValues?.workflow));
          break;
        default:
          break;
      }
    }

    // Handle skipping steps or moving to the next step
    if (isDefaultTemplate && !isTemplateNameAdded && activeStep === 1) {
      setOpen(true);
    } else if (activeTab === 'existing' && selectedTemplate === 'default' && activeStep === 1) {
      setOpen(true);
    } else if (isFormValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    // TODO: Step2: values should be there when go back
    if (activeStep === 1) {
      setSelectedTemplate('');
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      console.log('prevSkipped', prevSkipped)
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      console.log('newSkipped', newSkipped)
      return newSkipped;
    });
  };


  const handleReset = () => {
    setActiveStep(0);
    setSelectedTemplate('');
    reset();
    dispatch(resetCreateProject())
  };

  const handleSelect = (val) => {
    if (val === "create") {
      setOpenNewTemplateDrawer(true)

      // return
    }

    setSelectedTemplate(val)

    const filteredTrades = getTemplateTrades(val)
    // TODO: multiple templates
    setValue('trades', filteredTrades)
  }
  const handleTab = (tab) => {
    const newField = {
      name: '',
      tradeId: '',
      _id: uuidv4(),
    }
    const defaultTemplate = selectedTemplate ? getTemplateTrades(selectedTemplate) : []
    const trades = tab === "create" ? [newField] : defaultTemplate;
    setValue('trades', trades)
    if (tab === "create" && !!selectedTemplate) {
      setSelectedTemplate('')
    }
    setActiveTab(tab)
  }

  const handleTemplateCreation = (val) => {
    // setValue("templateName", val)

    setOpen(false)
    if (newTemplate?.create) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    // setSelectedTemplate('')
  }


  function getComponent() {
    let component;
    switch (activeStep) {
      case 0:
        component = <ProjectName />;
        break;
      case 1:
        component = <ProjectTrade selectedTemplate={selectedTemplate} onSelect={handleSelect} onTabChange={handleTab} />;
        break;
      case 2:
        component = <ProjectWorkflow />;
        break;
      case 3:
        component = <ProjectSubcontractor />;
        break;
      case 4:
        component = <ProjectInviteUsers />;
        break;
      default:
        component = <ProjectName />;
    }
    return component;
  }


  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ maxHeight: '360px', marginTop: "2rem", "&.MuiStepper-root .MuiStepConnector-line": { height: '100%' }, "& .MuiStepLabel-root": { gap: '.75rem' } }}>
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
                // onClick={() => handleBack(index)}
                {...labelProps}
                optional={<Typography variant="caption">{step.description}<br />{index === 0 && step.description2}</Typography>}
              >
                {step.label}
              </StepLabel>

            </Step>)
        })}
      </Stepper>

      <Divider sx={{ width: '1px', background: "rgb(145 158 171 / 20%)" }} />

      <Stack flex={1} position='relative'>
        <FormProvider methods={methods} onSubmit={onSubmit}>

          {activeStep === steps.length ? (
            <>
              <ProjectFinal />

              <Box sx={{ display: 'flex', gap: 5 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleReset}>Reset</Button>
                <Button type="submit" variant="contained">Finish</Button>
              </Box>
            </>
          ) : (
            // <FormProvider methods={methods} onSubmit={onSubmit}>
            <>
              <Paper
                sx={{
                  // py: 3,
                  my: 3,
                  minHeight: 120,
                  background: 'transparent'
                  // // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                {getComponent()}
              </Paper>
              <Box sx={{ display: 'flex', position: 'sticky', bottom: 0, p: "1rem 0", width: '100%', bgcolor: '#fff' }}>
                {activeStep !== 0 && <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>}
                <Box sx={{ flexGrow: 1 }} />

                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                {/* steps.length - 1 new change */}
                {activeStep === steps.length ? (
                  <Button type="submit" variant="contained">Finish</Button>
                ) : (
                  <Button onClick={handleNext} variant="contained">Next</Button>
                )}
              </Box>
            </>
            // </FormProvider>
          )}
        </FormProvider>
      </Stack>

      {(open) &&
        <ProjectTemplateName
          open={open}
          onClose={() => setOpen(!open)}
          setSelectedTemplate={setSelectedTemplate}
          onTemplateCreation={handleTemplateCreation}
          trades={formValues?.trades}
        />
      }
      <CustomDrawer
        open={isNewTemplate} onClose={() => dispatch(setIsNewTemplate(false))}
        Component={ProjectNewTemplateDrawer}
        type='template'
      />
      <CustomDrawer
        open={isNewWorkflow}
        onClose={() => dispatch(setIsNewWorkflow(false))}
        Component={ProjectCreateWorkflow}
        type='workflow'
      />


      {/* {selectedTemplate === "default" && <ProjectTemplateName open={open} onClose={() => setOpen(false)} setSelectedTemplate={setSelectedTemplate} onTemplateCreation={handleTemplateCreation} trades={formValues?.trades} />}
      <CustomDrawer open={openNewTemplateDrawer} onClose={() => {
        setOpenNewTemplateDrawer(false);
        handleSelect('')
      }} Component={ProjectNewTemplateDrawer} type='template' /> */}
    </>
  );
}
