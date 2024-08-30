import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
// import { Box, Grid } from '@mui/material';

import React, { useEffect, useState } from 'react';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

// import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
// import { paths } from 'src/routes/paths';
// import { RouterLink } from 'src/routes/components';
// components
// // import { ProjectView } from 'src/sections/project/view';

// theme
// import { paper } from 'src/theme/css';

// import { getPlanRoomDetails } from 'src/redux/slices/planRoomSlice'; //
// import Scrollbar from '../scrollbar';
// import Logo from '../logo';
// import SimpleSlider from '../lighboxcustom/CustomReactSwipe';
// import ThumbnailsViewer from '../lighboxcustom/thumbnails';
import Iconify from 'src/components/iconify';
import PdfViewerAnotator from 'src/components/lighboxcustom/PdfViewerAnotator';

// ----------------------------------------------------------------------

const SubmittalPdfEditorDrawer = React.memo(({ open, onClose, onSave, file }) => {
  console.log('FILE', file);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [notes, setNotes] = React.useState([]);

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 2.5, pl: 5 }}
    >
      <>
        <Typography fontSize="1.5rem" fontWeight="bold">
          {file.name}
        </Typography>
        {/* <Logo /> */}
        <Stack direction="row" spacing={1}>
          <Button type="button" variant="contained" onClick={() => onSave(notes)}>
            Save
          </Button>
          <Button type="button" variant="outlined" onClick={onClose}>
            Close
          </Button>
          {/* <IconButton onClick={onClose}>
            <Iconify icon="gg:close-o" color="black" height={32} width={32} />
          </IconButton> */}
        </Stack>
      </>
    </Stack>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          width: '100%',
        },
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />
      <PdfViewerAnotator fileUrl={file.preview} notes={notes} setNotes={setNotes} />
    </Drawer>
  );
});

SubmittalPdfEditorDrawer.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  open: PropTypes.bool,
  file: PropTypes.object,
};

export default SubmittalPdfEditorDrawer;
