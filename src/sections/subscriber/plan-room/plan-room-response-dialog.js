import { useCallback, useEffect, useMemo } from 'react';
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
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { Stack, Table, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFMultiSelect,
  RHFSelect, RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
// mock
import { PROJECT_INVITE_USERS_INTERNAL, PROJECT_INVITE_USER_ROLES, SUBSCRIBER_USER_ROLE_STUDLY, USER_TYPES_STUDLY, getRoleKeyByValue } from 'src/_mock';
import { setAddExternalUser, setAddInternalUser, setInvitedSubcontractor, setMembers } from 'src/redux/slices/projectSlice';
// inviteSubcontractor, 
import CustomAutoComplete from 'src/components/custom-automcomplete';
import { sendToAll } from 'src/redux/slices/submittalSlice';
import Editor from 'src/components/editor/editor';
import { submitRfiResponse } from 'src/redux/slices/rfiSlice';
// components

// ----------------------------------------------------------------------

export default function SubmittalSendAllDialog({
  //
  open,
  onClose,
  // userList,
  ...other
}) {
  const { id } = useParams();
  const userList = useSelector((state) => state?.submittal?.projectUsersAll) || [];
  const userId = useSelector((state) => state?.user?.user?._id) || '';


  const dispatch = useDispatch()
  console.log('userId--->', userId);
  console.log('userList--->', userList);
  const RfiResponseSchema = Yup.object().shape({
    text: Yup.string().required('text is required'),
    respondedBy: Yup.string().required('user id is required'),

  });

  const defaultValues = useMemo(() => ({
    text: '',
    respondedBy: userId || ''
  }), [userId]);

  const methods = useForm({
    resolver: yupResolver(RfiResponseSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  const handleEditorChange = (content, delta, source, editor) => {
    // You can get the entire content in HTML format
    const htmlContent = editor.getHTML();
    // Or you can get it in other formats, like Delta
    const deltaContent = editor.getContents();
    // Or plain text
    const textContent = editor.getText();

    console.log('htmlContent', htmlContent)
    console.log('deltaContent', deltaContent)
    console.log('textContent', textContent)

    setValue("text", htmlContent);
  };


  const onSubmit = handleSubmit(async (data) => {
    try {


      console.log('data', data)
      const finalData = {
        id,
        formData: data
        }
      console.log('finalData', finalData)
      const { error, payload } = await dispatch(submitRfiResponse(finalData))
      console.log('e-p', { error, payload });
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      enqueueSnackbar('RFI response submitted successfully', { variant: 'success' });
      reset()
      onClose()


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
        <LoadingButton loading={isSubmitting} color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
          Submit Response
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

SubmittalSendAllDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // userList: PropTypes.array,
};
