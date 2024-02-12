import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Divider, Typography, Grid, Card, Box, Stack, alpha } from '@mui/material'
import { LoadingButton } from '@mui/lab';
// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';






const ProjectName = ({ getData, step }) => {



  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required('Company Name is required'),

  });
  const defaultValues = useMemo(
    () => ({
      name: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('step', step);
      console.log('data', data);
      // getData(data)
      reset();

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  return (
    <>
      <Typography sx={{ my: 2 }} fontSize='1.5rem' fontWeight='bold'>Start by naming your project</Typography>
      <Divider sx={{
        minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }} />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* <Grid container spacing={3}>

          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={4}
                columnGap={2}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                my={3}
                display="flex"
                flexDirection="column"
              >
                <RHFTextField name="name" label="Project Name" />


              </Box>

              <Stack alignItems="flex-end" sx={{ my: 3 }}>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid> */}
        <Box
          rowGap={4}
          columnGap={2}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          my={3}
          display="flex"
          flexDirection="column"
        >
          <RHFTextField name="name" label="Project Name" />


        </Box>

        {/* <Stack alignItems="flex-end" sx={{ my: 3 }}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack> */}
      </FormProvider>

    </>)
}

export default ProjectName


ProjectName.propTypes = {
  step: PropTypes.bool,
  getData: PropTypes.func,
};