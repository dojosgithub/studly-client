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

export default function FileManagerNewFileDialog({ title = 'Upload Files', open, onClose }) {
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
        type: 'file',
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
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload
          multiple
          files={files}
          setFiles={setFiles}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={!files.length}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFileDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
