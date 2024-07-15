// import React, { useState } from 'react';
// import { Box, Button, Stack } from '@mui/material';
// import Iconify from 'src/components/iconify';
// import MeetingMinutesInviteAttendeeListView from './meeting-minutes-invite-attendee-list-view';
// import MeetingMinutesInviteAttendeeDialog from './meeting-minutes-invite-attendee-dialog';

// const MeetingMinutesInviteAttendeeView = () => {
//   const [openInviteUser, setOpenInviteUser] = useState(false);
//   const [type, setType] = useState('');

//   const handleInviteUser = (value) => {
//     setOpenInviteUser(true);
//     setType(value);
//   };

//   return (
//     <>
//       <Stack gap={2} textAlign='left'>
//         <Button
//           component='button'
//           variant="outlined"
//           startIcon={<Iconify icon="mdi:invite" />}
//           color='secondary'
//           type="button"
//           onClick={() => handleInviteUser('internal')}
//           sx={{ flexShrink: 0, maxWidth: 'max-content', mt: '2px', position: 'absolute', right: 0, top: 0 }}
//         >
//           Invite Attendee
//         </Button>
//         <MeetingMinutesInviteAttendeeListView />
//       </Stack>
//       <MeetingMinutesInviteAttendeeDialog
//         open={openInviteUser}
//         onClose={() => setOpenInviteUser(false)}
//         type={type}
//       />
//     </>
//   );
// }

// export default MeetingMinutesInviteAttendeeView;
