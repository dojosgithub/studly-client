import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState, useCallback } from 'react';
// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import { uploadDocument } from 'src/redux/slices/documentsSlice';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function DocumentsNewFileDialog({
  title = 'Upload Files',
  open,
  onClose,
  fetchData,
}) {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const currentProject = useSelector((state) => state?.project?.current);
  const listData = useSelector((state) => state?.documents?.list);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const handleDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    // if (files.length + newFiles.length > 10) {
    //   setErrorMsg('You can upload a maximum of 10 files.');
    //   // alert('You can upload a maximum of 10 files.');
    //   return;
    // }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // setFiles((prevFiles) => {
    //   if (prevFiles.length + newFiles.length > 10) {
    //     setErrorMsg('You can upload a maximum of 10 files.');
    //     console.log('You can upload a maximum of 10 files.');

    //     return prevFiles; // Don't update state
    //   }
    //   setErrorMsg(null); // Clear any previous error
    //   return [...prevFiles, ...newFiles];
    // });
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      const body = {
        type: 'file',
        parentId:
          listData.links.length > 2
            ? listData.links[listData.links.length - 1].href.replace('/', '')
            : null,
        projectId: currentProject._id,
      };

      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('attachments', file);
        }
      });
      console.log('Form Data:', files);
      formData.append('body', JSON.stringify(body));

      await dispatch(uploadDocument(formData));
      fetchData();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  useEffect(() => {
    if (files.length > 10) {
      setErrorMsg('You can upload a maximum of 10 files.');
    } else {
      setErrorMsg(null);
    }
  }, [files]);

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
    // if (filtered.length <= 10) setErrorMsg(null);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    // setErrorMsg(null);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {!errorMsg && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">You can upload a maximum of 10 files.</Typography>
          </Alert>
        )}
        <Upload
          multiple
          files={files}
          setFiles={setFiles}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          maxFiles={10}
          maxSize={500 * 1024 * 1024}
        />
      </DialogContent>

      <DialogActions>
        <LoadingButton
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          // disabled={!files.length}
          // disabled={files.length === 0 || files.length > 10}
          disabled={files.length === 0 || !!errorMsg}
          onClick={handleUpload}
          loading={loading} // Pass loading state to show spinner in button
        >
          Upload
        </LoadingButton>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

DocumentsNewFileDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  fetchData: PropTypes.func,
};
