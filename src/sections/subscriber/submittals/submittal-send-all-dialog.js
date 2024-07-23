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


  const dispatch = useDispatch()
  const SendtoAllSchema = Yup.object().shape({
    users: Yup.array(Yup.string()).min(1, "Minimum 1 user is required").required("Users are required"),
    submittalId: Yup.string().required('submittalId is required'),

  });

  const defaultValues = useMemo(() => ({
    users: [],
    submittalId: id || ''
  }), [id]);

  const methods = useForm({
    resolver: yupResolver(SendtoAllSchema),
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



  const onSubmit = handleSubmit(async (data) => {
    try {



      const { error, payload } = await dispatch(sendToAll(data))
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }
      enqueueSnackbar(payload || 'Email send to users successfully', { variant: 'success' });
      onClose()


    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle> Send To: </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{ display: 'flex', flexDirection: "column", gap: '1rem', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
          >

            {userList.length > 0 && (
              <RHFMultiSelect
                name="users"
                label="Users"
                chip
                options={userList.map((item) => ({ label: item.email, value: item.email }))}
              />
            )}
          </Box>

        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <LoadingButton loading={isSubmitting} color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
          Send To All
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
