import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import SubmittalsReviewRespondForm from '../submittals-review-respond-form';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondView({ id }) {
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const currentSubmittal = useSelector((state) => state.submittal.current);
  useEffect(() => {}, [dispatch, currentSubmittal, id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Review and Respond"
        links={[
          {
            name: 'Submittals',
            href: paths.subscriber.submittals.list,
          },
          {
            name: 'Details',
            href: paths.subscriber.submittals.details(id),
          },
          { name: 'Response' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <SubmittalsReviewRespondForm currentSubmittal={currentSubmittal} id={id} />
    </Container>
  );
}
SubmittalsReviewRespondView.propTypes = {
  id: PropTypes.string,
};
