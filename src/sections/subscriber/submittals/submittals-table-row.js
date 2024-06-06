import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';

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
import { getInitialsWithColor } from 'src/utils/get-initials';
import { getStatusColor } from 'src/utils/constants';
import { fDate, fDateISO } from 'src/utils/format-time';
import UserQuickEditForm from './submittals-quick-edit-form';

// ----------------------------------------------------------------------
const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];

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
    leadTime,
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
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{leadTime}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {truncate(description, { length: 20, omission: '...' })}
          </TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
            {submittedDate && fDateISO(submittedDate)}
          </TableCell>
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 140,
              color: (theme) =>
                isBefore(new Date(returnDate).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
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
            {/* <Box display="flex">
              <AvatarGroup max={4}>
                {owner?.map((item, index) => (
                  <Tooltip key={item._id} title={`${item?.firstName} ${item?.lastName}`}>
                    <Avatar
                      key={`${item?.firstName} ${item?.lastName}`}
                      alt={`${item?.firstName} ${item?.lastName}`}
                    >
                      {`${item?.firstName} ${item?.lastName}`.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Box> */}
            {owner?.map((item, index) => (
              <>
                <Typography>
                  {item.firstName} {item.firstName}
                </Typography>
                {index < owner.length - 1 && ' / '}
              </>
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
