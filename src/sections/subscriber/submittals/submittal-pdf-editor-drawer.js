import React from 'react';
import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

import PdfViewerAnotator from 'src/components/lighboxcustom/PdfViewerAnotator';

// ----------------------------------------------------------------------

const SubmittalPdfEditorDrawer = React.memo(({ open, onClose, onSave, file }) => {
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
        <Stack direction="row" spacing={1}>
          <Button type="button" variant="contained" onClick={() => onSave(notes)}>
            Save
          </Button>
          <Button type="button" variant="outlined" onClick={onClose}>
            Close
          </Button>
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
