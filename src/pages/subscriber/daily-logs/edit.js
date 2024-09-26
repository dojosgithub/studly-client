import { Helmet } from 'react-helmet-async';
// sections
import { DailyLogsEditView } from 'src/sections/subscriber/daily-logs/view';

// ----------------------------------------------------------------------

export default function DailyLogsEditPage() {
  return (
    <>
      <Helmet>
        <title> Daily Logs Edit</title>
      </Helmet>

      <DailyLogsEditView />
    </>
  );
}
