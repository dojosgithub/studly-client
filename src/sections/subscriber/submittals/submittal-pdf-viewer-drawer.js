import React from 'react';
import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

import Iconify from 'src/components/iconify';
import PdfMarkupViewer from 'src/components/lighboxcustom/PdfMarkupViewer';

// ----------------------------------------------------------------------

const SubmittalPdfViewerDrawer = React.memo(({ open, onClose, file }) => {
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
        <IconButton onClick={onClose}>
          <Iconify icon="gg:close-o" color="black" height={32} width={32} />
        </IconButton>
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
      <PdfMarkupViewer fileUrl={file.preview} notes={file.notes} />
    </Drawer>
  );
});

SubmittalPdfViewerDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  file: PropTypes.object,
};

export default SubmittalPdfViewerDrawer;
