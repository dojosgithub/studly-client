import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { getDocumentsMoveList, moveDocument } from 'src/redux/slices/documentsSlice';
import FileThumbnail from 'src/components/file-thumbnail';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom_breadcrumbs-move';

export default function DocumentsMoveDialog({ open, onClose, row }) {
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isOnRoot, setIsOnRoot] = useState(false);
  const folders = useSelector((state) => state.documents.moveList);
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = useDoubleClick({
    click: (e, folder) => {
      if (folder._type === 'folder') {
        setSelectedFolder((prevSelected) => (prevSelected === folder._id ? null : folder._id));
      }
    },
    doubleClick: (e, folder) => {
      if (folder._type === 'folder') {
        fetchData({ parentId: folder._id });
      }
    },
  });

  useEffect(() => {
    dispatch(getDocumentsMoveList({ limit: 1000 }));
  }, [dispatch]);

  const fetchData = (params) => {
    dispatch(getDocumentsMoveList({ ...params, limit: 1000 }));
  };

  const handleClose = () => {
    dispatch(getDocumentsMoveList({ limit: 1000 }));
    onClose();
  };
  const clicked = (item) => {
    if (/\b[a-fA-F0-9]{24}\b/.test(item)) {
      fetchData({ parentId: item.replace('/', '') });
      setIsOnRoot(false);
    } else {
      fetchData({ parentId: null });
      setIsOnRoot(true);
    }
  };
  const handleMove = async () => {
    if (selectedFolder) {
      console.log('Moving item to folder:', selectedFolder);
      await dispatch(moveDocument({ id: row._id, to: selectedFolder }));
      enqueueSnackbar('Moved Successfully', { variant: 'success' });
      handleClose();
      return;
    }
    if (isOnRoot) {
      await dispatch(moveDocument({ id: row._id, to: null }));
      enqueueSnackbar('Moved Successfully', { variant: 'success' });
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Move Item</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Documents Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folders?.docs?.length > 0 ? (
                folders.docs.map((folder) => {
                  const isFolder = folder._type === 'folder';
                  const isSelected = selectedFolder === folder._id;
                  const isBeingMoved = folder._id === row._id;

                  console.log('isParentOfMove', folder, row);
                  const rowBackgroundColor = isSelected ? '#D2E3FC' : 'inherit';
                  let hoverBackgroundColor;

                  if (isSelected) {
                    hoverBackgroundColor = '#D2E3FC';
                  } else if (isFolder && !isBeingMoved) {
                    hoverBackgroundColor = '#d3d3d3';
                  } else {
                    hoverBackgroundColor = 'inherit';
                  }

                  const isDisabled = !isFolder || isBeingMoved;

                  return (
                    <TableRow
                      key={folder._id}
                      onClick={(e) => !isDisabled && handleClick(e, folder)}
                      sx={{
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        backgroundColor: rowBackgroundColor,
                        '&:hover': {
                          backgroundColor: hoverBackgroundColor,
                        },
                        opacity: isDisabled ? 0.6 : 1,
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileThumbnail
                          file={isFolder ? 'folder' : 'file'}
                          sx={{ width: 36, height: 36, marginRight: 2 }}
                        />
                        {folder.name}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={1} align="center">
                    No documents available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ marginTop: '30px', marginBottom: '30px' }}>
        <Box sx={{ width: '100%' }}>
          {folders?.links && (
            <CustomBreadcrumbs
              notLink
              links={folders?.links?.slice(1).map((item) => ({
                name: item.name,
                href: item.href,
              }))}
              onClick={clicked}
            />
          )}
        </Box>

        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleMove} disabled={!selectedFolder && !isOnRoot}>
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DocumentsMoveDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    _type: PropTypes.string.isRequired,
  }).isRequired,
};
