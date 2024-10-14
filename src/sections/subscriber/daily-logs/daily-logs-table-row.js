import { memo } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton, MenuItem, Chip, Button } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { STUDLY_ROLES_ACTION } from 'src/_mock';

const DailyLogsTableRow = memo(
  ({ row, selected, onSelectRow, onDeleteRow, onEditRow, onViewRow }) => {
    const confirm = useBoolean();
    const popover = usePopover();
    const truncatedText =
      row.accidentSafetyIssues.length > 20
        ? `${row.accidentSafetyIssues.substring(0, 20)}...`
        : row.accidentSafetyIssues;

    return (
      <>
        <TableRow selected={selected}>
          <TableCell
            sx={{
              cursor: 'pointer',
              color: 'blue',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '.25rem',
            }}
            onClick={() => {
              onViewRow(row._id);
              popover.onClose();
            }}
          >
            {new Date(row?.date).toLocaleDateString()}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.inspection && (
              <span>{row.inspection.map((inspection) => inspection.value).join(', ')}</span>
            )}
          </TableCell>

          <TableCell
            sx={{ whiteSpace: 'nowrap' }}
            dangerouslySetInnerHTML={{ __html: truncatedText }}
          />
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.visitors?.length}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {row?.weather?.length > 0
              ? row?.weather?.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    sx={{
                      margin: '2px',
                      backgroundColor: '#FFAB00',
                      color: 'black',
                    }}
                  />
                ))
              : 'N/A'}
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
              <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.logs.delete}>
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
              </RoleAccessWrapper>
              <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.logs.edit}>
                <MenuItem
                  onClick={() => {
                    onEditRow(row._id);
                    popover.onClose();
                  }}
                >
                  <Iconify icon="solar:pen-bold" />
                  Edit
                </MenuItem>
              </RoleAccessWrapper>
            </>
          )}

          <MenuItem
            onClick={() => {
              onViewRow(row._id);
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
