import { Helmet } from 'react-helmet-async';
// sections
import { CompanyCreateView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Create a new Company</title>
      </Helmet>

      <CompanyCreateView />
    </>
  );
}
