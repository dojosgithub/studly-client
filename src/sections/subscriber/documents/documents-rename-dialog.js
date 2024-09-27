import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

function DocumentsRenameDialog({ open, onClose, initialName, onConfirm }) {
  const [newName, setNewName] = useState(initialName);

  const handleConfirm = () => {
    onConfirm(newName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Name"
          type="text"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleConfirm}>
          Rename
        </Button>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DocumentsRenameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};

export default DocumentsRenameDialog;
