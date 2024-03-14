import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { CompanyEditView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function CompanyEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Company Edit</title>
      </Helmet>

      <CompanyEditView id={`${id}`} />
    </>
  );
}
