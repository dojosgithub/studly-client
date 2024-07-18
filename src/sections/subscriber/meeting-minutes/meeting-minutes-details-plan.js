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

const Plan = ({ data }) => {
  const handleTogglePlanTracking = (plan) => {
    plan.planTracking = plan.planTracking ? '' : 'Tracked';
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Plan Tracking</TableCell>
            <TableCell>Stamp Date</TableCell>
            
            {/* <TableCell>Actions</TableCell> */}
            <TableCell>Date Received</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((plan, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {plan.planTracking}
              </TableCell>
              <TableCell>{plan.stampDate ? new Date(plan.stampDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{plan.dateReceived ? new Date(plan.dateReceived).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                {/* <Button
                  variant="contained"
                  color={plan.planTracking ? 'success' : 'primary'}
                  onClick={() => handleTogglePlanTracking(plan)}
                >
                  {plan.planTracking ? 'Untrack' : 'Track'}
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Plan.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      planTracking: PropTypes.string,
      stampDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
      dateReceived: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    })
  ).isRequired,
};

export default Plan;
