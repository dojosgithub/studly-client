import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cloneDeep, isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
// @mui
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider, FormControl, InputLabel, Select } from '@mui/material';
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
import { useBoolean } from 'src/hooks/use-boolean';
import SubmittalAttachments from './submittals-attachment';
import SubmittalPdfEditorDrawer from './submittal-pdf-editor-drawer';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondForm({ currentSubmittal, id }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const confirm = useBoolean();

  const existingAttachments = useMemo(
    () => (currentSubmittal?.response?.attachments ? currentSubmittal?.response?.attachments : []),
    [currentSubmittal?.response]
  );

  const [files, setFiles] = useState([]);
  const [markupFile, setMarkupFile] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const NewSubmittalSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    status: Yup.string().required('Status is required'),
    markedUpFiles: Yup.array(),
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
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const [hasFileChanges, setHasFileChanges] = useState(
    JSON.stringify(files) !== JSON.stringify(existingAttachments)
  );

  useEffect(() => {
    if (existingAttachments) setFiles(existingAttachments);
  }, [existingAttachments]);

  useEffect(() => {
    // Check if files have changed
    const hasChanges = JSON.stringify(files) !== JSON.stringify(existingAttachments);
    setHasFileChanges(hasChanges);
  }, [files, existingAttachments]);

  useEffect(() => {
    reset(defaultValues);
  }, [dispatch, currentSubmittal, id, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data, value) => {
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

      let error;
      let payload;
      if (currentSubmittal?.isResponseSubmitted && value === 'update' && params?.id) {
        const res = await dispatch(updateSubmittalResponseDetails({ formData, id: params?.id }));
        error = res.error;
        payload = res.payload;
      } else if (!currentSubmittal?.isResponseSubmitted && value === 'save' && params?.id) {
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
      let message = '';
      if (currentSubmittal?.isResponseSubmitted && value === 'update') {
        message = 'Submittal response updated successfully!';
      } else if (!currentSubmittal?.isResponseSubmitted && value === 'save') {
        message = 'Submittal response saved successfully!';
      } else {
        message = 'Submittal response submitted successfully!';
      }
      enqueueSnackbar(message, { variant: 'success' });
      router.push(paths.subscriber.submittals.details(params?.id));
    } catch (error) {
      let errorMessage = '';
      if (currentSubmittal?.isResponseSubmitted && value === 'update') {
        errorMessage = 'Error while updating submittal response!';
      } else if (!currentSubmittal?.isResponseSubmitted && value === 'save') {
        errorMessage = 'Error while saving submittal response!';
      } else {
        errorMessage = 'Error while submitting submittal response!';
      }
      enqueueSnackbar(`${errorMessage}`, { variant: 'error' });
    }
  });

  const handleSelect = (e) => {
    setMarkupFile(e.target.value);
  };

  const openDrawer = () => {
    confirm.onTrue();
  };

  const closeEditor = () => {
    confirm.onFalse();
  };

  const onSaveComments = (notes) => {
    const currentFiles = cloneDeep(files);
    currentFiles.push({
      ...markupFile,
      name: `reviewed_${markupFile.name}`,
      notes,
      isMarkedUp: true,
    });
    setFiles(currentFiles);
    closeEditor();
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={4} my={3} display="flex" flexDirection="column">
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

                {currentSubmittal?.attachments.length > 0 && (
                  <>
                    <Divider>OR</Divider>
                    <Stack direction="row" spacing={1}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Add Markup</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          label="Add Markup"
                          name="Add Markup"
                          value={markupFile}
                          onChange={(e) => handleSelect(e)}
                        >
                          {currentSubmittal?.attachments.map((item) => (
                            <MenuItem
                              key={item.key}
                              value={item}
                              sx={{ height: 50, px: 3, borderRadius: 0 }}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button onClick={openDrawer} disabled={!markupFile} variant="outlined">
                        Add
                      </Button>
                    </Stack>
                  </>
                )}
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
      {confirm.value && (
        <SubmittalPdfEditorDrawer
          open={confirm.value}
          onClose={closeEditor}
          file={markupFile}
          onSave={onSaveComments}
        />
      )}
    </>
  );
}

SubmittalsReviewRespondForm.propTypes = {
  currentSubmittal: PropTypes.object,
  id: PropTypes.string,
};
