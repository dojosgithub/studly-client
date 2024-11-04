import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { cloneDeep, isBoolean } from 'lodash';
import { LoadingButton } from '@mui/lab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useSnackbar } from 'notistack';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Card,
  alpha,
  Grid,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';

import {
  createDailyLogs,
  getDailyLogsDetails,
  updateDailyLogs,
} from 'src/redux/slices/dailyLogsSlice'; // Adjust import based on your project structure

import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import DailyLogsAttachments from './daily-logs-attachment';

const StyledButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? '#FFAB00' : 'rgba(145, 158, 171, 0.2)', // #919EAB with 20% opacity
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? '#FFAB00' : theme.palette.action.hover,
  },
}));

const ResponsiveButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    width: '20%',
    padding: theme.spacing(1.5),
  },
}));

const ResponsiveLoadingButton = styled(LoadingButton)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    width: '20%',
    padding: theme.spacing(1.5),
  },
}));

const weatherOptions = ['Clear', 'Windy', 'Rainy', 'Snow', 'Sun', 'Hot'];

const DailyLogsNewEditForm = ({ isEdit }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const currentLog = useSelector((state) => state?.dailyLogs?.current);
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      dispatch(getDailyLogsDetails(id));
    }
  }, [isEdit, id, dispatch]);

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
    subcontractorAttendance: Yup.array().of(
      Yup.object().shape({
        companyName: Yup.string(),
        headCount: Yup.mixed().nullable(),
      })
    ),
    distributionList: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        email: Yup.string(),
      })
    ),
    attachments: Yup.array(),
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

  const { reset, handleSubmit, control, getValues, trigger, setValue } = methods;

  useEffect(() => {
    if (isEdit && currentLog) {
      const meeting = cloneDeep(currentLog);

      // Convert date field with default value if undefined
      meeting.date = meeting.date ? new Date(meeting.date) : new Date();

      // Handle inspection array with default empty array if undefined
      meeting.inspection = Array.isArray(meeting.inspection)
        ? meeting.inspection.map((inspection) => ({
            ...inspection,
            date: inspection.date ? new Date(inspection.date) : new Date(),
          }))
        : [];

      // Handle distributionList array with default empty array if undefined
      meeting.distributionList = Array.isArray(meeting.distributionList)
        ? meeting.distributionList.map((distrib) => ({
            ...distrib,
          }))
        : [];

      // Handle subcontractorAttendance array with default empty array if undefined
      meeting.subcontractorAttendance = Array.isArray(meeting.subcontractorAttendance)
        ? meeting.subcontractorAttendance.map((subcontractor) => ({
            ...subcontractor,
          }))
        : [];

      // Handle weather array (assuming no transformation needed)
      meeting.weather = Array.isArray(meeting.weather) ? [...meeting.weather] : [];

      // Handle visitors array (assuming no transformation needed)
      meeting.visitors = Array.isArray(meeting.visitors)
        ? meeting.visitors.map((visitor) => ({ visitors: visitor }))
        : [];

      // Handle HTML strings (no transformation needed if they're in the correct format)
      meeting.accidentSafetyIssues =
        typeof meeting.accidentSafetyIssues === 'string' ? meeting.accidentSafetyIssues : '';

      meeting.summary = typeof meeting.summary === 'string' ? meeting.summary : '';

      // Handle attachments (assuming it's an array of objects)
      meeting.attachments = Array.isArray(meeting.attachments) ? [...meeting.attachments] : [];
      setFiles(meeting.attachments);
      reset(meeting);
    }
  }, [isEdit, currentLog, dispatch, reset]);

  const handleWeatherChange = (value) => {
    const array = getValues('weather');
    const index = array.indexOf(value);
    if (index === -1) {
      // value does not exist, add it
      array.push(value);
    } else {
      // Item exists, remove it
      array.splice(index, 1);
    }

    setValue('weather', array);
  };

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true); // Start loading spinner

    try {
      // Map visitor fields to correct structure
      data.visitors = data.visitors.map((visitor) => visitor.visitors);
      data.projectId = currentProject._id;

      const formData = new FormData();
      const attachments = [];

      // Append files to FormData
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('attachments', file);
        } else {
          attachments.push(file);
        }
      });

      data.attachments = attachments;

      formData.append('body', JSON.stringify(data));

      let message;
      let res;

      if (isEdit) {
        message = 'updated';
        res = await dispatch(updateDailyLogs({ data: formData, id }));
      } else {
        message = 'created';
        res = await dispatch(createDailyLogs(formData));
      }

      const { error, payload } = res;

      if (error) {
        enqueueSnackbar(error.message || 'An error occurred while saving the daily log.', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar(`Daily log ${message} successfully!`, { variant: 'success' });
      reset();
      router.push(paths.subscriber.logs.list);
    } catch (error) {
      enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
    } finally {
      setLoading(false); // Stop loading spinner
    }
  });

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
  const getStatus = (index) => {
    const value = getValues(`inspection[${index}].status`);
    if (isBoolean(value)) {
      return !value;
    }
    return value === 'false';
  };

  return (
    <Box sx={{ padding: 3, width: '100%', paddingLeft: 0 }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ marginTop: 2, borderWidth: '2px' }}>
          <Card sx={{ padding: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}>
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
                  key={visit.id}
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

                  <StyledIconButton color="inherit" onClick={() => removeVisitor(index)}>
                    {console.log('hehe', index)}
                    <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                  </StyledIconButton>
                </Box>
              ))}
              {visitorFields.length > 1}
              <ResponsiveButton
                component="button"
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color="secondary"
                onClick={() => appendVisitor({ visitors: '' })}
                sx={{ marginRight: 2, margin: 1, width: '20%' }}
              >
                Add Another
              </ResponsiveButton>

              <Typography variant="h6" margin={1}>
                Inspection
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {inspectionFields?.map((inspection, index) => (
                <Stack
                  key={inspection.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ margin: 1 }}
                >
                  <FormControl>
                    <Controller
                      name={`inspection[${index}].value`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Type"
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

                  {getStatus(index) && (
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
              <ResponsiveButton
                component="button"
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                color="secondary"
                onClick={() => appendInspection({ value: '', status: true, reason: '' })}
                sx={{ marginRight: 2, margin: 1, width: '20%' }}
              >
                Add Another
              </ResponsiveButton>
            </Box>
          </Card>

          <Card sx={{ padding: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}>
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

          <Card sx={{ padding: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}>
            <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
              Distribution List
            </Typography>
            <Divider sx={{ marginY: 2 }} />

            {distributionFields?.map((person, index) => (
              <Box
                key={person.id}
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
                  label="Email"
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
            <ResponsiveButton
              component="button"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="secondary"
              onClick={() => appendDistribution({ name: '', email: '' })}
              sx={{ marginRight: 2, margin: 1, width: '20%' }}
            >
              Add Another
            </ResponsiveButton>
          </Card>

          <Card sx={{ padding: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}>
            <Typography variant="h6" sx={{ marginRight: 2, margin: 1 }}>
              Subcontractor Attendance
            </Typography>
            <Divider sx={{ marginY: 2 }} />

            {subcontractorFields?.map((field, index) => (
              <Box
                key={field.id}
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

            <ResponsiveButton
              component="button"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="secondary"
              onClick={() => appendSubcontractor({ companyName: '', headCount: null })}
              sx={{ marginRight: 2, margin: 1, width: '20%' }}
            >
              Add Another
            </ResponsiveButton>
          </Card>
          <Card
            sx={{ padding: 2, paddingBottom: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}
          >
            <Typography variant="h6" sx={{ margin: 2, marginLeft: 1 }}>
              Attachments
            </Typography>
            <DailyLogsAttachments
              files={files}
              setFiles={setFiles}
              sx={{ margin: 1, paddingRight: 3 }}
            />
          </Card>

          <Card
            sx={{ padding: 2, paddingBottom: 2, borderWidth: '2px', marginTop: 2, marginBottom: 2 }}
          >
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
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ResponsiveLoadingButton
              type="submit"
              variant="contained"
              // color="primary"
              loading={loading}
              sx={{ marginTop: 2 }}
            >
              {isEdit ? 'Update Log' : 'Create Log'}
            </ResponsiveLoadingButton>
          </div>
        </Box>
      </FormProvider>
    </Box>
  );
};
export default DailyLogsNewEditForm;

DailyLogsNewEditForm.propTypes = {
  currentLog: PropTypes.object,
  isEdit: PropTypes.bool,
};
