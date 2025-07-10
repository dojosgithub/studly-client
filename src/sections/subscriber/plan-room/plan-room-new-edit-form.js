import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { isTomorrow } from 'date-fns';

// @mui
// import { Checkbox, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
//
import { createPlanRoom } from 'src/redux/slices/planRoomSlice';
//
//
import { useBoolean } from 'src/hooks/use-boolean';
import { getProjectList } from 'src/redux/slices/projectSlice';
import PlanRoomAttachments from './plan-room-attachment';
import PlanRoomPDFSheetsDrawer from './plan-room-pdf-sheets-drawer';

// ----------------------------------------------------------------------

export default function PlanRoomNewEditForm({ currentPlanSet, id }) {
  const router = useRouter();
  const confirm = useBoolean();

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?._id);
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
    isLatest: Yup.boolean(),
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

    return {
      planName,
      issueDate,
      creator,
    };
  }, [currentPlanSet, currentUser]);

  const methods = useForm({
    resolver: yupResolver(NewPlanRoomSchema),
    defaultValues,
  });

  const {
    getValues,
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = methods;

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
    } catch (error) {
      enqueueSnackbar(`Error ${currentPlanSet ? 'Updating' : 'Creating'} RFI`, {
        variant: 'error',
      });
    }
  });

  const handeFormSubmit = async (sheets, attachments) => {
    const formValues = getValues();

    const modifiedSheets = sheets.map((sheet) => {
      sheet.category = sheet.category
        ? sheet.category?.map((cat) => ({
            id: cat?.id,
            name: cat?.name,
          }))
        : [];
      const alphaMatch = sheet.sheetNumber.match(/^[A-Za-z]+/);
      const numericMatch = sheet.sheetNumber.match(/\d+/);
      sheet.titleAlpha = alphaMatch ? alphaMatch[0] : '';
      sheet.titleNumeric = numericMatch ? parseInt(numericMatch[0], 10) : 0;

      return sheet;
    });

    let finalData;
    const data = { ...formValues, sheets: modifiedSheets };
    const { _id } = currentUser;
    const creator = _id;
    if (isEmpty(currentPlanSet)) {
      finalData = { ...data, creator, projectId };
    } else {
      finalData = { ...currentPlanSet, ...data, creator };
    }
    const formData = new FormData();

    finalData.attachments = attachments;

    formData.append('body', JSON.stringify(finalData));

    const res = await dispatch(createPlanRoom(formData));
    const { error } = res;
    if (!isEmpty(error)) {
      enqueueSnackbar('Error Publishing Sheets', { variant: 'error' });
      return;
    }
    confirm.onFalse();
    await dispatch(getProjectList());
    enqueueSnackbar('Sheets Published Successfully!', { variant: 'success' });

    router.push(paths.subscriber.planRoom.list);
  };

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
                />
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between "
                gap="2rem"
                sx={{ my: 3 }}
              >
                <RHFCheckbox name="isLatest" label="Latest" />

                {!currentPlanSet &&
                  (currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
                    currentUser?.role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
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
                  )}
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
