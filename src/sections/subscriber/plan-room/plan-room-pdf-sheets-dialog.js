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
import { AppBar, Stack, Table, Typography,Toolbar, IconButton, } from '@mui/material';
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
import PlanRoomPdfConverter from './plan-room-pdf-converter';
// components

// ----------------------------------------------------------------------

export default function PlanRoomPDFSheetsDialog({
  //
  open,
  onClose,
  files,
  onFormSubmit,
  ...other
}) {
  const { id } = useParams();


  const dispatch = useDispatch()
  const NewPlanSheetSchema = Yup.object().shape({
    sheets: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string()
            .required('Sheet title is required'),
          src: Yup.string().required('Image src is required'),
        })
      )
      .min(1, 'At least one trade is required'),
  });

  const defaultValues = useMemo(() => {
    const data = { title: '', src: '' };

    return {
      sheets: Array.from({ length: files.length }, () => ({ ...data })),
    };
  }, [files]);



  const methods = useForm({
    resolver: yupResolver(NewPlanSheetSchema),
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


      console.log('data', data)
      // console.log('e-p', { error, payload });
      // if (!isEmpty(error)) {
      // enqueueSnackbar(error.message, { variant: 'error' });
      //   return;
      // }
      enqueueSnackbar('Sheets Title', { variant: 'success' });
      onFormSubmit(data?.sheets)
      // reset()
      onClose()


    } catch (e) {
      console.error(e);
    }
  });
  console.log('dialog', getValues())
  return (
    <Dialog fullScreen fullWidth maxWidth="xl" open={open} onClose={onClose} {...other}>
      <AppBar position="relative" color="default">
        <Toolbar>

          <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
            Plan Sheet:
          </Typography>

          <IconButton color="inherit" edge="start" onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent >

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <PlanRoomPdfConverter files={files} />
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <LoadingButton loading={isSubmitting} color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
          Upload
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

PlanRoomPDFSheetsDialog.propTypes = {
  onClose: PropTypes.func,
  onFormSubmit: PropTypes.func,
  open: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.file),
};
