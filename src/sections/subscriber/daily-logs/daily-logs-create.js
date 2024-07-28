import React, { useState,useMemo,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Card,
  alpha,
  Grid,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';

import { setCreateDailyLogs } from 'src/redux/slices/dailyLogsSlice'; // Adjust import based on your project structure

import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import SubmittalAttachments from './daily-logs-attachment';

const StyledButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? '#FFCC3F' : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? '#FFCC3F' : theme.palette.action.hover,
  },
  margin: theme.spacing(0.5),
}));

const weatherOptions = ['Clear', 'Windy', 'Rainy', 'Snow', 'Sun', 'Hot'];
const CreateDailyLog = (currentLogs) => {
  const dispatch = useDispatch();
  const { control, getValues, handleSubmit } = useFormContext();
  const createDailyLog = useSelector((state) => state.dailyLogs?.current);
  const [selectedWeather, setSelectedWeather] = useState(createDailyLog.weather || '');

  const handleWeatherChange = (value) => {
    setSelectedWeather(value);
    dispatch(setCreateDailyLogs({ ...createDailyLog, weather: value }));
  };
  const existingAttachments = useMemo(
    () => (currentLogs?.attachments ? currentLogs?.attachments : []),
    [currentLogs]
  );

  const [files, setFiles] = useState(existingAttachments);


  const {
    fields: subcontractorFields,
    append: appendSubcontractor,
    remove: removeSubcontractor,
  } = useFieldArray({
    control,
    name: 'subcontractorAttendance',
  });
  const {
    fields: visitorFields,
    append: appendVisitor,
    remove: removeVisitor,
  } = useFieldArray({
    control,
    name: 'visitorsList',
  });
  const {
    fields: distributionFields,
    append: appendDistribution,
    remove: removeDistribution,
  } = useFieldArray({
    control,
    name: 'distributionList',
  });
  const {
    fields: inspectionFields,
    append: appendInspection,
    remove: removeInspection,
  } = useFieldArray({
    control,
    name: 'inspectionList',
  });
  const handleRemoveDistributionList = (index) => {
    removeDistribution(index);
  };
  const handleRemoveInspectionList = (index) => {
    removeInspection(index);
  };

  const handleRemoveVisitorList = (index) => {
    removeVisitor(index);
  };
  const handleRemoveSubcontractor = (index) => {
    removeSubcontractor(index);
  };
  // Function to log form values to the console

  console.log('Current Form Values:', getValues());

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCreateDailyLogs({ ...createDailyLog, [name]: value }));
  };

  // Function to handle changes in subcontractor fields
  const handleSubcontractorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubcontractors = [...subcontractorFields];
    updatedSubcontractors[index] = { ...updatedSubcontractors[index], [name]: value };
    dispatch(
      setCreateDailyLogs({ ...createDailyLog, subcontractorAttendance: updatedSubcontractors })
    );
  };
  const handleVisitorListChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVisitors = [...visitorFields];
    updatedVisitors[index] = { ...updatedVisitors[index], [name]: value };
    dispatch(setCreateDailyLogs({ ...createDailyLog, subcontractorAttendance: updatedVisitors }));
  };
  const handleInspectionListChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInspections = [...inspectionFields];
    updatedInspections[index] = { ...updatedInspections[index], [name]: value };
    dispatch(setCreateDailyLogs({ ...createDailyLog, inspectionList: updatedInspections }));
  };

  const handleDistributionListChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDistributions = [...distributionFields];
    updatedDistributions[index] = { ...updatedDistributions[index], [name]: value };
    dispatch(setCreateDailyLogs({ ...createDailyLog, distributionList: updatedDistributions }));
  };

  // Function to add a new subcontractor
  const addSubcontractor = () => {
    appendSubcontractor({ companyName: '', headCount: '' });
  };
  const addVisitorList = () => {
    appendVisitor({ visitor: '' });
  };
  const addInspectionList = () => {
    appendInspection({ name: '', result: '' });
  };
  // Function to add a new distribution list entry
  const addDistributionList = () => {
    appendDistribution({ name: '', email: '' });
  };

  // Function to handle form submission
  const onSubmit = () => {
    const values = getValues();
    dispatch(setCreateDailyLogs(values)); // Submit the form values
  };

  const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSubcontractor',
  })(({ isSubcontractor, theme }) => ({
    '& .submittalTitle': {
      color: theme.palette.primary.main, // Fixed color property
      flex: 0.25,
      borderRight: `2px solid ${alpha(theme.palette.grey[500], 0.12)}`, // Fixed template literal syntax
      fontWeight: 'bold',
    },
    display: 'flex',
    justifyContent: 'flex-start',
    borderRadius: '10px',
    padding: '10px',
    gap: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    ...(isSubcontractor && {
      maxHeight: '500px', // Added 'px' to maxHeight value
    }),
  }));
  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    width: 50,
    height: 50,
    opacity: 1,
    borderRadius: '10px',
    outline: `1px solid ${alpha(theme.palette.grey[700], 0.2)}`,
    '&:hover': {
      opacity: 1,
      outline: `1px solid ${alpha(theme.palette.grey[700], 1)}`,
    },
  }));

  const displayVisitorFields = visitorFields.length > 0 ? visitorFields : [{ visitor: '' }];
  const displaySubcontractorFields =
    subcontractorFields.length > 0 ? subcontractorFields : [{ companyName: '', headCount: '' }];
  const displayDistributionFields =
    distributionFields.length > 0 ? distributionFields : [{ name: '', email: '' }];
  const displayInspectionFields =
    inspectionFields.length > 0 ? inspectionFields : [{ name: '', email: '' }];
  return (
    <Box sx={{ padding: 3, width: '80%' }}>
      {/* <Typography variant="h4">Create a New Daily Log</Typography> */}

      <Box sx={{ marginTop: 2, borderWidth: '2px' }}>
        {/* <div style={{ display: 'flex', paddingtop: 10 }}>
          <StyledCard sx={{ width: '100%', marginBottom: '20px', marginTop: '0px' }}>
            <Typography className="submittalTitle">Date</Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: 0.75, px: 2 }}>
              {createDailyLog.date}
            </Typography>
            <Typography className="submittalTitle" sx={{ px: 4, whiteSpace: 'nowrap' }}>
              Project Name
            </Typography>
            <Typography sx={{ color: (theme) => theme.palette.primary.main, flex: 0.75, px: 3 }}>
              {createDailyLog.projectName}
            </Typography>
          </StyledCard>
        </div> */}

        <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2 }}>
            {/* <TextField
              fullWidth
              label="Accident and Safety Issues"
              name="accidentAndSafetyIssues"
              value={createDailyLog.accidentAndSafetyIssues}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            /> */}
            <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
              Accident and Safety Issues
            </Typography>

            <RHFEditor
              simple
              name="accidentAndSafetyIssues"
              value={createDailyLog.accidentAndSafetyIssues || ''}
              onChange={(value) =>
                handleChange({ target: { name: 'accidentAndSafetyIssues', value } })
              } // Correct onChange handler
              sx={{ marginRight: 2, margin: 1 }}
            />
            {/* <TextField
              fullWidth
              label="Visitors"
              name="visitors"
              value={createDailyLog.visitors}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            /> */}

            {displayVisitorFields?.map((visit, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: 2,
                  margin: 1,
                  width: '100%',
                }}
              >
                <TextField
                  fullWidth
                  label="Visitors"
                  name="visitors"
                  value={visit.visitor}
                  onChange={(e) => handleVisitorListChange(index, e)}
                  sx={{ marginBottom: 0, width: '60%', marginRight: 3 }}
                />

                <StyledIconButton color="inherit" onClick={() => handleRemoveVisitorList(index)}>
                  <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                </StyledIconButton>
              </Box>
            ))}
            {visitorFields.length > 1}
            <Button
              component="button"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="secondary"
              onClick={addVisitorList}
              sx={{ marginRight: 2, margin: 1, width: '20%' }}
            >
              Add Another
            </Button>

            {/* <InputLabel>Inspection</InputLabel>
            <Select name="inspection" value={createDailyLog.inspection} onChange={handleChange}> */}
             
            <Typography variant="h6" margin={1}>
              Inspection
            </Typography>
            {displayInspectionFields?.map((inspection, index) => (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 1 }}>
              <FormControl>
              <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={inspection.name}
                  onChange={(e) => handleInspectionListChange(index, e)}
                  sx={{ marginRight: 1 }}
                />
              </FormControl>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
                  <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
                </RadioGroup>
              </FormControl>
              <FormControl>
              <TextField
                  fullWidth
                  label="Result"
                  name="result"
                  value={inspection.result}
                  onChange={(e) => handleInspectionListChange(index, e)}
                  sx={{ marginRight: 1 }}
                />
              </FormControl>
              <StyledIconButton color="inherit" onClick={() => handleRemoveInspectionList(index)}>
                  <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                </StyledIconButton>
            </Stack>
              ))}
              {inspectionFields.length > 1}
            <Button
              component="button"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="secondary"
              onClick={addInspectionList}
              sx={{ marginRight: 2, margin: 1, width: '20%' }}
            >
              Add Another
            </Button>

            {/* </Select> */}
          </Box>
        </Card>

        <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Weather
          </Typography>
          <Grid container spacing={1}>
            {weatherOptions.map((option, index) => (
              <Grid item xs={4} key={option}>
                <StyledButton
                  fullWidth
                  selected={selectedWeather === option}
                  onClick={() => handleWeatherChange(option)}
                >
                  {option}
                </StyledButton>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
          <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
            Distribution List
          </Typography>

          {displayDistributionFields?.map((person, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 2,
                marginLeft: 1,
                width: '100%',
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={person.name}
                onChange={(e) => handleDistributionListChange(index, e)}
                sx={{ marginRight: 1, width: '50%' }}
              />
              <TextField
                label="Email"
                name="email"
                value={person.email}
                onChange={(e) => handleDistributionListChange(index, e)}
                sx={{ marginRight: 1, width: '50%' }}
              />
              <StyledIconButton color="inherit" onClick={() => handleRemoveDistributionList(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
              </StyledIconButton>
            </Box>
          ))}
          {/* {distributionFields.length > 1 && <Divider sx={{ my: 2, borderColor: 'grey.500' }} />} */}
          <Button
            component="button"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color="secondary"
            onClick={addDistributionList}
            sx={{ marginRight: 2, margin: 1 }}
          >
            Add Another
          </Button>
        </Card>

        <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
          <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
            Subcontractor Attendance
          </Typography>

          {displaySubcontractorFields?.map((attendance, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, marginLeft: 1 }}
            >
              <TextField
                label="Company Name"
                name="companyName"
                value={attendance.companyName}
                onChange={(e) => handleSubcontractorChange(index, e)}
                sx={{ marginRight: 1, width: '50%' }}
              />
              <TextField
                label="Headcount"
                name="headCount"
                value={attendance.headCount}
                onChange={(e) => handleSubcontractorChange(index, e)}
                sx={{ marginRight: 1, width: '50%' }}
              />
              <StyledIconButton color="inherit" onClick={() => handleRemoveSubcontractor(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
              </StyledIconButton>
            </Box>
          ))}
          {/* {subcontractorFields.length > 1 && <Divider sx={{ my: 2, borderColor: 'grey.500' }} />} */}
          <Button
            component="button"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" />}
            color="secondary"
            onClick={addSubcontractor}
            sx={{ marginRight: 2, margin: 1 }}
          >
            Add Another
          </Button>
        </Card>
        <Card sx={{ paddingLeft: 2, paddingBottom: 2, borderWidth: '2px', margin: 2 }}>
        <Typography variant="h6" sx={{ margin: 2, marginLeft: 1 }}>
            Attachments
          </Typography>
          <SubmittalAttachments files={files}
                  setFiles={setFiles}

                  sx={{ marginRight: 2, margin: 1 }}
                   />
                  
        </Card>

        <Card sx={{ paddingLeft: 2, paddingBottom: 2, borderWidth: '2px', margin: 2 }}>
          <Typography variant="h6" sx={{ margin: 2, marginLeft: 1 }}>
            Summary
          </Typography>
          <RHFEditor
            simple
            name="summary"
            value={createDailyLog.description || ''}
            onChange={(value) => dispatch(createDailyLog.summary, value)}
            sx={{ marginRight: 2, margin: 1 }}
          />
        </Card>
        <Divider sx={{ marginY: 3 }} />

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained" color="primary">
            Save
          </Button>
        </form>
      </Box>
    </Box>
  );
};
export default CreateDailyLog;
