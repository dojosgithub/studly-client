import PropTypes from 'prop-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useFieldArray, useFormContext, useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { uploadDocument } from 'src/redux/slices/documentsSlice';
import axiosInstance, { endpoints } from 'src/utils/axios';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  onCreate,

  folderName,
  onChangeFolderName,
  fetchData,
  ...other
}) {
  const [files, setFiles] = useState([]);
  const currentProject = useSelector((state) => state?.project?.current);
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);
  const dispatch = useDispatch();
  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);
  const handleUpload = async () => {
    try {
      const formData = new FormData();

      const body = {
        name: folderName,
        type: 'folder',
        parentId: null,
        projectId: currentProject.id,
      };

      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('attachments', file);
        }
      });

      formData.append('body', JSON.stringify(body));

      console.log(formData);
      await dispatch(uploadDocument(formData));
      console.log('Upload successful');
      fetchData();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {onCreate && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload
          multiple
          files={files}
          setFiles={setFiles}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </DialogContent>

      <DialogActions>
        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={!files.length}
        >
          Upload
        </Button> */}

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Button variant="contained" onClick={handleUpload}>
            Create
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  fetchData: PropTypes.func,
};
