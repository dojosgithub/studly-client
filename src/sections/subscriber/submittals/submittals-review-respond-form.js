import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
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

import { addDays } from 'date-fns';
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
import {
  createNewSubmittal,
  editSubmittal,
  respondToSubmittalRequest,
  updateSubmittalResponseDetails,
} from 'src/redux/slices/submittalSlice';
import { REVIEW_STATUS } from 'src/utils/constants';
import SubmittalAttachments from './submittals-attachment';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondForm({ currentSubmittal, id }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  // const currentSubmittal = useSelector(state => state.submittal.current)

  const existingAttachments = useMemo(
    () => (currentSubmittal?.response?.attachments ? currentSubmittal?.response?.attachments : []),
    [currentSubmittal?.response]
  );

  const [files, setFiles] = useState(existingAttachments);
  const [hasFileChanges, setHasFileChanges] = useState(
    JSON.stringify(files) !== JSON.stringify(existingAttachments)
  );
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Check if files have changed
    const hasChanges = JSON.stringify(files) !== JSON.stringify(existingAttachments);
    setHasFileChanges(hasChanges);
  }, [files, existingAttachments]);

  const NewSubmittalSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    status: Yup.string().required('Status is required'),
    // attachments: Yup.array().min(1),
  });

  const defaultValues = useMemo(
    () => ({
      comment: currentSubmittal?.response?.comment || '',
      status: currentSubmittal?.response?.status || '',
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
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    // dispatch(setSubmittalResponse(currentSubmittal?.response))
    reset(defaultValues);
  }, [dispatch, currentSubmittal, id, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data, value) => {
    // enqueueSnackbar(currentSubmittal ? 'Update success!' : 'Create success!');
    try {
      if (isEmpty(params)) {
        enqueueSnackbar('Submittal Id not Found', { variant: 'error' });
        return;
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
      data.attachments = attachments;
      formData.append('body', JSON.stringify(data));

      // const { error, payload } = await dispatch(respondToSubmittalRequest({ formData, id: params?._id }))

      let error;
      let payload;
      if (currentSubmittal?.isResponseSubmitted && value === 'update' && params?._id) {
        const res = await dispatch(updateSubmittalResponseDetails({ formData, id: params?._id }));
        error = res.error;
        payload = res.payload;
      } else if (!currentSubmittal?.isResponseSubmitted && value === 'save' && params?._id) {
        const res = await dispatch(updateSubmittalResponseDetails({ formData, id: params?._id }));
        error = res.error;
        payload = res.payload;
      } else {
        const res = await dispatch(respondToSubmittalRequest({ formData, id: params?._id }));
        error = res.error;
        payload = res.payload;
      }
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      // reset();
      // let message = currentSubmittal?.isResponseSubmitted ? 'Submittal response updated successfully!' : 'Submittal response submitted successfully!'
      let message = '';
      if (currentSubmittal?.isResponseSubmitted && value === 'update') {
        message = 'Submittal response updated successfully!';
      } else if (!currentSubmittal?.isResponseSubmitted && value === 'save') {
        message = 'Submittal response saved successfully!';
      } else {
        message = 'Submittal response submitted successfully!';
      }
      enqueueSnackbar(message, { variant: 'success' });
      router.push(paths.subscriber.submittals.details(params?._id));
    } catch (error) {
      // console.error(error);
      console.log('error-->', error);
      // enqueueSnackbar(`Error ${currentSubmittal?.response ? "Updating" : "Creating"} Project`, { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box rowGap={4} my={3} display="flex" flexDirection="column">
              {/* // TODO: SHOW CHIP */}
              <RHFSelect
                name="status"
                label="Status"
                chip
                disabled={currentSubmittal?.isResponseSubmitted}
              >
                {REVIEW_STATUS?.map((item) => (
                  <MenuItem selected value={item}>
                    {item}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="comment" label="Add a comment" />

              <SubmittalAttachments files={files} setFiles={setFiles} thumbnail={false} />
            </Box>

            <Stack alignItems="flex-end" sx={{ my: 3 }}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                {!currentSubmittal?.isResponseSubmitted && (
                  <LoadingButton
                    type="button"
                    onClick={() => onSubmit('save')}
                    variant="outlined"
                    size="large"
                    loading={isSubmitting}
                    disabled={!isDirty && !hasFileChanges}
                  >
                    Save
                  </LoadingButton>
                )}
                {currentSubmittal?.isResponseSubmitted ? (
                  <LoadingButton
                    type="button"
                    onClick={() => onSubmit('update')}
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    disabled={!isDirty && !hasFileChanges}
                  >
                    Update
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    type="button"
                    onClick={() => onSubmit('submit')}
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Submit
                  </LoadingButton>
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SubmittalsReviewRespondForm.propTypes = {
  currentSubmittal: PropTypes.object,
  id: PropTypes.string,
};
