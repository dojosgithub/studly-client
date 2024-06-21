import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, concat } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
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
import { useParams, useRouter } from 'src/routes/hooks';
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
import { createRfi, editRfi, submitRfiToArchitect } from 'src/redux/slices/rfiSlice';
import RfiAttachments from './plan-room-attachment';

// ----------------------------------------------------------------------

export default function PlanRoomNewEditForm({ currentRfi, id }) {
  console.log('currentRfi', currentRfi);
  const router = useRouter();
  const params = useParams();
  const { pathname } = useLocation();
  const isSubmittingRef = useRef();
  const dispatch = useDispatch();
  const ccList = useSelector((state) => state.submittal.users);
  const ownerList = useSelector((state) => state.submittal.assigneeUsers);
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?.id);
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
  console.log('projectId', projectId);
  console.log('submittalId ', id);
  console.log('ccList ', ccList);
  console.log('ownerList ', ownerList);
  console.log('pathname ', pathname);
  console.log('params ', params);

  const NewSubmittalSchema = Yup.object().shape({
    planName: Yup.string().required('Plan Name is required'),
    issueDate: Yup.date()
      .required('Issue Date is required')
      .min(startOfDay(addDays(new Date(), 1)), 'Issue Date must be later than today'),
    // creator
  });

  const defaultValues = useMemo(() => {
    const planName = currentRfi?.name ? currentRfi?.name : '';
    const issueDate = currentRfi?.description ? currentRfi?.description : '';
    
    const owner = currentRfi?.owner?.map((item) => item.email) || [];
    const ccListInside = currentRfi?.ccList || [];

    return {
      planName,
      issueDate,
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
    watch,
    control,
    setValue,
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

      console.log('Final DATA', finalData);
      console.log('files ', files);
      console.log('formData ', formData);

      let error;
      let payload;
      if ((!isEmpty(currentRfi) && val === 'update' && id) || val === 'review' && id) {
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
        router.push(paths.subscriber.rfi.details(payload?.id));
        return;
      }
      await dispatch(submitRfiToArchitect(payload?.id));
      enqueueSnackbar(`RFI ${message} successfully!`, { variant: 'success' });
      console.log('payload', payload);
      reset();
      isSubmittingRef.current = false;
      router.push(paths.subscriber.rfi.list);
    } catch (error) {
      console.log('error-->', error);
      enqueueSnackbar(`Error ${currentRfi ? 'Updating' : 'Creating'} RFI`, {
        variant: 'error',
      });
    }
  });

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
                  <RHFTextField name="name" label="Name" />
                  <Controller
                    name="issueDate"
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
                          label="Issue Date"
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
                </Box>

                {/* <RHFSelect name="costImpact" label="Cost Impact">
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="TBD">TBD</MenuItem>
                  </RHFSelect> */}

                <RfiAttachments files={files} setFiles={setFiles} />


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
                {/* && !pathname.includes('revision') */}
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

PlanRoomNewEditForm.propTypes = {
  currentRfi: PropTypes.object,
  id: PropTypes.string,
};
