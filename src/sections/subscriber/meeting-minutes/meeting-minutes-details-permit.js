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

export default function Permit({ data }) {
  const handleToggleStatus = (permit) => {
    permit.status = permit.status === 'Active' ? 'Inactive' : 'Active';
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Permit Number</TableCell>
            {/* <TableCell>Actions</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((permit, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {permit.status}
              </TableCell>
              <TableCell>{permit.date ? new Date(permit.date).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{permit.permitNumber}</TableCell>
              <TableCell>
                {/* <Button
                  // variant="contained"
                  // color={permit.status === 'Active' ? 'success' : 'primary'}
                  // onClick={() => handleToggleStatus(permit)}
                >
                  {permit.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Permit.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      permitNumber: PropTypes.string,
    })
  ).isRequired,
};
