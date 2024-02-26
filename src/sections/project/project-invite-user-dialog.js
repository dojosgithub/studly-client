import PropTypes from 'prop-types';
// @mui
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import ProjectUserInvitedItem from './project-user-invited-item';

// ----------------------------------------------------------------------

export default function ProjectInviteUserDialog({
  shared,
  onSendInvite,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  error,
  helperText,
  //
  open,
  onClose,
  ...other
}) {
  // const hasShared = shared && !!shared.length;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        {onChangeInvite && (
           <TextField
           fullWidth
           value={inviteEmail}
           placeholder="Email"
           onChange={onChangeInvite}
           error={error}
           helperText={helperText}
           InputProps={{
             endAdornment: (
               <InputAdornment position="end">
                 <Button
                   color="inherit"
                   variant="contained"
                   disabled={!inviteEmail || error}
                   onClick={onSendInvite}
                   sx={{ mr: -0.75 }}
                 >
                   Send Invite
                 </Button>
               </InputAdornment>
             ),
           }}
           sx={{ mb: 2 }}
         />
        )}

        {/* {hasShared && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {shared.map((person) => (
                <ProjectUserInvitedItem key={person.id} person={person} />
              ))}
            </List>
          </Scrollbar>
        )} */}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ProjectInviteUserDialog.propTypes = {
  inviteEmail: PropTypes.string,
  helperText: PropTypes.string,
  onChangeInvite: PropTypes.func,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  onSendInvite: PropTypes.func,
  open: PropTypes.bool,
  error: PropTypes.bool,
  shared: PropTypes.array,
};
