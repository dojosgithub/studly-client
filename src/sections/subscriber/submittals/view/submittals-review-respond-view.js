import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
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
import {  setCurrentSubmittalResponse } from 'src/redux/slices/submittalSlice';
import SubmittalsReviewRespondForm from '../submittals-review-respond-form';

// ----------------------------------------------------------------------

export default function SubmittalsReviewRespondView({id}) {
  const settings = useSettingsContext();
  const submittalList = useSelector(state => state.submittal?.list?.docs)
  const dispatch = useDispatch()
  const currentSubmittal = submittalList?.find(item => item.id === id)
  console.log("currentSubmittal", currentSubmittal)
  console.log("sumittalId", id)
  useEffect(() => {
    if (id) {
      dispatch(setCurrentSubmittalResponse(currentSubmittal?.response))
    }

  }, [dispatch, id, currentSubmittal])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography fontSize="1.5rem" fontWeight="bold" my={2}>Review and Respond</Typography>
      <SubmittalsReviewRespondForm currentSubmittalResponse={currentSubmittal?.response}/>
    </Container>
  );
}
SubmittalsReviewRespondView.propTypes = {
  id: PropTypes.string,
};
