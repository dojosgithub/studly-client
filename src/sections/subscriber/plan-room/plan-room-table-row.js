import { memo } from 'react';
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
import { Chip, Typography } from '@mui/material';

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
import UserQuickEditForm from './plan-room-quick-edit-form';

// ----------------------------------------------------------------------
const COLORS = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];

const PlanRoomTableRow = memo(
  ({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) => {
    // const { name, avatarUrl, company, role, status, email, phoneNumber } = row;
    // companyName, address, adminName, adminEmail, phoneNumber
    const {
      id,
      title,
      planName,
      issueDate,
      // // attachments,
      status,
      creator,
      // // owner,
      // // docStatus,
      category,
    } = row;
    const role = useSelector((state) => state?.user?.user?.role?.shortName);
    const confirm = useBoolean();
    // const isDisabled = status === 'Void';
    const quickEdit = useBoolean();

    // setHours(0, 0, 0, 0);
    const popover = usePopover();

    return (
      <>
        {
          <TableRow
            selected={selected}
            // hover={!isDisabled}
            // sx={{
            //   ...(isDisabled && {
            //     cursor: 'not-allowed',
            //     pointerEvents: 'none',
            //     opacity: 0.5,
            //   }),
            // }}
          >
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              <Box
                // onClick={
                //   (role === 'CAD' || role === 'PWU') && status === 'Draft' ? onEditRow : onViewRow
                // }
                onClick={onViewRow}
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
                <span>{title}</span>
              </Box>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {truncate(planName, { length: 20, omission: '...' })}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              <Box display="flex">
                {category.map((cat) => (
                  <Chip label={cat.name} variant="outlined" sx={{ mr: 1 }} />
                ))}
              </Box>
            </TableCell>

            <TableCell
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 140,
                color: (theme) => theme.palette.secondary,
                // color: (theme) =>
                //   isBefore(new Date(issueDate).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
                //     ? 'red'
                //     : theme.palette.secondary,
              }}
            >
              {fDateISO(issueDate)}
            </TableCell>

            <TableCell sx={{ whiteSpace: 'nowrap' }}>
              {creator?.firstName} {creator?.lastName}
            </TableCell>

            {/* <TableCell sx={{ whiteSpace: 'nowrap' }}> */}
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
            {/* {owner?.map((item, index) => (
              <Typography>
                {item.firstName} {owner.length === 1 && item.lastName}
                {index < owner.length - 1 && ' / '}
              </Typography>
            ))} */}
            {/* </TableCell> */}

            {/* <TableCell>
            <Label
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
          </Label>
            <Label color={getStatusColor(status)} variant="soft">
              {status}
            </Label>
          </TableCell> */}

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

              {/* <MenuItem
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem> */}
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

export default PlanRoomTableRow;

PlanRoomTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
