import { Helmet } from 'react-helmet-async';
// sections
import { SubscriberUpdatePasswordView } from 'src/sections/subscriber/auth/update-password';

// ----------------------------------------------------------------------

export default function UpdatePasswordPage() {
  return (
    <>
      <Helmet>
        <title>Studly:Update Password</title>
      </Helmet>

      <SubscriberUpdatePasswordView />
    </>
  );
}
