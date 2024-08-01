import { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TableRow, TableCell, IconButton, Box, MenuItem, Button } from '@mui/material';
import { isValid, parseISO, format } from 'date-fns';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

const DailyLogsTableRow = memo(
  ({ row, selected, onSelectRow, onDeleteRow, onEditRow, onViewRow }) => {
    const role = useSelector((state) => state?.user?.user?.role?.shortName);
    const confirm = useBoolean();
    const popover = usePopover();
    // console.log(row);
    const truncatedText =
      row.accidentSafetyIssues.length > 20
        ? `${row.accidentSafetyIssues.substring(0, 20)}...`
        : row.accidentSafetyIssues;

    return (
      <>
        <TableRow selected={selected}>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {new Date(row?.date).toLocaleDateString()}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.inspection && (
              <span>
                {row.inspection
                  .map((inspection) => (inspection.value))
                  .join(', ')}
              </span>
            )}
          </TableCell>

          <TableCell
            sx={{ whiteSpace: 'nowrap' }}
            dangerouslySetInnerHTML={{ __html: truncatedText }}
          />
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.visitors?.length}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.weather?.map((id, index) => (
              <span key={index}>
                {id}
                {index < row.weather.length - 1 && ', '}
              </span>
            ))}
          </TableCell>

          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </TableRow>

        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          {row.status !== 'Minutes' && (
            <>
              <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem>
              {(role === 'CAD' || role === 'PWU') && (
                <MenuItem
                  onClick={() => {
                    onEditRow(row.id);
                    popover.onClose();
                  }}
                >
                  <Iconify icon="solar:pen-bold" />
                  Edit
                </MenuItem>
              )}
            </>
          )}

          <MenuItem
            onClick={() => {
              onViewRow(row.id);
              popover.onClose();
            }}
          >
            <Iconify icon="ion:eye" style={{ color: 'grey' }} />
            View
          </MenuItem>
        </CustomPopover>

        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content="Are you sure you want to delete?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onDeleteRow(confirm);
              }}
            >
              Delete
            </Button>
          }
        />
      </>
    );
  }
);

export default DailyLogsTableRow;

DailyLogsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
