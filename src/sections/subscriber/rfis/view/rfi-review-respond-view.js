import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { setSubmittalResponse } from 'src/redux/slices/submittalSlice';
import RfiReviewRespondForm from '../rfi-review-respond-form';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondView({ id }) {
  const settings = useSettingsContext();
  const dispatch = useDispatch()
  // // const submittalList = useSelector(state => state.submittal?.list?.docs)
  // // const currentSubmittal = submittalList?.find(item => item.id === id)
  const currentSubmittal = useSelector(state => state.submittal.current)
  useEffect(() => {
    // dispatch(setSubmittalResponse(currentSubmittal))
    console.log("currentSubmittal", currentSubmittal)
    console.log("submittalIdResponse", id)

  }, [dispatch, currentSubmittal, id])

  // console.log("currentSubmittalResponse", currentSubmittal)
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <Typography fontSize="1.5rem" fontWeight="bold" my={2}>Review and Respond</Typography> */}
      <CustomBreadcrumbs
        // heading="Add Submittal Response"
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
      <RfiReviewRespondForm currentSubmittal={currentSubmittal}  id={id}/>
    </Container>
  );
}
SubmittalsReviewRespondView.propTypes = {
  id: PropTypes.string,
};
