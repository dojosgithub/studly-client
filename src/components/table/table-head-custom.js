import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

export default function TableHeadCustom({
  order,
  orderBy,
  headLabel,
  onSort,
  rowCount = 0,
  numSelected = 0,
  onSelectAllRows,
  sortDir,
  handleSortChange,
  sx,
}) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell._id}
            align={headCell.align || 'left'}
            // sortDirection={orderBy === headCell._id ? order : false}
            sortDirection
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell._id === 'id' || headCell._id === 'rfiId' ? (
              <TableSortLabel
                hideSortIcon
                active
                // active
                direction={sortDir}
                onClick={() => handleSortChange()}
              >
                {headCell.label}

                {orderBy === headCell._id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
  sortDir: PropTypes.string,
  handleSortChange: PropTypes.func,
};
