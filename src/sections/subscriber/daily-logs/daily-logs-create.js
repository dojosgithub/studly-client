import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useFormContext, useForm, Controller } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useSnackbar } from 'notistack';
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

import { createDailyLogs, setCreateDailyLogs } from 'src/redux/slices/dailyLogsSlice'; // Adjust import based on your project structure

import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

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

const CreateDailyLog = ({ currentLog }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentProject = useSelector((state) => state?.project?.current);

  const NewDailyLogSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    accidentSafetyIssues: Yup.string(),
    visitors: Yup.array().of(
      Yup.object().shape({
        visitors: Yup.string(),
      })
    ),
    inspection: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string(),
          status: Yup.string(),
          result: Yup.string(),
        })
      )
      .required('Inspection is required'),
    weather: Yup.array(),
    subcontracterList: Yup.array().of(
      Yup.object().shape({
        companyName: Yup.string(),
        headCount: Yup.number(),
      })
    ),
    distributionList: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        email: Yup.string(),
      })
    ),
    attachements: Yup.array(),
    summary: Yup.string(),
  });
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      date: new Date(),
      accidentSafetyIssues: '',
      visitors: [{ visitors: '' }],
      inspection: [{ value: '', status: true, reason: '' }],
      weather: [],
      subcontractorAttendance: [{ companyName: '', headCount: null }],
      distributionList: [{ name: '', email: '' }],
      attachments: [],
      summary: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewDailyLogSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    getValues,
    trigger,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;
  console.log('errors', errors);
  const handleWeatherChange = (value) => {
    // setSelectedWeather(value);
    // dispatch(setCreateDailyLogs({ weather: value }));
    const array = getValues('weather');
    const index = array.indexOf(value);
    if (index === -1) {
      // value does not exist, add it
      array.push(value);
    } else {
      // Item exists, remove it
      array.splice(index, 1);
    }

    console.log('array', array);
    setValue('weather', array);
  };

  const formValues = getValues();
  console.log(formValues);

  const existingAttachments = useMemo(
    () => (currentLog?.attachments ? currentLog?.attachments : []),
    [currentLog]
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
    name: 'visitors',
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
    name: 'inspection',
  });
  const onSubmit = handleSubmit(async (data) => {
    console.log('Form Values:', data);
    data.visitors = data.visitors.map((visitor) => visitor.visitors);
    data.projectId = currentProject.id;
    // data.inspection = data.inspection.map((inspection) => ({
    //   ...inspection,
    //   status: inspection.status === 'true' ? true : false,
    // }));
    const formData = new FormData();
    const attachments = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (file instanceof File) {
        formData.append('attachments', file);
      } else {
        attachments.push(file);
      }
    }
    data.attachments = attachments;
    console.log(data);
    formData.append('body', JSON.stringify(data));

    let error;
    let payload;
    let message;
    if (!isEmpty(currentLog)) {
      message = `updated`;

      // const res = await dispatch(editRfi({ formData, id }));
      // error = res.error;
      // payload = res.payload;
    } else {
      message = `create`;
      const res = await dispatch(createDailyLogs(formData));
      error = res.error;
      payload = res.payload;
    }
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }

    enqueueSnackbar(`Daily log ${message} successfully!`, { variant: 'success' });
    reset();
    router.push(paths.subscriber.logs.list);
  });

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
  const getStatus = (index) => getValues(`inspection[${index}].status`);

  return (
    <Box sx={{ padding: 3, width: '100%', paddingLeft: 0 }}>
      {/* <Typography variant="h4">Create a New Daily Log</Typography> */}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ marginTop: 2, borderWidth: '2px' }}>
          <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2 }}>
              <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
                Accident and Safety Issues
              </Typography>

              <RHFEditor
                simple
                name="accidentSafetyIssues"
                sx={{ marginRight: 2, margin: 1 }}
                label="Accident And Safety Issues"
                InputLabelProps={{ shrink: true }}
              />
              <Typography variant="h6" margin={1}>
                Visitors
              </Typography>
              <Divider sx={{ marginY: 2 }} />

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
                  <RHFTextField
                    name={`visitors[${index}].visitors`}
                    label="Visitor"
                    InputLabelProps={{ shrink: true }}
                    sx={{ margin: 2, marginLeft: 0, width: '50%' }}
                    onBlur={() => trigger(`visitors[${index}].visitors`)}
                  />

                  <StyledIconButton
                    color="inherit"
                    onClick={() => removeVisitor(index)}
                    // disabled={visitorFields.length === 1}
                  >
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
                onClick={() => appendVisitor({ visitors: '' })}
                sx={{ marginRight: 2, margin: 1, width: '20%' }}
              >
                Add Another
              </Button>

              {/* <InputLabel>Inspection</InputLabel>
            <Select name="inspection" value={createDailyLog.inspection} onChange={handleChange}> */}

              <Typography variant="h6" margin={1}>
                Inspection
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {inspectionFields?.map((inspection, index) => (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 1 }}>
                  <FormControl>
                    <Controller
                      name={`inspection[${index}].value`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Name"
                          InputLabelProps={{ shrink: true }}
                          sx={{ marginRight: 2 }}
                          onBlur={() => trigger(`inspection[${index}].value`)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name={`inspection[${index}].status`}
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset">
                          <RadioGroup {...field} row>
                            <FormControlLabel value="true" control={<Radio />} label="Pass" />
                            <FormControlLabel value="false" control={<Radio />} label="Fail" />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </FormControl>

                  {getStatus(index) === 'false' && (
                    <FormControl>
                      <Controller
                        name={`inspection[${index}].reason`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Reason"
                            InputLabelProps={{ shrink: true }}
                            onBlur={() => trigger(`inspection[${index}].reason`)}
                          />
                        )}
                      />
                    </FormControl>
                  )}

                  <StyledIconButton color="inherit" onClick={() => removeInspection(index)}>
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
                onClick={() => appendInspection({ value: '', status: true, reason: '' })}
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
                    selected={getValues('weather').includes(option)}
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
            <Divider sx={{ marginY: 2 }} />

            {distributionFields?.map((person, index) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 2,
                  marginLeft: 1,
                  width: '100%',
                }}
              >
                <RHFTextField
                  name={`distributionList[${index}].name`}
                  label="Name"
                  InputLabelProps={{ shrink: true }}
                  onBlur={() => trigger(`distributionList[${index}].name`)}
                  sx={{ marginRight: 2 }}
                />
                <RHFTextField
                  name={`distributionList[${index}].email`}
                  label="Name"
                  InputLabelProps={{ shrink: true }}
                  onBlur={() => trigger(`distributionList[${index}].email`)}
                  sx={{ marginRight: 2 }}
                />
                <StyledIconButton
                  color="inherit"
                  onClick={() => removeDistribution(index)}
                  sx={{ marginRight: 2 }}
                >
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
              onClick={() => appendDistribution({ name: '', email: '' })}
              sx={{ margin: 1, marginRight: 2 }}
            >
              Add Another
            </Button>
          </Card>

          <Card sx={{ padding: 2, borderWidth: '2px', margin: 2 }}>
            <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
              Subcontractor Attendance
            </Typography>
            <Divider sx={{ marginY: 2 }} />

            {subcontractorFields?.map((field, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, marginLeft: 1 }}
              >
                <RHFTextField
                  name={`subcontractorAttendance[${index}].companyName`}
                  label="Company Name"
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginRight: 2 }}
                />
                <RHFTextField
                  name={`subcontractorAttendance[${index}].headCount`}
                  label="Head Count"
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginRight: 2 }}
                  type="number"
                />

                <StyledIconButton
                  color="inherit"
                  onClick={() => removeSubcontractor(index)}
                  sx={{ marginRight: 1 }}
                >
                  <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                </StyledIconButton>
              </Box>
            ))}

            <Button
              component="button"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="secondary"
              onClick={() => appendSubcontractor({ companyName: '', headCount: null })}
              sx={{ marginRight: 2, margin: 1 }}
            >
              Add Another
            </Button>
          </Card>
          <Card sx={{ padding: 2, paddingBottom: 2, borderWidth: '2px', margin: 2 }}>
            <Typography variant="h6" sx={{ margin: 2, marginLeft: 1 }}>
              Attachments
            </Typography>
            <SubmittalAttachments
              files={files}
              setFiles={setFiles}
              sx={{ margin: 1, paddingRight: 3 }}
            />
          </Card>

          <Card sx={{ padding: 2, paddingBottom: 2, borderWidth: '2px', margin: 2 }}>
            <Typography variant="h6" sx={{ margin: 2, marginLeft: 1 }}>
              Summary
            </Typography>

            <RHFEditor
              simple
              name="summary"
              sx={{ marginRight: 2, margin: 1 }}
              label="Summary"
              InputLabelProps={{ shrink: true }}
            />
          </Card>
          <Divider sx={{ margin: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end ' }}>
            <LoadingButton type="submit" variant="contained" sx={{ marginRight: 2 }}>
              Create
            </LoadingButton>
          </div>
        </Box>
      </FormProvider>
    </Box>
  );
};
export default CreateDailyLog;

CreateDailyLog.propTypes = {
  currentLog: PropTypes.object,
};
