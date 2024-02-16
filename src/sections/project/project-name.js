// @mui
import { Divider, Typography, Grid, Card, Box, Stack, alpha } from '@mui/material'
// form
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';






const ProjectName = () => (
  <>
    <Typography sx={{ my: 2 }} fontSize='1.5rem' fontWeight='bold'>Start by naming your project</Typography>
    <Divider sx={{
      minHeight: '1px', bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
    }} />

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
  </>)


export default ProjectName

