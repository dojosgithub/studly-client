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
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';

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
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { createPlanRoom, setPlanRoomList } from 'src/redux/slices/planRoomSlice';
//
import { base64ToFile } from 'src/utils/base64toFile';
//
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function MeetingMinutesNewEditForm({ currentMeetingMinutes, id }) {
  const router = useRouter();
  const confirm = useBoolean();

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?._id);

  const { enqueueSnackbar } = useSnackbar();

  const NewPlanRoomSchema = Yup.object().shape({
    planName: Yup.string().required('Plan Name is required'),
    issueDate: Yup.date().required('Issue Date is required'),
    // .min(startOfDay(addDays(new Date(), 1)), 'Issue Date must be later than today'),
    creator: Yup.object().shape({
      _id: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string(),
    }),
  });

  const defaultValues = useMemo(() => {
    const planName = currentMeetingMinutes?.name ? currentMeetingMinutes?.name : '';
    const issueDate = currentMeetingMinutes?.issueDate
      ? new Date(currentMeetingMinutes.issueDate)
      : null;
    const creator =
      {
        _id: currentUser._id,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
      } || null;

    return {
      planName,
      issueDate,
      creator,
    };
  }, [currentMeetingMinutes, currentUser]);

  const methods = useForm({
    resolver: yupResolver(NewPlanRoomSchema),
    defaultValues,
  });

  const {
    reset,
    getValues,
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  // useEffect(() => {
  //   reset(defaultValues);
  //   setFiles(existingAttachments)
  //   setAttachmentsError(false)
  // }, [versionType, setFiles, defaultValues, reset, existingAttachments]);

  if (!isEmpty(errors)) {
    window.scrollTo(0, 0);
  }

  const onSubmit = handleSubmit(async (data, val) => {
    try {
      confirm.onTrue();

      // if (val === 'review') isSubmittingRef.current = true;

      // let finalData;
      // const { _id, firstName, lastName, email } = currentUser;
      // const creator = _id;
      // if (isEmpty(currentMeetingMinutes)) {
      //   finalData = { ...data, owner, creator, projectId };
      // } else {
      //   finalData = { ...currentMeetingMinutes, ...data, creator, owner };
      // }

      // const formData = new FormData();
      // const attachments = [];
      // for (let index = 0; index < files.length; index += 1) {
      //   const file = files[index];
      //   if (file instanceof File) {
      //     formData.append('attachments', file);
      //   } else {
      //     attachments.push(file);
      //   }
      // }
      // finalData.attachments = attachments;
      // formData.append('body', JSON.stringify(finalData));

      // console.log('Final DATA', finalData);
      // console.log('files ', files);
      // console.log('formData ', formData);

      // let error;
      // let payload;
      // if ((!isEmpty(currentMeetingMinutes) && val === 'update' && id) || val === 'review' && id) {
      //   const res = await dispatch(editRfi({ formData, id }));
      //   error = res.error;
      //   payload = res.payload;
      // } else {
      //   const res = await dispatch(createRfi(formData));
      //   error = res.error;
      //   payload = res.payload;
      // }
      // if (!isEmpty(error)) {
      //   enqueueSnackbar(error.message, { variant: 'error' });
      //   return;
      // }
      // let message;
      // if (val === 'review') {
      //   message = `submitted`;
      // } else if (val === 'draft') {
      //   message = `saved`;
      // } else {
      //   message = `updated`;
      // }

      // if (val !== 'review') {
      //   enqueueSnackbar(`RFI ${message} successfully!`, { variant: 'success' });
      //   router.push(paths.subscriber.rfi.details(payload?._id));
      //   return;
      // }
      // await dispatch(submitRfiToArchitect(payload?._id));
      // enqueueSnackbar(`RFI ${message} successfully!`, { variant: 'success' });
      // console.log('payload', payload);
      // reset();
      // isSubmittingRef.current = false;
      // router.push(paths.subscriber.rfi.list);
    } catch (error) {
      enqueueSnackbar(`Error ${currentMeetingMinutes ? 'Updating' : 'Creating'} RFI`, {
        variant: 'error',
      });
    }
  });

  return (
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
                <RHFTextField name="planName" label="Plan Set Name" />
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
                    return (
                      <DatePicker
                        label="Issue Date"
                        views={['day']}
                        value={selectedDate}
                        // minDate={startOfDay(addDays(new Date(), 1))}
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
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              gap="2rem"
              sx={{ my: 3 }}
            >
              {!currentMeetingMinutes &&
                (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                  currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                  <LoadingButton
                    type="button"
                    onClick={() => {
                      onSubmit('review');
                    }}
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Upload
                  </LoadingButton>
                )}
              {!isEmpty(currentMeetingMinutes) && (
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
  );
}

MeetingMinutesNewEditForm.propTypes = {
  currentMeetingMinutes: PropTypes.object,
  id: PropTypes.string,
};
