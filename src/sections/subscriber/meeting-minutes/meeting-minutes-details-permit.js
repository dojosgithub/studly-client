import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

export default function MeetingMinutesDetailsPermit({ data }) {
  const handleToggleStatus = (permit) => {
    permit.status = permit.status === 'Active' ? 'Inactive' : 'Active';
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 950 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Permit Number</TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((permit, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {permit.status}
              </TableCell>
              <TableCell>
                {permit.date ? new Date(permit.date).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>{permit.permitNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

MeetingMinutesDetailsPermit.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      permitNumber: PropTypes.string,
    })
  ).isRequired,
};
