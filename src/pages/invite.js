import { Helmet } from 'react-helmet-async';
// sections
import { InviteNewUserView } from 'src/sections/subscriber/invite/view';

// ----------------------------------------------------------------------

export default function InvitePage() {
  return (
    <>
      <Helmet><title> Invite</title></Helmet>

      <InviteNewUserView />
    </>
  );
}
