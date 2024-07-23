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
import { getProjectList } from 'src/redux/slices/projectSlice';
import PlanRoomAttachments from './plan-room-attachment';
import PlanRoomPDFSheetsDrawer from './plan-room-pdf-sheets-drawer';

// ----------------------------------------------------------------------

export default function PlanRoomNewEditForm({ currentPlanSet, id }) {
  const router = useRouter();
  const params = useParams();
  const confirm = useBoolean();

  const { pathname } = useLocation();
  const isSubmittingRef = useRef();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?.id);
  const existingAttachments = useMemo(
    () => (currentPlanSet?.attachments ? currentPlanSet?.attachments : []),
    [currentPlanSet]
  );
  const [files, setFiles] = useState(existingAttachments);
  const [attachmentsError, setAttachmentsError] = useState(false);

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
    const planName = currentPlanSet?.name ? currentPlanSet?.name : '';
    const issueDate = currentPlanSet?.issueDate ? new Date(currentPlanSet.issueDate) : null;
    const creator =
      {
        _id: currentUser._id,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
      } || null;

    // const attachments = currentPlanSet?.attachments ? currentPlanSet?.attachments : [];

    return {
      planName,
      issueDate,
      // attachments,
      creator,
    };
  }, [currentPlanSet, currentUser]);

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
  useEffect(() => {
    if (files.length > 0) {
      setAttachmentsError(false);
    }
    setAttachmentsError(false);
  }, [files]);

  if (!isEmpty(errors)) {
    window.scrollTo(0, 0);
  }

  const onSubmit = handleSubmit(async (data, val) => {
    try {
      if (files.length <= 0) {
        enqueueSnackbar('Min 1 File is required', { variant: 'error' });
        return;
      }
      confirm.onTrue();

      // if (val === 'review') isSubmittingRef.current = true;

      // let finalData;
      // const { _id, firstName, lastName, email } = currentUser;
      // const creator = _id;
      // if (isEmpty(currentPlanSet)) {
      //   finalData = { ...data, owner, creator, projectId };
      // } else {
      //   finalData = { ...currentPlanSet, ...data, creator, owner };
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
      // if ((!isEmpty(currentPlanSet) && val === 'update' && id) || val === 'review' && id) {
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
      //   router.push(paths.subscriber.rfi.details(payload?.id));
      //   return;
      // }
      // await dispatch(submitRfiToArchitect(payload?.id));
      // enqueueSnackbar(`RFI ${message} successfully!`, { variant: 'success' });
      // console.log('payload', payload);
      // reset();
      // isSubmittingRef.current = false;
      // router.push(paths.subscriber.rfi.list);
    } catch (error) {
      enqueueSnackbar(`Error ${currentPlanSet ? 'Updating' : 'Creating'} RFI`, {
        variant: 'error',
      });
    }
  });

  const handeFormSubmit = async (sheets, attachments) => {
    const formValues = getValues();
    // const mimeType = 'image/png';
    // const sheetsFileArray = sheets.map((sheet) => {
    //   const file = base64ToFile(sheet.src, `${sheet.title}-${Math.random() * 10}.png`, mimeType);
    //   return file;
    // });
    // console.log('sheetFileArray', sheetsFileArray);
    const modifiedSheets = sheets.map((sheet) => {
      // console.log(sheet);
      sheet.category = sheet.category?.map((cat) => ({
        id: cat.id,
        name: cat.name,
      }));
      const alphaMatch = sheet.title.match(/^[A-Za-z]+/);
      const numericMatch = sheet.title.match(/\d+/);
      sheet.titleAlpha = alphaMatch ? alphaMatch[0] : '';
      sheet.titleNumeric = numericMatch ? parseInt(numericMatch[0], 10) : 0;

      // const { src, ...rest } = sheet;
      // return rest;
      return sheet;
    });

    let finalData;
    const data = { ...formValues, sheets: modifiedSheets };
    const { _id, firstName, lastName, email } = currentUser;
    const creator = _id;
    if (isEmpty(currentPlanSet)) {
      finalData = { ...data, creator, projectId };
    } else {
      finalData = { ...currentPlanSet, ...data, creator };
    }
    const formData = new FormData();
    // const attachments = [];
    // for (let index = 0; index < files.length; index += 1) {
    //   const file = files[index];
    //   if (file instanceof File) {
    //     formData.append('attachments', file);
    //   } else {
    //     attachments.push(file);
    //   }
    // }
    finalData.attachments = attachments;
    // ? SHEET
    // const sheetAttachments = [];

    // for (let index = 0; index < sheetsFileArray.length; index += 1) {
    //   const file = sheetsFileArray[index];
    //   if (file instanceof File) {
    //     formData.append('sheetAttachments', file);
    //   } else {
    //     sheetAttachments.push(file);
    //   }
    // }
    // finalData.sheetAttachments = sheetAttachments;
    formData.append('body', JSON.stringify(finalData));


    const res = await dispatch(createPlanRoom(formData));
    const { error, payload } = res;
    if (!isEmpty(error)) {
      enqueueSnackbar('Error Publishing Sheets', { variant: 'error' });
      return;
    }
    confirm.onFalse();
    await dispatch(getProjectList());
    enqueueSnackbar('Sheets Published Successfully!', { variant: 'success' });

    // let error;
    // let payload;
    // if ((!isEmpty(currentPlanSet) && val === 'update' && id) || val === 'review' && id) {
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
    router.push(paths.subscriber.planRoom.list);
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
    <>
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

                <PlanRoomAttachments
                  files={files}
                  setFiles={setFiles}
                  error={attachmentsError ? { message: 'Min 1 file is required' } : null}
                  // setFiles={(nFiles) => { setFiles(nFiles); setValue('attachments', nFiles) }}
                  // error={(errors && errors?.attachments) ? errors?.attachments : null}
                />
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                gap="2rem"
                sx={{ my: 3 }}
              >
                {!currentPlanSet &&
                  (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                    currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
                    <>
                      {/* <LoadingButton
                        type="button"
                        onClick={() => onSubmit('draft')}
                        variant="outlined"
                        size="large"
                        loading={isSubmitting}
                      >
                        Save Draft
                      </LoadingButton> */}
                      <LoadingButton
                        type="button"
                        onClick={() => {
                          onSubmit('review');
                          if (files.length <= 0) {
                            setAttachmentsError(true);
                          }
                        }}
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                      >
                        Upload
                      </LoadingButton>
                    </>
                  )}
                {/* && !pathname.includes('revision') */}
                {!isEmpty(currentPlanSet) && (
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
      {isValid && files.length > 0 && confirm.value && (
        <PlanRoomPDFSheetsDrawer
          open={confirm.value}
          onClose={confirm.onFalse}
          files={files}
          onFormSubmit={handeFormSubmit}
        />
      )}
    </>
  );
}

PlanRoomNewEditForm.propTypes = {
  currentPlanSet: PropTypes.object,
  id: PropTypes.string,
};
