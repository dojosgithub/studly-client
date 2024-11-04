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
import { Chip } from '@mui/material';

// hooks
import truncate from 'lodash/truncate';
import { useBoolean } from 'src/hooks/use-boolean';

// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { fDateISO } from 'src/utils/format-time';
import CustomImage from 'src/components/image';

// ----------------------------------------------------------------------

const PlanRoomTableRow = memo(
  ({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow }) => {
    const { sheetTitle, sheetNumber, thumbnail, planName, issueDate, creator, category } = row;
    const role = useSelector((state) => state?.user?.user?.role?.shortName);
    const confirm = useBoolean();
    const popover = usePopover();

    return (
      <>
        <TableRow selected={selected}>
          <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 250 }}>
            <Box
              onClick={onViewRow}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}
            >
              {/* Add a fixed margin for consistent spacing after the title */}
              <CustomImage
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginLeft: '10px',
                  marginRight: '40px', // Fixed margin for consistent spacing
                }}
                alt={`Corner of page ${row.src.croppedThumbnail + 1}`}
                src={row.src.croppedThumbnail}
              />
              <Iconify icon="lucide:external-link" color="black" height={12} width={12} />
              <Box sx={{ flexGrow: 1 }}>
                <span> {truncate(sheetTitle, { length: 30, omission: '...' })}</span>
              </Box>
            </Box>
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {truncate(sheetNumber, { length: 20, omission: '...' })}
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
            }}
          >
            {fDateISO(issueDate)}
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            {creator?.firstName} {creator?.lastName}
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
