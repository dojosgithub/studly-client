import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';

import Drawer from '@mui/material/Drawer';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Scrollbar from 'src/components/scrollbar';

import { getDocumentsList, deleteDocument, updateDocument } from 'src/redux/slices/documentsSlice';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
//
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { STUDLY_ROLES_ACTION } from 'src/_mock';
import DocumentsShareDialog from './documents-share-dialog';

// ----------------------------------------------------------------------
const defaultFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};
export default function DocumentsFileDetails({
  item,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,

  onClose,
  fetchData,
  onDelete,
  ...other
}) {
  const { name, size, preview, _type, shared, updatedAt, fileType, _id } = item;

  const confirm = useBoolean();
  const dispatch = useDispatch();

  const [filters, setFilters] = useState(defaultFilters);
  const { enqueueSnackbar } = useSnackbar();
  const role = useSelector((state) => state?.user?.user?.role?.shortName);

  const share = useBoolean();

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const [tags, setTags] = useState(item.tags);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  // useEffect(() => {
  //   console.log('Running');
  //   return () => {
  //     console.log('Cleanup');
  //     dispatch(updateDocument(item._id, tags));
  //   };
  // }, [tags, dispatch, item._id]);

  const handleDeleteItems = useCallback(async () => {
    await dispatch(deleteDocument(item._id));
    enqueueSnackbar('Document Deleted Successfully', { variant: 'success' });
    dispatch(getDocumentsList({ search: filters.query, status: filters.status }));
  }, [dispatch, enqueueSnackbar, filters.status, filters.query, item._id]);
  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(updatedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {fileFormat(_type === 'file' ? fileType : _type)}
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Info </Typography>
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            <FileThumbnail
              imageView
              file={_type === 'file' ? preview : _type}
              sx={{ width: 64, height: 64 }}
              imgSx={{ borderRadius: 1 }}
            />

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {name}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}
          </Stack>
        </Scrollbar>

        <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.documents.delete}>
          {role === 'CAD' && (
            <Box sx={{ p: 2.5 }}>
              <Button
                fullWidth
                variant="soft"
                color="error"
                size="large"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={confirm.onTrue}
              >
                Delete
              </Button>
            </Box>
          )}
        </RoleAccessWrapper>

        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete File"
          content="Are you sure you want to delete this file?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteItems();

                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </Drawer>

      <DocumentsShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={onCopyLink}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />
    </>
  );
}

DocumentsFileDetails.propTypes = {
  favorited: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  open: PropTypes.bool,
  fetchData: PropTypes.func,
};
