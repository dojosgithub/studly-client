import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
//
import { useSnackbar } from 'src/components/snackbar';
// components
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function RfiAttachments({
  //
  onCreate,
  onUpdate,
  //
  files,
  setFiles,
  // preview=true,
  //
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const totalFiles = acceptedFiles.length + files.length;
      if (totalFiles > 10) {
        enqueueSnackbar('You can upload maximum of 10 files', { variant: 'error' });
        return;
      }
      const newFiles = acceptedFiles.slice(0, 10 - files.length).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files, setFiles, enqueueSnackbar]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Box>
      <Upload
        allow
        multiple
        files={files}
        onDrop={handleDrop}
        onRemove={handleRemoveFile}
        accept={{
          'application/pdf': ['.pdf'],
          'image/jpeg': ['.jpeg', '.jpg'],
          'image/png': ['.png'],
          'image/gif': ['.gif'],
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }}
        {...other}
        maxFiles={10}
        maxSize={500 * 1024 * 1024}
      />

      {!!files.length && (
        <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
          Remove all
        </Button>
      )}
    </Box>
  );
}

RfiAttachments.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  files: PropTypes.array,
  setFiles: PropTypes.func,
  preview: PropTypes.bool,
};
