import { Helmet } from 'react-helmet-async';
// sections
import { DocumentsListView } from 'src/sections/subscriber/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsListPage() {
  return (
    <>
      <Helmet>
        <title> Documents List</title>
      </Helmet>

      <DocumentsListView />
    </>
  );
}
