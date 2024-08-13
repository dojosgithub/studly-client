import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { truncate } from 'lodash';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import UserQuickEditForm from './company-quick-edit-form';

// ----------------------------------------------------------------------

export default function CompanyTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onUpdate,
}) {
  // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;
  const { name, address, company_admin, adminName, adminEmail, status, phoneNumber } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {company_admin?.firstName} {company_admin?.lastName}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{company_admin?.email}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {truncate(address, { length: 20, omission: '...' })}
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell> */}

        {/* <TableCell>
          <Label
            onClick={onUpdate}
            variant="soft"
            color={
              (status === "1" && 'success') ||
              (status === "2" && 'warning') ||
              (status === "3" && 'error') ||
              'default'
            }
          >
            {(status === "1" && 'active') || (status === "3" && 'inactive') || (status === "3" && 'blocked') || ('disabled')}
          </Label>
        </TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Switch checked={status === '1'} onChange={onUpdate} color="success" />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {/* <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip> */}

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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
  onSelectRow: PropTypes.func,
  onUpdate: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
