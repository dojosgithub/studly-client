import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
// components
import {
  getDocumentsList,
  deleteDocument,
  downloadDocument,
  renameDocument,
} from 'src/redux/slices/documentsSlice';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FileThumbnail from 'src/components/file-thumbnail';
//
import { STUDLY_ROLES_ACTION } from 'src/_mock';
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import FileManagerShareDialog from './file-manager-share-dialog';
import RenameDialog from './file-manager-rename-dialogue';
import FileManagerFileDetails from './file-manager-file-details';
import FileManagerMoveDialog from './file-manager-move-dialogue';

// ----------------------------------------------------------------------

export default function FileManagerTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onRenameRow,
  onDownloadRow,
  fetchData,
}) {
  const theme = useTheme();

  const { name, size, _type, updatedAt, createdBy, shared, isFavorited, fileType, preview, _id } =
    row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();
  const currentdocument = useSelector((state) => state.documents?.current);

  const [inviteEmail, setInviteEmail] = useState('');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  const favorite = useBoolean(isFavorited);
  const handleRenameClick = () => {
    setCurrentName(name);
    setRenameDialogOpen(true);
  };
  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();
  const dispatch = useDispatch();

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => {
      if (_type === 'folder') {
        console.info('DOUBLE CLICK', _type);
        fetchData({ parentId: _id });
      }
    },
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  const handleDeleteItems = useCallback(async () => {
    await dispatch(deleteDocument(row._id));

    enqueueSnackbar('Document Deleted Successfully', { variant: 'success' });
    confirm.onFalse();
    onDeleteRow();
  }, [dispatch, enqueueSnackbar, confirm, row, onDeleteRow]);
  // const handleRenameRow = (id) => {
  //   dispatch(downloadDocument(row, id));
  // };
  const handleRenameRow = async (newName) => {
    try {
      // Dispatch the rename action with the new name

      await dispatch(renameDocument({ newName, _id }));
      // dispatch(getDocumentsList());

      // Provide feedback to the user
      enqueueSnackbar('Renamed Successfully', { variant: 'success' });

      // Optionally, refresh the data or perform other actions
      fetchData();
    } catch (error) {
      console.error('Error renaming item:', error);
      enqueueSnackbar('Failed to rename item', { variant: 'error' });
    }
  };

  // Function to handle downloading a row
  const handleDownloadRow = () => {
    if (_type === 'file') {
      // const a = document.createElement('a');
      // a.href = preview;
      // a.download = name;
      // a.click();
      let downloadUrl = preview;
      const uploadIndex = downloadUrl.indexOf('/upload/');
      if (uploadIndex !== -1) {
        // If /upload/ is not found in the URL, return the original URL
        const part1 = downloadUrl.slice(0, uploadIndex + 8); // Up to and including /upload/
        const part2 = downloadUrl.slice(uploadIndex + 8); // Everything after /upload/

        downloadUrl = `${part1}fl_attachment/${part2}`;
      }

      const a = document.createElement('a');

      // Set the href attribute to the file URL
      a.href = downloadUrl;

      // Set the download attribute to specify the filename
      a.download = name;

      // Append the anchor element to the body
      document.body.appendChild(a);

      // Programmatically click the link to trigger the download
      a.click();

      // Remove the anchor element from the body
      document.body.removeChild(a);
    } else if (_type === 'folder') {
      dispatch(downloadDocument(_id));
      // dispatch(getDocumentsList());
    }
    popover.onClose();
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail
              // file={_type === 'file' ? fileType : _type}
              file={_type === 'file' ? preview : _type}
              // file={preview}
              sx={{ width: 36, height: 36 }}
            />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                marginRight: 40,
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(updatedAt), 'dd MMM yyyy')}
            secondary={format(new Date(updatedAt), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={`${createdBy.firstName} ${createdBy.lastName}`}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>
        {/* <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(size)}
        </TableCell> */}

        {/* <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {type}
        </TableCell> */}
        {/* <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {shared &&
              shared.map((person) => (
                <Avatar key={person._id} alt={person.name} src={person.avatarUrl} />
              ))}
          </AvatarGroup>
        </TableCell> */}

        <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.documents.delete}>
          <TableCell
            align="right"
            sx={{
              px: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </RoleAccessWrapper>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleRenameClick(); // Open the rename dialog
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDownloadRow(_id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:download-minimalistic-bold" />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMoveDialogOpen(true);
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:folder-move-16-regular" />
          Move
        </MenuItem>
      </CustomPopover>

      <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
        fetchData={fetchData}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // onDeleteRow(confirm);
              handleDeleteItems();
            }}
          >
            Delete
          </Button>
        }
      />
      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        initialName={name}
        onConfirm={handleRenameRow}
      />

      {moveDialogOpen && (
        <FileManagerMoveDialog
          open={moveDialogOpen}
          onClose={() => {
            setMoveDialogOpen(false);
            fetchData();
          }}
          row={row}
        />
      )}
    </>
  );
}

FileManagerTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onRenameRow: PropTypes.func,
  onDownloadRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  fetchData: PropTypes.func,
};
