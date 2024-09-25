import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
// @mui
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { addDays, isTomorrow, startOfDay } from 'date-fns';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFMultiSelect } from 'src/components/hook-form';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import { createRfi, editRfi, submitRfiToArchitect } from 'src/redux/slices/rfiSlice';
import RfiAttachments from './rfi-attachment';

// ----------------------------------------------------------------------

export default function RfiNewEditForm({ currentRfi, id }) {
  const router = useRouter();
  const { pathname } = useLocation();
  const isSubmittingRef = useRef();
  const dispatch = useDispatch();
  const ccList = useSelector((state) => state.rfi.users);
  const ownerList = useSelector((state) => state.submittal.assigneeUsers);
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?._id);
  const existingAttachments = useMemo(
    () => (currentRfi?.attachments ? currentRfi?.attachments : []),
    [currentRfi]
  );
  const [files, setFiles] = useState(existingAttachments);
  useEffect(() => {
    if (pathname.includes('revision')) {
      setFiles([]);
    } else {
      setFiles(existingAttachments);
    }
  }, [pathname, existingAttachments]);

  const { enqueueSnackbar } = useSnackbar();

  const NewSubmittalSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    drawingSheet: Yup.string().required('Drawing sheet is required'),
    dueDate: Yup.date()
      .required('Due Date is required')
      .min(startOfDay(addDays(new Date(), 1)), 'Due Date must be later than today'),
    costImpact: Yup.string(),
    scheduleDelay: Yup.string(),
    owner: Yup.array(),
    ccList: Yup.array(),
  });

  const defaultValues = useMemo(() => {
    const name = currentRfi?.name ? currentRfi?.name : '';
    const description = currentRfi?.description ? currentRfi?.description : '';
    const drawingSheet = currentRfi?.drawingSheet ? currentRfi?.drawingSheet : '';
    const dueDate = currentRfi ? new Date(currentRfi?.dueDate) : null;
    const costImpact = currentRfi?.costImpact ? currentRfi?.costImpact : '';
    const scheduleDelay = currentRfi?.scheduleDelay ? currentRfi?.scheduleDelay : '';
    const owner = currentRfi?.owner?.map((item) => item.email) || [];
    const ccListInside = currentRfi?.ccList || [];

    return {
      name,
      description,
      drawingSheet,
      dueDate,
      costImpact,
      scheduleDelay,
      owner,
      ccList: ccListInside,
    };
  }, [currentRfi]);

  const methods = useForm({
    resolver: yupResolver(NewSubmittalSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (!isEmpty(currentRfi)) {
      reset(defaultValues);
    }
  }, [reset, currentRfi, defaultValues]);

  if (!isEmpty(errors)) {
    window.scrollTo(0, 0);
  }

  const onSubmit = handleSubmit(async (data, val) => {
    try {
      if (val === 'review') isSubmittingRef.current = true;
      const owner = ownerList
        .filter((item) => data?.owner?.includes(item.email)) // Filter based on matching emails
        .map((item) => item.user);
      if (val === 'review' && owner.length === 0) {
        isSubmittingRef.current = false;
        enqueueSnackbar('Rfi can not be submitted without owner', { variant: 'error' });
        return;
      }

      let finalData;
      const { _id, firstName, lastName, email } = currentUser;
      const creator = _id;
      if (isEmpty(currentRfi)) {
        finalData = { ...data, owner, creator, projectId };
      } else {
        finalData = { ...currentRfi, ...data, creator, owner };
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

      let error;
      let payload;
      if ((!isEmpty(currentRfi) && val === 'update' && id) || (val === 'review' && id)) {
        const res = await dispatch(editRfi({ formData, id }));
        error = res.error;
        payload = res.payload;
      } else {
        const res = await dispatch(createRfi(formData));
        error = res.error;
        payload = res.payload;
      }
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      let message;
      if (val === 'review') {
        message = `submitted`;
      } else if (val === 'draft') {
        message = `saved`;
      } else {
        message = `updated`;
      }

      if (val !== 'review') {
        enqueueSnackbar(`RFI ${message} successfully!`, { variant: 'success' });
        router.push(paths.subscriber.rfi.details(payload?._id));
        return;
      }
      await handleSubmitToArchitect(payload?._id);
      reset();
      isSubmittingRef.current = false;
      router.push(paths.subscriber.rfi.list);
    } catch (error) {
      enqueueSnackbar(`Error ${currentRfi ? 'Updating' : 'Creating'} RFI`, {
        variant: 'error',
      });
    }
  });

  const handleSubmitToArchitect = async (SubmittalId) => {
    isSubmittingRef.current = true;
    const { error, payload } = await dispatch(submitRfiToArchitect(SubmittalId));
    isSubmittingRef.current = false;
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return;
    }
    enqueueSnackbar('Rfi has been successfully sent for review', { variant: 'success' });
  };

  return (
    <>
      {currentRfi &&
        currentRfi?.status === 'Draft' &&
        (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
          currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
          <Box width="100%" display="flex" justifyContent="end">
            <LoadingButton
              type="button"
              variant="contained"
              size="large"
              loading={isSubmittingRef?.current}
              onClick={() => onSubmit('review', 'sendForReviewFromEditPage')}
            >
              Submit for Review
            </LoadingButton>
          </Box>
        )}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={4} my={3} display="flex" flexDirection="column">
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="drawingSheet" label="Drawing Sheet" />
                </Box>
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
                  <Controller
                    name="dueDate"
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
                      return (
                        <DatePicker
                          label="Due Date"
                          views={['day']}
                          value={selectedDate}
                          minDate={startOfDay(addDays(new Date(), 1))}
                          onChange={(date) => field.onChange(date)}
                          format="MM/dd/yyyy" // Specify the desired date format
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
                  <RHFSelect name="costImpact" label="Cost Impact">
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="TBD">TBD</MenuItem>
                  </RHFSelect>
                  <RHFSelect name="scheduleDelay" label="Schedule Delay">
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="TBD">TBD</MenuItem>
                  </RHFSelect>
                </Box>

                <RfiAttachments files={files} setFiles={setFiles} />

                <RHFMultiSelect
                  name="owner"
                  label="Assignee/Owner"
                  disabled={
                    pathname.includes('revision')
                      ? false
                      : currentRfi && currentRfi?.status !== 'Draft'
                  }
                  chip
                  options={ownerList?.map((item) => ({ label: item.email, value: item.email }))}
                />
                <RHFMultiSelect
                  name="ccList"
                  label="CC List"
                  disabled={
                    pathname.includes('revision')
                      ? false
                      : currentRfi && currentRfi?.status !== 'Draft'
                  }
                  chip
                  options={ccList?.map((item) => ({ label: item.email, value: item.email }))}
                />
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                gap="2rem"
                sx={{ my: 3 }}
              >
                {(!currentRfi || (currentRfi && pathname.includes('revision'))) &&
                  (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                    currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                    <>
                      <LoadingButton
                        type="button"
                        onClick={() => onSubmit('draft')}
                        variant="outlined"
                        size="large"
                        loading={isSubmitting}
                      >
                        Save Draft
                      </LoadingButton>
                      <LoadingButton
                        type="button"
                        onClick={() => onSubmit('review')}
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                      >
                        Submit for Review
                      </LoadingButton>
                    </>
                  )}
                {!isEmpty(currentRfi) && (
                  <LoadingButton
                    type="button"
                    onClick={() => onSubmit('update')}
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </LoadingButton>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}

RfiNewEditForm.propTypes = {
  currentRfi: PropTypes.object,
  id: PropTypes.string,
};
