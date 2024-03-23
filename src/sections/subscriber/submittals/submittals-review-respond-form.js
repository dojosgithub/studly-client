import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState } from 'react';
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
  RHFSelectChip
} from 'src/components/hook-form';
import { createNewSubmittal, editSubmittal } from 'src/redux/slices/submittalSlice';
import SubmittalAttachments from './submittals-attachment';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondForm({ id }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const existingAttachments = []
  const [files, setFiles] = useState(existingAttachments)
  const user = useSelector(state => state.user.user)
  const projectId = useSelector(state => state.project.current._id)
  const trades = useSelector(state => state.project?.current?.trades)
  const { enqueueSnackbar } = useSnackbar();

  const NewSubmittalSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    status: Yup.string().required('Status is required'),
    // attachments: Yup.array().min(1),

  });

  const defaultValues = useMemo(
    () => ({
      comment: '',
      status: '',

    }),
    []
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  console.log("values", values)
  console.log("params", params)
  console.log("user", user)
  const onSubmit = handleSubmit(async (data) => {
    // enqueueSnackbar(currentSubmittal ? 'Update success!' : 'Create success!');
    try {
      if (isEmpty(params)) {
        enqueueSnackbar('Submittal Id not Found', { variant: "error" });
        return
      }
      console.log("data", data)

      const finalData = { submittalId: params?.id, ...data };

      // if (isEmpty(currentSubmittal)) {
      //   // const creator = { _id, name: `${firstName} ${lastName}`, email }
      //   const submittedDate = new Date()
      //   const link = 'www.google.com'
      //   finalData = { ...data, creator, submittedDate, link, projectId, trade }
      // } else {
      //   finalData = { ...currentSubmittal, ...data, creator, trade }
      // }
      console.log('finalData', finalData)


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
      finalData.attachments = attachments
      formData.append('body', JSON.stringify(finalData));

      console.log('Final DATA', finalData);
      console.log('files ', files)
      console.log('formData ', formData)

      // let error;
      // let payload;
      // // if (!isEmpty(currentSubmittal) && id) {
      // //   const res = await dispatch(editSubmittal({ formData, id }))
      // //   error = res.error
      // //   payload = res.payload
      // // } else {
      // //   const res = await dispatch(createNewSubmittal(formData))
      // //   error = res.error
      // //   payload = res.payload
      // // }
      // if (!isEmpty(error)) {
      //   enqueueSnackbar(error.message, { variant: "error" });
      //   return
      // }
      // reset();
      // // enqueueSnackbar(currentSubmittal ? 'Submittal updated successfully!' : 'Submittal created successfully!', { variant: 'success' });
      // router.push(paths.subscriber.submittals.list);


    } catch (error) {
      // console.error(error);
      console.log('error-->', error);
      // enqueueSnackbar(`Error ${currentSubmittal ? "Updating" : "Creating"} Project`, { variant: "error" });
    }
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={4}

              my={3}
              display="flex"
              flexDirection="column"
            >

              {/* // TODO: SHOW CHIP */}
              <RHFSelect
                name="status"
                label="Status"
                chip
              >
                <MenuItem selected value="Draft">Draft</MenuItem>
              </RHFSelect>
              <RHFTextField name="comment" label="Add a comment" />



              <SubmittalAttachments files={files} setFiles={setFiles} />



            </Box>


            <Stack alignItems="flex-end" sx={{ my: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SubmittalsReviewRespondForm.propTypes = {
  id: PropTypes.string
};
