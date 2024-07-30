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
  ({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) => {
    const { id, description, status, inspections, accidents, visitors, weather } = row;
    const role = useSelector((state) => state?.user?.user?.role?.shortName);
    const confirm = useBoolean();
    const popover = usePopover();

    const date = description?.date;
    const validDate = isValid(parseISO(date))
      ? format(parseISO(date), 'yyyy-MM-dd')
      : 'Invalid Date';

    return (
      <>
        <TableRow selected={selected}>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{validDate}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {inspections ? 'Completed' : 'Pending'}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{accidents}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{visitors?.length}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{weather}</TableCell>
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
          {status !== 'Minutes' && (
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
                    onEditRow(id);
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
              onViewRow(id);
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
