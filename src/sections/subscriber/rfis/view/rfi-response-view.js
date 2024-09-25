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
import Editor from 'src/components/editor/editor';

// ----------------------------------------------------------------------

export default function RfiResponseView({ id }) {
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const currentRfi = useSelector((state) => state.rfi.current);
  useEffect(() => {}, [dispatch, currentRfi, id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
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
      <Editor />
    </Container>
  );
}
RfiResponseView.propTypes = {
  id: PropTypes.string,
};
