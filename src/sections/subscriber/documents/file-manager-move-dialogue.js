import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { getDocumentsMoveList, moveDocument } from 'src/redux/slices/documentsSlice';
import FileThumbnail from 'src/components/file-thumbnail';

export default function FileManagerMoveDialog({ open, onClose, row }) {
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const folders = useSelector((state) => state.documents.moveList);
  const { enqueueSnackbar } = useSnackbar();
  // console.log(row);
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

  const handleMove = async () => {
    if (selectedFolder) {
      console.log('Moving item to folder:', selectedFolder);
      await dispatch(moveDocument({ id: row._id, to: selectedFolder }));
      enqueueSnackbar('Moved Successfully', { variant: 'success' });
      // await fetchData();
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
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {folders?.docs?.length > 0 ? (
                folders.docs.map((folder) => {
                  const isFolder = folder._type === 'folder';
                  const isSelected = selectedFolder === folder._id;
                  const isBeingMoved = folder._id === row._id;

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
                        {/* <Checkbox
              checked={isSelected} // Checkbox is checked if the folder is selected
              sx={{ marginRight: 2 }}
            /> */}
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
                    No folders available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleMove} disabled={!selectedFolder}>
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FileManagerMoveDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    _type: PropTypes.string.isRequired,
  }).isRequired,
};
