import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';

// @mui
import { isEmpty } from 'lodash';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { LoadingButton } from '@mui/lab';
// components
import { enqueueSnackbar } from 'notistack';
import FormProvider from 'src/components/hook-form';

import Editor from 'src/components/editor/editor';
import { submitRfiResponse } from 'src/redux/slices/rfiSlice';
// components

// ----------------------------------------------------------------------

export default function RfiResponseDialog({
  //
  open,
  onClose,
  ...other
}) {
  const { id } = useParams();
  const userId = useSelector((state) => state?.user?.user?._id) || '';

  const dispatch = useDispatch();
  const RfiResponseSchema = Yup.object().shape({
    text: Yup.string().required('text is required'),
    respondedBy: Yup.string().required('user id is required'),
  });

  const defaultValues = useMemo(
    () => ({
      text: '',
      respondedBy: userId || '',
    }),
    [userId]
  );

  const methods = useForm({
    resolver: yupResolver(RfiResponseSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleEditorChange = (content, delta, source, editor) => {
    // You can get the entire content in HTML format
    const htmlContent = editor.getHTML();
    // Or you can get it in other formats, like Delta
    const deltaContent = editor.getContents();
    // Or plain text
    const textContent = editor.getText();

    setValue('text', htmlContent);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.date = new Date();
      const finalData = {
        id,
        formData: data,
      };
      const { error, payload } = await dispatch(submitRfiResponse(finalData));
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      enqueueSnackbar('RFI response submitted successfully', { variant: 'success' });
      reset();
      onClose();
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle> Add RFI Response: </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Editor onChange={handleEditorChange} simple />
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <LoadingButton
          loading={isSubmitting}
          color="inherit"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
        >
          Submit Response
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

RfiResponseDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
