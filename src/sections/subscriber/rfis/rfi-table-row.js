import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';

// hooks
import { isBefore } from 'date-fns';
import truncate from 'lodash/truncate';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { getStatusColor } from 'src/utils/constants';
import { fDateISO } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function RfiTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}) {
  const {
    id,
    rfiId,
    name,
    description,
    drawingSheet,
    createdDate,
    dueDate,
    costImpact,
    scheduleDelay,
    status,
    owner,
    response,
    attachments,
    creator,
    docStatus,
  } = row;
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const confirm = useBoolean();
  const isDisabled = status === 'Void';
  const popover = usePopover();

  return (
    <>
      <TableRow
        hover={!isDisabled}
        selected={selected}
        sx={{
          ...(isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'none',
            opacity: 0.5,
          }),
        }}
      >
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Box
            onClick={
              (role === 'CAD' || role === 'PWU') && status === 'Draft' ? onEditRow : onViewRow
            }
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
            <span>{rfiId}</span>
          </Box>
        </TableCell>
        <TableCell>
          <Label color={getStatusColor(status)} variant="soft">
            {status}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {truncate(description, { length: 20, omission: '...' })}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{drawingSheet}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
          {createdDate && fDateISO(createdDate)}
        </TableCell>
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            minWidth: 140,
            color: (theme) =>
              isBefore(new Date(dueDate).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
                ? 'red'
                : theme.palette.secondary,
          }}
        >
          {fDateISO(dueDate)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {response?.date && fDateISO(response?.date)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{costImpact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{scheduleDelay}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {owner?.map((item, index) => (
            <Typography>
              {item.firstName} {owner.length === 1 && item.lastName}
              {index < owner.length - 1 && ' / '}
            </Typography>
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
        {(role === 'CAD' || role === 'PWU') && (
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

            <MenuItem
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
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

RfiTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
