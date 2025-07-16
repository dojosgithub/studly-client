import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCheckbox, RHFSelect } from 'src/components/hook-form';
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

export default function PlanRoomExistingSetForm({ currentPlanSet, id }) {
  const router = useRouter();
  const confirm = useBoolean();

  const existingNameRef = useRef();
  const dispatch = useDispatch();
  const existingPlanList = useSelector((state) => state.planRoom?.existingList);
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?._id);
  const existingAttachments = useMemo(
    () => (currentPlanSet?.attachments ? currentPlanSet?.attachments : []),
    [currentPlanSet]
  );
  const [files, setFiles] = useState(existingAttachments);
  const [versionType, setVersionType] = useState('new');
  const [attachmentsError, setAttachmentsError] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const ExistingPlanRoomSchema = Yup.object().shape({
    planName: Yup.string().required('Plan Name is required'),
    issueDate: Yup.date().required('Issue Date is required'),
    isLatest: Yup.boolean(),
    existingVersionSet: Yup.string().required('Existing Version is required'),
  });

  const defaultValues = useMemo(() => {
    const planName = currentPlanSet?.name ? currentPlanSet?.name : '';
    const issueDate = currentPlanSet?.issueDate ? new Date(currentPlanSet.issueDate) : null;
    const existingVersionSet = '';

    return {
      planName,
      issueDate,
      existingVersionSet,
    };
  }, [currentPlanSet]);

  const methods = useForm({
    resolver: yupResolver(ExistingPlanRoomSchema),
    defaultValues,
  });

  const {
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    setFiles(existingAttachments);
    setAttachmentsError(false);
  }, [versionType, setFiles, defaultValues, reset, existingAttachments]);
  useEffect(() => {
    if (files.length > 0) {
      setAttachmentsError(false);
    }
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
      const alphaMatch = sheet.sheetTitle.match(/^[A-Za-z]+/);
      const numericMatch = sheet.sheetTitle.match(/\d+/);
      sheet.titleAlpha = alphaMatch ? alphaMatch[0] : '';
      sheet.titleNumeric = numericMatch ? parseInt(numericMatch[0], 10) : 0;
      return sheet;
    });

    const data = { ...formValues, sheets: modifiedSheets };
    const { _id } = currentUser;
    const creator = _id;
    const finalData = { ...data, creator, projectId };
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
  const handleSelectExisting = useCallback(
    (option) => {
      const { planName, issueDate, _id: versionId } = option;
      existingNameRef.current = planName;
      setValue(`planName`, planName);
      setValue(`issueDate`, issueDate);
      setValue(`existingVersionSet`, versionId);
    },
    [setValue]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={4} my={3} display="flex" flexDirection="column">
                <Box display="flex" sx={{ maxWidth: { xs: '100%', md: '40%' } }}>
                  <RHFSelect name="planName" label="Choose Existing Version Set">
                    {existingPlanList?.map((item) => (
                      <MenuItem
                        key={item._id}
                        value={item.planName}
                        onClick={() => handleSelectExisting(item)}
                      >
                        {item.planName}
                      </MenuItem>
                    ))}
                  </RHFSelect>
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

PlanRoomExistingSetForm.propTypes = {
  currentPlanSet: PropTypes.object,
  id: PropTypes.string,
};
