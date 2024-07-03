import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';

// @mui
import { isEmpty, parseInt } from 'lodash';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { AppBar, Stack, Table, Typography, Toolbar, IconButton, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFMultiSelect,
  RHFSelect, RHFTextField,
} from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
// mock
import Scrollbar from 'src/components/scrollbar';
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
  const confirmIsFormDisabled = useBoolean(false)
  const NewPlanSheetSchema = Yup.object().shape({
    sheets: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string()
          .required('Sheet title is required'),
          src: Yup.string().required('Image src is required'),
          category: Yup.array()
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
      confirmIsFormDisabled.onTrue()
      onFormSubmit(data?.sheets)
      // reset()
      // onClose()


    } catch (e) {
      console.error(e);
    }
  });
  console.log('dialog', getValues())
  const renderHead = (
    <AppBar position="sticky" top="0" color="primary">
      <Toolbar>

        <Typography variant="h6" sx={{ flex: 1, ml: 2,color:'black' }}>
          Sheet Thumbnail
        </Typography>
        <Typography variant="h6" sx={{ flex: 1, ml: 2,color:'black' }}>
          Sheet Title
        </Typography>

        <IconButton color="inherit" edge="start" onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
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
            // ...paper({ theme, bgcolor: theme.palette.background.default }),
            width: `calc(100% - ${280}px)`,
            'background': 'white',
            // ...isOnboarding && {
            //   width: '100%',
            // }
          },
          position: 'relative',
          height:'100%'
        }}
      >
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box flex={1} width='100%' paddingX="2rem">
          {/* <Scrollbar> */}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <PlanRoomPdfConverter files={files} />
            </FormProvider>
          {/* </Scrollbar> */}
        </Box>


        <Box sx={{ position: "sticky", bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'right', gap: '1.5rem', padding: '2rem',  backgroundColor: 'white',zIndex:10 }}>

          {onClose && (
            <Button variant="outlined" disabled={confirmIsFormDisabled.value} color="inherit" onClick={onClose}>
              Cancel
            </Button>
          )}
          <LoadingButton disabled={confirmIsFormDisabled.value} loading={confirmIsFormDisabled.value} color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
            Publish
          </LoadingButton>
        </Box>
      </Drawer>
  );
}

PlanRoomPDFSheetsDialog.propTypes = {
  onClose: PropTypes.func,
  onFormSubmit: PropTypes.func,
  open: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.file),
};
