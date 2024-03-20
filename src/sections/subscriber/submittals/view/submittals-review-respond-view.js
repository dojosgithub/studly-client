// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import SubmittalsReviewRespondForm from '../submittals-review-respond-form';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography fontSize="1.5rem" fontWeight="bold" my={2}>Review and Respond</Typography>
      <SubmittalsReviewRespondForm />
    </Container>
  );
}
