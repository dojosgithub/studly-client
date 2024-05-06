import { Helmet } from 'react-helmet-async';
// sections
import { SubmittalsCreateView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Create a new Submittal</title>
      </Helmet>

      <SubmittalsCreateView />
    </>
  );
}
