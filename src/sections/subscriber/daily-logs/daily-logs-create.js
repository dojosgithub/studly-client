import React, { useState } from 'react';
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

const StyledButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  margin: theme.spacing(0.5),
}));

const weatherOptions = ['Clear', 'Windy', 'Rainy', 'Snow', 'Sun', 'Hot'];
const CreateDailyLog = () => {
  const dispatch = useDispatch();
  const { control, getValues, handleSubmit } = useFormContext();
  const createDailyLog = useSelector((state) => state.dailyLogs?.current);
  const [selectedWeather, setSelectedWeather] = useState(createDailyLog.weather || '');

  const handleWeatherChange = (value) => {
    setSelectedWeather(value);
    dispatch(setCreateDailyLogs({ ...createDailyLog, weather: value }));
  };

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
  const handleRemoveDistributionList = (index) => {
    removeDistribution(index);
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

            {visitorFields?.map((visit, index) => (
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
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: 2, margin: 1 }}>
              <FormControl>
                <FormLabel
                  sx={{ marginRight: 2, margin: 1, width: '20%' }}
                  id="demo-row-radio-buttons-group-label"
                >
                  Inspection
                </FormLabel>
                <TextField label="Name" name="name" value=" " onChange="" sx={{ marginRight: 1 }} />
                <RadioGroup
                  sx={{ marginRight: 2, margin: 1, width: '20%' }}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  {' '}
                  <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
                  <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
                </RadioGroup>
                <TextField label="Name" name="name" value="" onChange="" sx={{ marginRight: 1 }} />
              </FormControl>
            </div>
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

          {distributionFields?.map((person, index) => (
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
                label="Name"
                name="name"
                value={person.name}
                onChange={(e) => handleDistributionListChange(index, e)}
                sx={{ marginRight: 1 }}
              />
              <TextField
                label="Email"
                name="email"
                value={person.email}
                onChange={(e) => handleDistributionListChange(index, e)}
                sx={{ marginRight: 1 }}
              />
              <StyledIconButton color="inherit" onClick={() => handleRemoveDistributionList(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
              </StyledIconButton>
            </Box>
          ))}
          {subcontractorFields.length > 1 && <Divider sx={{ my: 2, borderColor: 'grey.500' }} />}
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

          {subcontractorFields?.map((attendance, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <TextField
                label="Company Name"
                name="companyName"
                value={attendance.companyName}
                onChange={(e) => handleSubcontractorChange(index, e)}
                sx={{ marginRight: 1 }}
              />
              <TextField
                label="Headcount"
                name="headCount"
                value={attendance.headCount}
                onChange={(e) => handleSubcontractorChange(index, e)}
                sx={{ marginRight: 1 }}
              />
              <StyledIconButton color="inherit" onClick={() => handleRemoveSubcontractor(index)}>
                <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
              </StyledIconButton>
            </Box>
          ))}

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

        <form onSubmit={handleSubmit}>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </form>
      </Box>
    </Box>
  );
};
export default CreateDailyLog;
