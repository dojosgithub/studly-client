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

export default function FileManagerMoveDialog({ open, onClose, row }) {
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const folders = useSelector((state) => state.documents.moveList);
  const { enqueueSnackbar } = useSnackbar();
  // console.log(row);
  const handleClick = useDoubleClick({
    click: (e, data) => {
      console.log('INSIDE SINGLE', data);
      if (data._type === 'folder') {
        setSelectedFolder(data._id);
      }
    },
    doubleClick: (e, data) => {
      console.log('INSIDE DOUBLE', data);
      if (data._type === 'folder') {
        fetchData({ parentId: data._id });
      }
    },
  });

  useEffect(() => {
    dispatch(getDocumentsMoveList({}));
  }, [dispatch]);

  const fetchData = (params) => {
    dispatch(getDocumentsMoveList(params));
  };

  const handleClose = () => {
    dispatch(getDocumentsMoveList({}));
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
                <TableCell>Folder Name</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {folders?.docs?.length > 0 ? (
                folders.docs.map((folder) => (
                  <TableRow key={folder._id} onClick={(e) => handleClick(e, folder)}>
                    <TableCell>{folder.name}</TableCell>
                    {/* <TableCell>
                      <IconButton color={selectedFolder === folder._id ? 'primary' : 'default'}>
                        <ArrowForwardIcon />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>No folders available</TableCell>
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
