import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// hooks
import { truncate } from 'lodash';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//

// ----------------------------------------------------------------------

export default function CompanyTableRow({
  row,
  selected,
  onEditRow,
  onAccessRow,
  onDeleteRow,
  onUpdate,
}) {
  const { name, address, company_admin, status, phoneNumber } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {company_admin?.firstName} {company_admin?.lastName}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{company_admin?.email}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {truncate(address, { length: 20, omission: '...' })}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Switch checked={status === '1'} onChange={onUpdate} color="success" />
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
        <MenuItem
          onClick={() => {
            onAccessRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:circle-bottom-up-line-duotone" />
          Access Info
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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CompanyTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onAccessRow: PropTypes.func,
  onUpdate: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
