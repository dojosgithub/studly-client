import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useSnackbar } from 'notistack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { STATUS_RFIS, SUBSCRIBER_USER_ROLE_STUDLY } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import { deleteRfi, getRfiList } from 'src/redux/slices/rfiSlice';
import RfiTableRow from '../rfi-table-row';
import RfiTableToolbar from '../rfi-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'rfiId', label: 'ID', minWidth: 100, width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'name', label: 'Title', minWidth: 150, width: 220 },
  { id: 'description', label: 'Description', minWidth: 170, width: 220 },
  { id: 'drawingSheet', label: 'Drawing Sheet', minWidth: 170, width: 170 },
  { id: 'createdDate', label: 'Created Date', minWidth: 170, width: 170 },
  { id: 'dueDate', label: 'Due Date', minWidth: 150, width: 150 },
  { id: 'responseDate', label: 'Response Date', minWidth: 150, width: 180 },
  { id: 'costImpact', label: 'Cost Impact', minWidth: 150, width: 180 },
  { id: 'scheduleDelay', label: 'Schedule Delay', minWidth: 150, width: 200 },
  { id: 'owner', label: 'Owner / Assignee', minWidth: 200, width: 400 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  query: '',
};

// ----------------------------------------------------------------------

export default function RfiListView() {
  const table = useTable();
  const listData = useSelector((state) => state?.rfi?.list);
  const role = useSelector((state) => state?.user?.user?.role);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState('asc');

  const { enqueueSnackbar } = useSnackbar();

  const handlePageChange = (e, pg) => {
    setPage(pg + 1);
  };
  const handleSortChange = () => {
    if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortDir('asc');
    }
  };
  const settings = useSettingsContext();

  const router = useRouter();
  const dispatch = useDispatch();

  const confirm = useBoolean();

  useEffect(() => {
    dispatch(getRfiList({ search: filters.query, page, sortDir, status: filters.status }));
  }, [dispatch, filters.query, filters.status, page, sortDir]);

  const denseHeight = table.dense ? 52 : 72;

  const notFound = listData?.totalDocs === 0;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleDeleteRow = useCallback(
    async (id, onDelete) => {
      await dispatch(deleteRfi(id));
      const { error, payload } = await dispatch(getRfiList({ search: '', page: 1, status: [] }));
      onDelete.onFalse();
      enqueueSnackbar('RFI Deleted Successfully', { variant: 'success' });
    },
    [dispatch, enqueueSnackbar]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.subscriber.rfi.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.subscriber.rfi.details(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="RFI Logs"
          links={[
            {
              name: 'Dashboard',
            },
            { name: 'RFIs', href: paths.subscriber.rfi.list },
            { name: 'Log' },
          ]}
          action={
            (role?.name === SUBSCRIBER_USER_ROLE_STUDLY.CAD ||
              role?.name === SUBSCRIBER_USER_ROLE_STUDLY.PWU) && (
              <Button
                component={RouterLink}
                href={paths.subscriber.rfi.new}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Create New RFI
              </Button>
            )
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <RfiTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={STATUS_RFIS}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listData?.docs?.length}
                  handleSortChange={handleSortChange}
                  sortDir={sortDir}
                />

                <TableBody>
                  {listData?.docs &&
                    listData?.docs?.map((row) => (
                      <RfiTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={(onDelete) => handleDeleteRow(row._id, onDelete)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, listData?.docs?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={listData?.totalDocs}
            page={page - 1}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            onPageChange={handlePageChange}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
