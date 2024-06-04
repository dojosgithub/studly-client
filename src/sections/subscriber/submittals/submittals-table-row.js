import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
// hooks
import { isBefore, parseISO } from 'date-fns';
import truncate from 'lodash/truncate';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { getStatusColor } from 'src/utils/constants';
import { fDate, fDateISO } from 'src/utils/format-time';
import UserQuickEditForm from './submittals-quick-edit-form';

// ----------------------------------------------------------------------

export default function SubmittalsTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}) {
  // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;
  // companyName, address, adminName, adminEmail, phoneNumber
  const {
    id,
    submittalId,
    name,
    description,
    type,
    submittedDate,
    returnDate,
    creator,
    owner,
    link,
    status,
    docStatus,
  } = row;
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const confirm = useBoolean();
  const isDisabled = status === 'Void';
  const quickEdit = useBoolean();

  console.log(isBefore(new Date(returnDate), new Date()));

  // setHours(0, 0, 0, 0);
  const popover = usePopover();

  return (
    <>
      {
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
                // '&:hover': {
                //   textDecoration: 'underline',
                // },
              }}
            >
              <Iconify icon="lucide:external-link" color="black" height={12} width={12} />
              {submittalId}
            </Box>
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {truncate(description, { length: 20, omission: '...' })}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
            {fDateISO(submittedDate)}
          </TableCell>
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 140,
              color: (theme) =>
                isBefore(new Date(returnDate).setHours(0,0,0,0), new Date().setHours(0,0,0,0))
                  ? 'red'
                  : theme.palette.secondary,
            }}
          >
            {fDateISO(returnDate)}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {creator?.firstName} {creator?.lastName}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {owner?.length > 0 &&
              owner.map((item, index) => (
                <span key={index}>
                  {item?.firstName} {item?.lastName}
                  {index < owner.length - 1 ? ', ' : ''}
                </span>
              ))}
          </TableCell>
          {/* <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}>{link}</TableCell> */}

          <TableCell>
            {/* <Label
            variant="soft"
            color={
              (status === 'approved' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'rejected' && 'error') ||
              (status === 'mcnr' && 'error') ||
              'default'
            }
          >
            {status}
          </Label> */}
            <Label color={getStatusColor(status)} variant="soft">
              {status}
            </Label>
          </TableCell>

          {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell> */}

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
      }

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

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

SubmittalsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
