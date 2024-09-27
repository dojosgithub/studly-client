import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
// components
import Iconify from 'src/components/iconify';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import DocumentsTableRow from './documents-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: '70%' },
  { id: 'modifiedAt', label: 'Modified', width: '15%' },
  { id: 'createdBy', label: 'Created By', align: 'left', width: '30%' },

  { id: '', width: '20%' },
];

// ----------------------------------------------------------------------

export default function DocumentsTable({
  table,
  tableData,
  onDownloadRow,
  onDeleteRow,
  fetchData,
  onOpenConfirm,
  handlePageChange,
  page,
}) {
  const theme = useTheme();

  const {
    dense,
    order,
    orderBy,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = table;
  const denseHeight = dense ? 58 : 78;
  const dataFiltered = useSelector((state) => state?.documents?.list);
  const notFound = dataFiltered?.docs?.length === 0;
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row._id)
            )
          }
          action={
            <>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="solar:share-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        />

        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {dataFiltered?.docs?.length > 0 ? (
                <>
                  {dataFiltered?.docs?.map((row) => (
                    <DocumentsTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDownloadRow={() => onDownloadRow(row._id)}
                      onDeleteRow={() => onDeleteRow(row._id)}
                      onRenameRow={() => onDeleteRow(row._id)}
                      fetchData={fetchData}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.docs?.length)}
                  />
                </>
              ) : (
                <TableNoData notFound={notFound} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered?.totalDocs}
        page={page - 1}
        rowsPerPage={10}
        onPageChange={handlePageChange}
        rowsPerPageOptions={[]}
      />
    </>
  );
}
DocumentsTable.propTypes = {
  onDeleteRow: PropTypes.func,
  onDownloadRow: PropTypes.func,
  onOpenConfirm: PropTypes.func,
  table: PropTypes.object,
  tableData: PropTypes.array,
  fetchData: PropTypes.func,
  handlePageChange: PropTypes.func,
  page: PropTypes.number,
};
export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
