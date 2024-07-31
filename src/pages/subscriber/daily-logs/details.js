import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { MeetingMinutesDetailsView } from 'src/sections/subscriber/daily-logs/view';
import { getDailyLogsDetails } from 'src/redux/slices/dailyLogsSlice';
// routes
import { useParams } from 'src/routes/hooks';
import DailyLogsDetailsView from 'src/sections/subscriber/daily-logs/view/daily-logs-details-view';
// sections

// ----------------------------------------------------------------------

export default function DailyLogsDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { id } = params;
  console.log('hehe', id);
  useEffect(() => {
    dispatch(getDailyLogsDetails(id));
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> Daily Logs Details</title>
      </Helmet>

      <DailyLogsDetailsView id={`${id}`} />
    </>
  );
}
