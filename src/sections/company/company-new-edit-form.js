import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { cloneDeep } from 'lodash';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { createNewCompany, getCompanyDetails, updateCompany } from 'src/redux/slices/companySlice';

// ----------------------------------------------------------------------

export default function CompanyNewEditForm({ isEdit }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = params;

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Company Name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });
  useEffect(() => {
    if (isEdit) {
      dispatch(getCompanyDetails(id));
    }
  }, [id, dispatch, isEdit]);
  const currentLog = useSelector((state) => state?.company?.current);
  const defaultValues = useMemo(
    () => ({
      name: '',
      phoneNumber: '',
      address: '',
      email: '',
      firstName: '',
      lastName: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;
  useEffect(() => {
    if (isEdit && currentLog) {
      const clonedCompany = cloneDeep(currentLog);

      reset({
        name: clonedCompany.name,
        phoneNumber: clonedCompany.phoneNumber,
        address: clonedCompany.address,
        firstName: clonedCompany.company_admin?.firstName,
        lastName: clonedCompany.company_admin?.lastName,
        email: clonedCompany.company_admin?.email,
        status: clonedCompany.status,
      });
    }
  }, [currentLog, id, reset, isEdit]);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      let message;
      let res;

      if (isEdit) {
        message = 'updated';
        res = await dispatch(updateCompany({ data, id }));
      } else {
        message = 'created';
        res = await dispatch(createNewCompany(data));
      }

      const { error, payload } = res;

      if (error) {
        enqueueSnackbar(error.message || 'An error occurred while saving the daily log.', {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar(`company ${message} successfully!`, { variant: 'success' });
      reset();
      router.push(paths.admin.company.list);
    } catch (error) {
      enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
    } finally {
      setLoading(false); // Stop loading spinner
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box rowGap={4} my={3} display="flex" flexDirection="column">
              <RHFTextField name="name" label="Company Name" />
              <RHFTextField name="address" label="Company Address" />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="firstName" label="First Name" />
                <RHFTextField name="lastName" label="Last Name" />
              </Box>
              <RHFTextField name="email" label="Admin Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
            </Box>

            <Stack alignItems="flex-end" sx={{ my: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
                {isEdit ? 'Save Changes' : 'Create New Company'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CompanyNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};
