import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, concat } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { addDays, isAfter, isTomorrow, startOfDay } from 'date-fns';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
  RHFUpload,
  RHFSelect,
  RHFMultiSelect,
  RHFMultiSelectChip,
  RHFSelectChip,
} from 'src/components/hook-form';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { getStrTradeId } from 'src/utils/split-string';
import {
  createNewSubmittal,
  editSubmittal,
  getSubmittalDetails,
  submitSubmittalToArchitect,
} from 'src/redux/slices/submittalSlice';
import { getCurrentProjectTradesById, getProjectList } from 'src/redux/slices/projectSlice';
import SubmittalAttachments from './submittals-attachment';

// ----------------------------------------------------------------------

export default function SubmittalsNewEditForm({ currentSubmittal, id }) {
  console.log('currentSubmittal', currentSubmittal);
  const router = useRouter();
  const dispatch = useDispatch();
  const ccList = useSelector((state) => state.submittal.users);
  const existingAttachments = currentSubmittal?.attachments ? currentSubmittal?.attachments : [];
  const [files, setFiles] = useState(existingAttachments);
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?.id);
  const trades = useSelector((state) => state.project?.current?.trades);

  const { enqueueSnackbar } = useSnackbar();
  console.log('projectId', projectId);
  console.log('submittalId ', id);
  console.log('ccList ', ccList);

  const NewSubmittalSchema = Yup.object().shape({
    trade: Yup.string().required('Trade is required'),
    // submittalId: Yup.number()
    //   .typeError('submittalId must be a number')
    //   .positive('submittalId must be greater than zero')
    //   .integer('submittalId must be an integer')
    //   .required('submittalId is required'),
    // submittalId: Yup.string()
    //   .matches(/^[0-9.-]+$/, 'Trade id must contain only numeric characters, dots, and hyphens')
    //   .required('Trade id is required'),
    submittalId: Yup.string(),
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    status: Yup.string().required('Status is required'),
    returnDate: Yup.date()
      .required('Return Date is required')
      .min(startOfDay(addDays(new Date(), 1)), 'Return Date must be later than today'),
    owner: Yup.string(),
    ccList: Yup.array(),
    // ccList: Yup.array().min(1, 'At least one option in the CC List is required').required('cc List is required'),
    // attachments: Yup.array().min(1),
    // creator: Yup.string().required('Creator is required'),
    // submittedDate: Yup.date().required('Submssion Date is required'),
    // link: Yup.string().required('link is required'),
  });

  const defaultValues = useMemo(
    () => ({
      // currentSubmittal?.trade?.tradeId
      trade: currentSubmittal
        ? `${currentSubmittal?.trade?.tradeId}-${currentSubmittal?.trade?.name}`
        : '',
      submittalId: currentSubmittal?.submittalId || '',
      name: currentSubmittal?.name || '',
      description: currentSubmittal?.description || '',
      owner: currentSubmittal?.owner?.email || '',
      type: currentSubmittal?.type || '',
      ccList: currentSubmittal?.ccList || [],
      status: currentSubmittal?.status || 'Draft', // Set default values here
      returnDate: currentSubmittal?.returnDate ? new Date(currentSubmittal.returnDate) : null,
      // attachments: currentSubmittal?.attachments || [],
      // submittedDate: currentSubmittal?.submittedDate || '',
      // creator: currentSubmittal?.creator || '',
      // link: currentSubmittal?.link || '',
    }),
    [currentSubmittal]
  );

  const methods = useForm({
    resolver: yupResolver(NewSubmittalSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const { submittalId } = values;
  console.log('values', values);
  const handleSelectTrade = useCallback(
    (option) => {
      console.log('option', option);
      const sequence = option.submittalCreatedCount + 1;
      const id1 = concat(option.tradeId, '-', sequence).join('');
      console.log('id1', id1);

      setValue(`submittalId`, id1);
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data, val) => {
    // enqueueSnackbar(currentSubmittal ? 'Update success!' : 'Create success!');
    try {
      const owner = ccList.filter((item) => data.owner === item.email)[0]?.user;
      const tradeId = getStrTradeId(data.trade);
      const tradeObj = trades.find((t) => t.tradeId === tradeId);
      const trade = {
        ...tradeObj,
        submittalCreatedCount: (tradeObj?.submittalCreatedCount || 0) + 1,
      };
      console.log('data-->', data);
      console.log('val-->', val);
      console.log('owner-->', owner);
      console.log('tradeId', tradeId);
      console.log('trade', trade);
      delete trade._id;
      if (!trade) {
        return;
      }

      let finalData;
      const { _id, firstName, lastName, email } = currentUser;
      const creator = _id;
      if (isEmpty(currentSubmittal)) {
        // const creator = { _id, name: `${firstName} ${lastName}`, email }
        const submittedDate = new Date();
        const link = 'www.google.com';
        finalData = { ...data, owner, creator, submittedDate, link, projectId, trade };
      } else {
        finalData = { ...currentSubmittal, ...data, creator, owner, trade };
      }

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
      finalData.attachments = attachments;
      formData.append('body', JSON.stringify(finalData));

      console.log('Final DATA', finalData);
      console.log('files ', files);
      console.log('formData ', formData);

      let error;
      let payload;
      if (!isEmpty(currentSubmittal) && id) {
        const res = await dispatch(editSubmittal({ formData, id }));
        error = res.error;
        payload = res.payload;
      } else {
        const res = await dispatch(createNewSubmittal(formData));
        error = res.error;
        payload = res.payload;
      }
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }

      dispatch(getCurrentProjectTradesById(projectId));
      dispatch(getProjectList());
      reset();
      enqueueSnackbar(
        currentSubmittal ? 'Submittal updated successfully!' : 'Submittal created successfully!',
        { variant: 'success' }
      );
      if (val === 'review') {
        console.log('payload', payload);
        handleSubmitToArchitect(payload?.id);
      }
      router.push(paths.subscriber.submittals.list);
    } catch (error) {
      // console.error(error);
      console.log('error-->', error);
      enqueueSnackbar(`Error ${currentSubmittal ? 'Updating' : 'Creating'} Project`, {
        variant: 'error',
      });
    }
  });

  const handleSubmitToArchitect = async (SubmittalId) => {
    console.log('SubmittalId', SubmittalId);
    // setIsSubmitting(true);
    const { error, payload } = await dispatch(submitSubmittalToArchitect(SubmittalId));
    console.log('e-p', { error, payload });
    // setIsSubmitting(false);
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Submittal submitted to architect successfully', { variant: 'success' });
    await dispatch(getSubmittalDetails(SubmittalId));
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });

  //     if (file) {
  //       console.log("newFile", newFile)
  //       setValue('attachment', newFile, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={4}
              // columnGap={2}
              // gridTemplateColumns={{
              //   xs: 'repeat(1, 1fr)',
              //   sm: 'repeat(2, 1fr)',
              // }}
              my={3}
              display="flex"
              flexDirection="column"
            >
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFSelect name="trade" label="Trade">
                  {trades?.map((trade) => (
                    <MenuItem
                      key={trade.tradeId}
                      value={`${trade?.tradeId || ''}-${trade?.name || ''}`}
                      onClick={() => handleSelectTrade(trade)}
                    >
                      {trade?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField
                  name="submittalId"
                  label="Submittal ID"
                  type="string"
                  value={submittalId}
                  disabled
                />
                {/* type='number' */}
              </Box>
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" multiline rows={3} label="Description" />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                {/* <Controller
                  name="submittedDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Select Submission Date"
                      views={['day', 'month', 'year']}
                      value={field.value || null}
                      minDate={addDays(new Date(), 1)}
                      onChange={(date) => field.onChange(date)}
                      error={!!error}
                      helperText={error && error?.message}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                /> */}

                {/* // TODO: SHOW CHIP */}
                <RHFSelect name="status" label="Status" chip disabled>
                  <MenuItem selected value="Draft">
                    Draft
                  </MenuItem>
                </RHFSelect>

                {/* <RHFMultiSelectChip
                  name="status"
                  label="Status"
                  options={[
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    // Add more options here
                  ]}
                  disabled
                /> */}
                {/* <Controller
                  name="returnDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Request Return Date"
                      views={['day', 'month', 'year']}
                      value={field.value || null}
                      minDate={addDays(new Date(), 1)}
                      onChange={(date) => field.onChange(date)}
                      error={!!error}
                      helperText={error && error?.message}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                /> */}
                {/* <Controller
                  name="returnDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Request Return Date"
                      views={['day', 'month', 'year']}
                      value={field.value || null}
                      minDate={addDays(new Date(), 1)}
                      onChange={(date) => field.onChange(date)}
                      format="dd/MM/yyyy" // Specify the desired date format
                      error={!!error}
                      helperText={error && error?.message}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                /> */}
                <Controller
                  name="returnDate"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field, fieldState: { error } }) => {
                    const selectedDate = field.value || null;
                    const isDateNextDay = selectedDate && isTomorrow(selectedDate);
                    const dateStyle = isDateNextDay
                      ? {
                          '.MuiInputBase-root.MuiOutlinedInput-root': {
                            color: 'red',
                            borderColor: 'red',
                            border: '1px solid',
                          },
                        }
                      : {};
                    console.log(isDateNextDay);
                    return (
                      <DatePicker
                        label="Request Return Date"
                        views={['day', 'month', 'year']}
                        value={selectedDate}
                        minDate={startOfDay(addDays(new Date(), 1))}
                        onChange={(date) => field.onChange(date)}
                        format="dd/MM/yyyy" // Specify the desired date format
                        error={!!error}
                        helperText={error && error?.message}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                        // sx={dateStyle} // Apply conditional style based on the date comparison
                      />
                    );
                  }}
                />
                <RHFSelect name="type" label="Type">
                  <MenuItem value="Shop Drawings">Shop Drawings</MenuItem>
                  <MenuItem value="Samples">Samples</MenuItem>
                  <MenuItem value="Cut Sheet">Cut Sheet</MenuItem>
                </RHFSelect>
              </Box>
              <SubmittalAttachments files={files} setFiles={setFiles} />

              <RHFSelect
                name="owner"
                label="Assignee/Owner"
                // capitalize
              >
                {/* <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
                <MenuItem value="option3">Option 3</MenuItem> */}
                {ccList?.map((item) => (
                  <MenuItem value={item?.email} key={item?.email}>
                    {item?.email}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* // TODO: List should be dynamic */}
              <RHFMultiSelect
                name="ccList"
                label="CC List"
                // placeholder="Select multiple options"
                chip
                options={ccList?.map((item) => ({ label: item.email, value: item.email }))}
                // options={[
                //   { label: 'engr@mailinator.com', value: 'engr@mailinator.com' },
                //   { label: 'arch@mailinator.com', value: 'arch@mailinator.com' },
                // ]}
              />
            </Box>

            {/* <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="status" label="Status" />
                <RHFTextField name="type" label="Type" />
              </Box> */}
            {/* <RHFTextField name="link" label="Link" /> */}
            {/* <Box sx={{ mb: 5 }}>
                  <RHFUpload
                    name="attachment"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 3,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.disabled',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
            }
          />
        </Box> */}
            {/* 
              <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />


              <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )} */}
            {/* <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              /> */}

            {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentSubmittal && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentSubmittal && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentSubmittal && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid> */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              gap="2rem"
              sx={{ my: 3 }}
            >
              {!currentSubmittal &&
                (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                  currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                  <>
                    <LoadingButton
                      type="button"
                      onClick={() => onSubmit('draft')}
                      variant="outlined"
                      size="large"
                    >
                      Save Draft
                    </LoadingButton>
                    <LoadingButton
                      type="button"
                      onClick={() => onSubmit('review')}
                      variant="contained"
                      size="large"
                    >
                      Submit for Review
                    </LoadingButton>
                  </>
                )}

              {currentSubmittal && (
                <LoadingButton
                  type="button"
                  onClick={() => onSubmit('update')}
                  variant="contained"
                  size="large"
                >
                  Save Changes
                </LoadingButton>
              )}
              {/* loading={isSubmitting} */}
              {/* {!currentSubmittal ? 'Create New Submittal' : 'Save Changes'} */}
              {/* {status === "Draft" && (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD || currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && <Box width="100%" display='flex' justifyContent='end'>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} onClick={handleSubmitToArchitect}>
                    Submit to Architect
                </LoadingButton >
            </Box>} */}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SubmittalsNewEditForm.propTypes = {
  currentSubmittal: PropTypes.object,
  id: PropTypes.string,
};
