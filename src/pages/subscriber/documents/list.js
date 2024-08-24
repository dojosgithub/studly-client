import { Helmet } from 'react-helmet-async';
// sections
import { FileManagerView } from 'src/sections/subscriber/documents/view';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <>
      <Helmet>
        <title> Documents List</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
