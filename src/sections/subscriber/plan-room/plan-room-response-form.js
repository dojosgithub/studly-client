import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
// @mui
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import {
  respondToSubmittalRequest,
  updateSubmittalResponseDetails,
} from 'src/redux/slices/submittalSlice';
import { REVIEW_STATUS } from 'src/utils/constants';
import PlanRoomAttachments from './plan-room-attachment';

// ----------------------------------------------------------------------

export default function PlanRoomResponseForm({ currentRfi, id }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  // const currentRfi = useSelector(state => state.submittal.current)

  const existingAttachments = useMemo(
    () => (currentRfi?.response?.attachments ? currentRfi?.response?.attachments : []),
    [currentRfi?.response]
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
      comment: currentRfi?.response?.comment || '',
      status: currentRfi?.response?.status || '',
    }),
    [currentRfi]
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
    reset(defaultValues);
  }, [dispatch, currentRfi, id, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data, value) => {
    // enqueueSnackbar(currentRfi ? 'Update success!' : 'Create success!');
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

      // const { error, payload } = await dispatch(respondToSubmittalRequest({ formData, id: params?.id }))

      let error;
      let payload;
      if (currentRfi?.isResponseSubmitted && value === 'update' && params?.id) {
        const res = await dispatch(updateSubmittalResponseDetails({ formData, id: params?.id }));
        error = res.error;
        payload = res.payload;
      } else if (!currentRfi?.isResponseSubmitted && value === 'save' && params?.id) {
        const res = await dispatch(updateSubmittalResponseDetails({ formData, id: params?.id }));
        error = res.error;
        payload = res.payload;
      } else {
        const res = await dispatch(respondToSubmittalRequest({ formData, id: params?.id }));
        error = res.error;
        payload = res.payload;
      }
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      // reset();
      // let message = currentRfi?.isResponseSubmitted ? 'Submittal response updated successfully!' : 'Submittal response submitted successfully!'
      let message = '';
      if (currentRfi?.isResponseSubmitted && value === 'update') {
        message = 'Submittal response updated successfully!';
      } else if (!currentRfi?.isResponseSubmitted && value === 'save') {
        message = 'Submittal response saved successfully!';
      } else {
        message = 'Submittal response submitted successfully!';
      }
      enqueueSnackbar(message, { variant: 'success' });
      router.push(paths.subscriber.submittals.details(params?.id));
    } catch (error) {
      // console.error(error);
      // enqueueSnackbar(`Error ${currentRfi?.response ? "Updating" : "Creating"} Project`, { variant: "error" });
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
                disabled={currentRfi?.isResponseSubmitted}
              >
                {REVIEW_STATUS?.map((item) => (
                  <MenuItem selected value={item}>
                    {item}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="comment" label="Add a comment" />

              <PlanRoomAttachments files={files} setFiles={setFiles} thumbnail={false} />
            </Box>

            <Stack alignItems="flex-end" sx={{ my: 3 }}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                {!currentRfi?.isResponseSubmitted && (
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
                {currentRfi?.isResponseSubmitted ? (
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

PlanRoomResponseForm.propTypes = {
  currentRfi: PropTypes.object,
  id: PropTypes.string,
};
