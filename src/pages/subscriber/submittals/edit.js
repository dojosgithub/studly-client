import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SubmittalsEditView } from 'src/sections/subscriber/submittals/view';

// ----------------------------------------------------------------------

export default function SubmittalsEditPage() {
  const params = useParams();

  const { id } = params;
  console.log('edit', id)
  return (
    <>
      <Helmet>
        <title> Submittal Edit</title>
      </Helmet>

      <SubmittalsEditView id={`${id}`} />
    </>
  );
}
