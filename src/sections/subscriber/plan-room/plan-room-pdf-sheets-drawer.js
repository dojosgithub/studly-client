import { useMemo } from 'react';
import PropTypes from 'prop-types';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { AppBar, Typography, Toolbar, IconButton, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
// mock
import PlanRoomPdfConverter from './plan-room-pdf-converter';
// hooks

// ----------------------------------------------------------------------

export default function PlanRoomPDFSheetsDrawer({ open, onClose, files, onFormSubmit, ...other }) {
  const confirmIsFormDisabled = useBoolean(false);

  const NewPlanSheetSchema = Yup.object().shape({
    sheets: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required('Sheet title is required'),
          src: Yup.object().required('Image src is required'),
          category: Yup.array(),
        })
      )
      .min(1, 'At least one trade is required'),
    attachments: Yup.array(),
  });

  const defaultValues = useMemo(() => {
    const data = { title: '', src: '' };
    return {
      sheets: Array.from({ length: files.length }, () => ({ ...data })),
      attachments: [],
    };
  }, [files]);

  const methods = useForm({
    resolver: yupResolver(NewPlanSheetSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const hasDuplicateTitles = (items) => {
    const titles = new Set();
    return items.some((item) => {
      if (titles.has(item.title)) {
        return true; // Duplicate found
      }
      titles.add(item.title);
      return false; // No duplicate
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (hasDuplicateTitles(data?.sheets)) {
        enqueueSnackbar('Sheet titles should be unique within a plan set', { variant: 'error' });
        return;
      }
      confirmIsFormDisabled.onTrue();
      onFormSubmit(data?.sheets, data?.attachments);
    } catch (e) {
      console.error(e);
    }
  });

  // Responsive hook for handling mobile views
  const isMobile = useResponsive('down', 'md');

  const renderHead = (
    <AppBar
      position="sticky"
      top="0"
      color="primary"
      sx={{
        height: isMobile ? 56 : 64, // Smaller height for mobile
        px: isMobile ? 1 : 3, // Smaller padding for mobile
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            ml: isMobile ? 1 : 2,
            fontSize: isMobile ? '1rem' : '1.25rem', // Adjust font size for mobile
            color: 'black',
          }}
        >
          Sheet Thumbnail
        </Typography>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            ml: isMobile ? 1 : 2,
            fontSize: isMobile ? '1rem' : '1.25rem',
            color: 'black',
          }}
        >
          Sheet Title
        </Typography>

        <IconButton color="inherit" edge="start" onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

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
          width: isMobile ? '100%' : `calc(100% - 280px)`, // Full width on mobile
          background: 'white',
        },
        position: 'relative',
        height: '100%',
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        flex={1}
        width="100%"
        paddingX={isMobile ? '1rem' : '2rem'} // Smaller padding on mobile
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <PlanRoomPdfConverter files={files} />
        </FormProvider>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'right', // Center align buttons for mobile
          gap: isMobile ? '0.5rem' : '1.5rem', // Smaller gap on mobile
          padding: isMobile ? '1rem' : '2rem', // Adjust padding for mobile
          backgroundColor: 'white',
          zIndex: 10,
        }}
      >
        {onClose && (
          <Button
            variant="outlined"
            disabled={confirmIsFormDisabled.value}
            color="inherit"
            onClick={onClose}
            sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }} // Smaller font for mobile
          >
            Cancel
          </Button>
        )}
        <LoadingButton
          disabled={confirmIsFormDisabled.value}
          loading={confirmIsFormDisabled.value}
          color="inherit"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }} // Smaller font for mobile
        >
          Publish
        </LoadingButton>
      </Box>
    </Drawer>
  );
}

PlanRoomPDFSheetsDrawer.propTypes = {
  onClose: PropTypes.func,
  onFormSubmit: PropTypes.func,
  open: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.file),
};
