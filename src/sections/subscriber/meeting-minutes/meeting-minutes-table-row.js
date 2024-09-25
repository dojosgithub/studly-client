import { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { fDateISO } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const MeetingMinutesTableRow = memo(
  ({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) => {
    const { id, description, status } = row;
    const role = useSelector((state) => state?.user?.user?.role?.shortName);
    const confirm = useBoolean();

    const popover = usePopover();

    return (
      <>
        <TableRow selected={selected}>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            <Box
              onClick={onViewRow}
              sx={{
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
                gap: '.25rem',
              }}
            >
              <Iconify icon="lucide:external-link" color="black" height={12} width={12} />
              <span>{description?.meetingNumber}</span>
            </Box>
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateISO(description?.date)}</TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>{status}</TableCell>

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
                    onEditRow();
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
              onViewRow();
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
          content="Are you sure want to delete?"
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

export default MeetingMinutesTableRow;

MeetingMinutesTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
