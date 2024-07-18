import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export default function InviteAttendee({ data }) {
  const handleToggleAttendance = (attendee) => {
    attendee.attended = !attendee.attended;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Attended</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((attendee, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {attendee.name}
              </TableCell>
              <TableCell>{attendee.company}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell>
                {/* <Button
                  variant="contained"
                  color={attendee.attended ? 'success' : 'primary'}
                  onClick={() => handleToggleAttendance(attendee)}
                >
                  {attendee.attended ? 'Yes' : 'No'}
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

InviteAttendee.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      company: PropTypes.string,
      email: PropTypes.string,
      attended: PropTypes.bool,
    })
  ).isRequired,
};
