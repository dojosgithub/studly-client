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
import Editor from 'src/components/editor/editor';
import RfiResponseForm from '../rfi-response-form';

// ----------------------------------------------------------------------

export default function RfiResponseView({ id }) {
  const settings = useSettingsContext();
  const dispatch = useDispatch()
  const currentRfi = useSelector(state => state.rfi.current)
  useEffect(() => {
    console.log("currentRfi", currentRfi)
    console.log("rfiIdResponse", id)

  }, [dispatch, currentRfi, id])

  // console.log("currentRfiResponse", currentRfi)
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <Typography fontSize="1.5rem" fontWeight="bold" my={2}>Review and Respond</Typography> */}
      <CustomBreadcrumbs
        // heading="Add Submittal Response"
        heading="Response"
        links={[
          {
            name: 'RFI',
            href: paths.subscriber.rfi.list,
          },
          {
            name: 'Details',
            href: paths.subscriber.rfi.details(id),
          },
          { name: 'Response' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* <RfiResponseForm currentRfi={currentRfi}  id={id}/> */}
      <Editor/>
    </Container>
  );
}
RfiResponseView.propTypes = {
  id: PropTypes.string,
};
