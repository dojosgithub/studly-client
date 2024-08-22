// @mui
import { Divider, Typography, Box, alpha } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// form
import { isEmpty, cloneDeep, isBoolean } from 'lodash';
import { RHFTextField } from 'src/components/hook-form';

const ProjectName = () => {
  const { trigger, reset } = useFormContext();

  const currentProject = useSelector((state) => state?.project?.current);
  console.log('raahim', currentProject);

  useEffect(() => {
    if (currentProject) {
      const updatedProject = cloneDeep(currentProject);

      // Extract the fields from the updated project
      const { name, address, state, city, zipCode } = updatedProject;

      // Reset the form with the updated project fields
      reset({ name, address, state, city, zipCode });
    }
  }, [currentProject, reset]);

  return (
    <>
      <Typography sx={{ my: 2 }} fontSize="1.5rem" fontWeight="bold">
        Your new project information
      </Typography>
      <Divider
        sx={{
          minHeight: '1px',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
      />

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
        <RHFTextField name="name" label="Project Name" onBlur={() => trigger('name')} />
        <RHFTextField name="address" label="Street Address" onBlur={() => trigger('address')} />

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <RHFTextField name="state" label="State" onBlur={() => trigger('state')} />
          <RHFTextField name="city" label="City" onBlur={() => trigger('city')} />
          <RHFTextField name="zipCode" label="Zip Code" onBlur={() => trigger('zipCode')} />
        </Box>
      </Box>
    </>
  );
};

export default ProjectName;
