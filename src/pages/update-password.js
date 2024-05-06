import { Helmet } from 'react-helmet-async';
// sections
import { AccountView } from 'src/sections/account/view';
import { SubscriberUpdatePasswordView } from 'src/sections/subscriber/auth/update-password';
import SubscriberUpdatePassword from 'src/sections/subscriber/auth/update-password/subscriber-update-password';

// ----------------------------------------------------------------------

export default function UpdatePasswordPage() {
  return (
    <>
      <Helmet>
        <title>Studly:Update Password
        </title>
      </Helmet>

      <SubscriberUpdatePasswordView />
    </>
  );
}
