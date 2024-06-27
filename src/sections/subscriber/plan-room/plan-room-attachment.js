import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
//
import { useFormContext } from 'react-hook-form';
import { useSnackbar } from 'src/components/snackbar';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function PlanRoomAttachments({
  //
  onCreate,
  onUpdate,
  //
  files,
  setFiles,
  error,
  helperText,
  // preview=true,
  //
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();
  // const { setValue, getValues } = useFormContext()
  // const { attachments: files } = getValues()

  // useEffect(() => {
  //     setFiles([]);
  // }, [setFiles]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      // const newFiles = acceptedFiles.map((file) =>
      //   Object.assign(file, {
      //     preview: URL.createObjectURL(file),
      //   })
      // );
      const totalFiles = acceptedFiles.length + files.length;
      console.log('totalFiles', totalFiles);
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
      // setValue('attachments', [...files, ...newFiles])
    },
    [files, setFiles, enqueueSnackbar]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
    // setValue('attachments', filtered)
  };
  
  const handleRemoveAllFiles = () => {
    // setValue('attachments', [])
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
          // 'image/jpeg': ['.jpeg', '.jpg'],
          // 'image/png': ['.png'],
          // 'image/gif': ['.gif'],
          // 'application/msword': ['.doc'],
          // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          // 'application/vnd.ms-excel': ['.xls'],
          // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }}
        {...other}
        maxFiles={10}
        // maxSize={20000000}
        error={!!error}
        helperText={
          (!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ px: 2 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )
        }
      />

      {!!files.length && (
        <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
          Remove all
        </Button>
      )}
    </Box>
  );
}

PlanRoomAttachments.propTypes = {
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  files: PropTypes.array,
  setFiles: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  preview: PropTypes.bool,
};
