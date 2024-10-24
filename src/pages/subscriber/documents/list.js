import { Helmet } from 'react-helmet-async';
// import { DocumentsListView } from 'src/sections/subscriber/documents/view';
import DocumentsListView from 'src/sections/subscriber/documents/view/documents-list-view';
// sections

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
