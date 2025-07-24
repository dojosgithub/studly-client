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
import Grid from '@mui/material/Unstable_Grid2';

import { addDays, isTomorrow, startOfDay } from 'date-fns';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFMultiSelect } from 'src/components/hook-form';
import { SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
import {
  createNewSubmittal,
  editSubmittal,
  getSubmittalDetails,
  submitSubmittalToArchitect,
} from 'src/redux/slices/submittalSlice';
import { getCurrentProjectTradesById, getProjectList } from 'src/redux/slices/projectSlice';
import { updateSubmittalId } from 'src/utils/submittalId';
import SubmittalAttachments from './submittals-attachment';

// ----------------------------------------------------------------------

export default function SubmittalsNewEditForm({ currentSubmittal, id }) {
  const router = useRouter();
  const params = useParams();
  const { pathname } = useLocation();
  const isSubmittingRef = useRef();
  const dispatch = useDispatch();
  const ccList = useSelector((state) => state.submittal.users);
  const ownerList = useSelector((state) => state.submittal.assigneeUsers);
  const currentUser = useSelector((state) => state.user?.user);
  const projectId = useSelector((state) => state.project?.current?._id);
  const trades = useSelector((state) => state.project?.current?.trades);
  const existingAttachments = useMemo(
    () => (currentSubmittal?.attachments ? currentSubmittal?.attachments : []),
    [currentSubmittal]
  );
  const [files, setFiles] = useState(existingAttachments);
  const [tradeObject, setTradeObject] = useState(currentSubmittal ? currentSubmittal?.trade : null);

  useEffect(() => {
    if (currentSubmittal) setTradeObject(currentSubmittal?.trade);
  }, [currentSubmittal]);

  useEffect(() => {
    if (pathname.includes('revision')) {
      setFiles([]);
    } else {
      setFiles(existingAttachments);
    }
  }, [pathname, existingAttachments]);

  const { enqueueSnackbar } = useSnackbar();

  const NewSubmittalSchema = Yup.object().shape({
    trade: Yup.string().required('Trade is required'),
    submittalId: Yup.string(),
    name: Yup.string().required('Name is required'),
    leadTime: Yup.string().required('Lead time is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    status: Yup.string().required('Status is required'),
    returnDate: Yup.date()
      .required('Return Date is required')
      .min(startOfDay(addDays(new Date(), 1)), 'Return Date must be later than today'),
    owner: Yup.array(),
    ccList: Yup.array(),
  });

  const defaultValues = useMemo(() => {
    let submittalId = '';
    let trade = '';
    let name = '';
    let leadTime = '';
    let description = '';
    let type = '';
    let status = 'Draft';
    let returnDate = null;
    const ccListInside = currentSubmittal?.ccList || [];
    const owner = currentSubmittal?.owner?.map((item) => item.email) || [];
    if (currentSubmittal) {
      submittalId = currentSubmittal.submittalId || '';
      trade = `${currentSubmittal?.trade?.tradeId}-${currentSubmittal?.trade?.name}`;

      if (pathname.includes('revision')) {
        // ? currentSubmittal contains parentSubmittal we retrieve revisionCount from there.
        const revisionCount =
          currentSubmittal?.parentSubmittal?.revisionCount || currentSubmittal?.revisionCount;
        const isParentSubmittalHasRevisions = currentSubmittal?.parentSubmittal?.revisionCount > 0;
        submittalId = updateSubmittalId(submittalId, revisionCount, isParentSubmittalHasRevisions);
      } else {
        name = currentSubmittal?.name || '';
        leadTime = currentSubmittal?.leadTime || '';
        description = currentSubmittal?.description || '';
        type = currentSubmittal?.type || '';
        status = currentSubmittal?.status || 'Draft';
        returnDate = currentSubmittal?.returnDate ? new Date(currentSubmittal.returnDate) : null;
      }
    }

    return {
      trade,
      submittalId,
      name,
      leadTime,
      description,
      owner,
      type,
      ccList: ccListInside,
      status,
      returnDate,
    };
  }, [currentSubmittal, pathname]);

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

  const values = watch();
  const { submittalId } = values;

  useEffect(() => {
    if (!isEmpty(currentSubmittal)) {
      reset(defaultValues);
    }
  }, [reset, currentSubmittal, defaultValues]);

  if (!isEmpty(errors)) {
    window.scrollTo(0, 0);
  }
  const handleSelectTrade = useCallback(
    (option) => {
      const sequence = option.submittalCreatedCount + 1;
      const id1 = concat(option.tradeId, '-', sequence).join('');
      setTradeObject(option);
      setValue(`submittalId`, id1);
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data, val, secondVal) => {
    try {
      const owner = ownerList
        .filter((item) => data?.owner?.includes(item.email)) // Filter based on matching emails
        .map((item) => (item.user ? item.user : item._id));
        
      if (val === 'review' && owner.length === 0) {
        enqueueSnackbar('Submittal can not be submitted without owner', { variant: 'error' });
        return;
      }

      let trade;
      if (isEmpty(currentSubmittal)) {
        trade = {
          ...tradeObject,
          submittalCreatedCount: (tradeObject?.submittalCreatedCount || 0) + 1,
        };
      } else if (!isEmpty(currentSubmittal) && pathname.includes('revision')) {
        trade = {
          ...tradeObject,
          submittalCreatedCount: tradeObject?.submittalCreatedCount || 0,
        };
      } else {
        // edit
        trade = {
          ...tradeObject,
          submittalCreatedCount: tradeObject?.submittalCreatedCount || 0,
        };
      }
      if (!trade) {
        return;
      }

      let finalData;
      const { _id } = currentUser;
      const creator = _id;
      if (isEmpty(currentSubmittal)) {
        const link = 'www.google.com';
        finalData = { ...data, owner, creator, link, projectId, trade };
      } else if (!isEmpty(currentSubmittal) && pathname.includes('revision')) {
        const link = 'www.google.com';

        finalData = {
          ...data,
          owner,
          creator,
          link,
          projectId,
          trade,
          parentSubmittal: params?.id,
        };
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

      let error;
      let payload;
      if (!isEmpty(currentSubmittal) && !pathname.includes('revision') && id) {
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
      if (val !== 'review') {
        if (!secondVal) {
          enqueueSnackbar(
            currentSubmittal
              ? 'Submittal updated successfully!'
              : 'Submittal created successfully!',
            { variant: 'success' }
          );
        }
        router.push(paths.subscriber.submittals.details(payload?._id));

        return;
      }
      const result = await handleSubmitToArchitect(payload?._id);
      if (!result) return;
      reset();

      router.push(paths.subscriber.submittals.list);
    } catch (error) {
      enqueueSnackbar(`Error ${currentSubmittal ? 'Updating' : 'Creating'} Project`, {
        variant: 'error',
      });
    }
  });

  const handleSubmitToArchitect = async (SubmittalId) => {
    isSubmittingRef.current = true;
    const { error, payload } = await dispatch(submitSubmittalToArchitect(SubmittalId));
    isSubmittingRef.current = false;
    if (!isEmpty(error)) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return false;
    }
    enqueueSnackbar('Submittal has been successfully sent for review', { variant: 'success' });
    await dispatch(getSubmittalDetails(SubmittalId));
    return true;
  };

  return (
    <>
      {currentSubmittal &&
        currentSubmittal?.status === 'Draft' &&
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
                  <RHFSelect name="trade" label="Trade" disabled={!!currentSubmittal}>
                    {trades?.map((trade) => (
                      <MenuItem
                        key={trade.tradeId}
                        value={`${trade?.tradeId || ''}-${trade?.name || ''}`}
                        onClick={() => handleSelectTrade(trade)}
                      >
                        {trade?.tradeId}-{trade?.name}
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
                </Box>
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
                  <RHFTextField name="leadTime" label="Lead Time" />
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
                  <RHFSelect name="status" label="Status" chip disabled>
                    <MenuItem selected value="Draft">
                      Draft
                    </MenuItem>
                  </RHFSelect>

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
                      return (
                        <DatePicker
                          label="Request Return Date"
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
                  <RHFSelect name="type" label="Type">
                    <MenuItem value="Shop Drawings">Shop Drawings</MenuItem>
                    <MenuItem value="Samples">Samples</MenuItem>
                    <MenuItem value="Cut Sheet">Cut Sheet</MenuItem>
                  </RHFSelect>
                </Box>
                <SubmittalAttachments files={files} setFiles={setFiles} />

                <RHFMultiSelect
                  name="owner"
                  label="Assignee/Owner"
                  disabled={
                    pathname.includes('revision')
                      ? false
                      : currentSubmittal && currentSubmittal?.status !== 'Draft'
                  }
                  // placeholder="Select multiple options"
                  chip
                  options={ownerList?.map((item) => ({ label: item.email, value: item.email }))}
                />
                <RHFMultiSelect
                  name="ccList"
                  label="CC List"
                  disabled={
                    pathname.includes('revision')
                      ? false
                      : currentSubmittal && currentSubmittal?.status !== 'Draft'
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
                {(!currentSubmittal || (currentSubmittal && pathname.includes('revision'))) &&
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

                {currentSubmittal && !pathname.includes('revision') && (
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

SubmittalsNewEditForm.propTypes = {
  currentSubmittal: PropTypes.object,
  id: PropTypes.string,
};
