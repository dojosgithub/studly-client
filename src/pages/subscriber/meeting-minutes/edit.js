import { Helmet } from 'react-helmet-async';
// sections
import { MeetingMinutesEditView } from 'src/sections/subscriber/meeting-minutes/view';

// ----------------------------------------------------------------------

export default function MeetingMinutesEditPage() {
  return (
    <>
      <Helmet>
        <title> Meeting Minutes Edit</title>
      </Helmet>

      <MeetingMinutesEditView />
    </>
  );
}
