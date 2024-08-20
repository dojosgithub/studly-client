import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Button, Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useSnackbar } from 'notistack';
import Scrollbar from 'src/components/scrollbar';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// components
import { getDailyLogsList, deleteLog } from 'src/redux/slices/dailyLogsSlice';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/components/table';
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import { STUDLY_ROLES_ACTION } from 'src/_mock';
import PlanRoomTableRow from '../daily-logs-table-row';
import DailyLogsTableToolbar from '../daily-logs-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'createdDate', label: 'Date', width: '16%' },
  { id: 'inspections', label: 'Inspections', width: '16%' },
  { id: 'accidents', label: 'Accidents', width: '16%' },
  { id: 'visitors', label: 'Visitors', width: '16%' },
  { id: 'weather', label: 'Weather', width: '16%' },
  { id: '', width: '5%' },
];

const defaultFilters = {
  name: '',
  inspections: '',
  accidents: '',
  visitors: '',
  weather: '',
  query: '',
};

// ----------------------------------------------------------------------

export default function DailyLogsListView() {
  const table = useTable();
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const listData = useSelector((state) => state?.dailyLogs?.list);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState('asc');
  const denseHeight = 52;

  useEffect(() => {
    dispatch(getDailyLogsList({ search: filters.query, page, sortDir }));
  }, [dispatch, filters.query, page, sortDir]);

  const handlePageChange = (e, newPage) => setPage(newPage + 1);
  const handleSortChange = () => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const handleDeleteRow = useCallback(
    async (row, onDelete) => {
      await dispatch(deleteLog(row));

      onDelete.onFalse();
      enqueueSnackbar('Log Deleted Successfully', { variant: 'success' });

      dispatch(getDailyLogsList({ search: filters.query, page, sortDir, status: filters.status }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // const handleEditRow = useCallback((id) => navigate(paths.subscriber.logs.edit(id)), [navigate]);
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.subscriber.logs.details(id));
      // confirm.onTrue()
    },
    [router]
  );
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.subscriber.logs.edit(id));
    },
    [router]
  );

  const notFound = listData?.totalDocs === 0;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Daily Logs"
        links={[
          { name: 'Dashboard' },
          { name: 'Daily Logs', href: paths.subscriber.logs.list },
          { name: 'Logs' },
        ]}
        action={
          <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.logs.create}>
            <Button
              component={RouterLink}
              href={paths.subscriber.logs.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New Log
            </Button>
          </RoleAccessWrapper>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DailyLogsTableToolbar filters={filters} onFilters={handleFilters} />
        <TableContainer>
          <Scrollbar>
            <Table size="medium">
              <TableHeadCustom
                order={sortDir}
                headLabel={TABLE_HEAD}
                rowCount={listData?.docs?.length || 0}
                handleSortChange={handleSortChange}
              />

              <TableBody>
                {listData?.docs?.length > 0 ? (
                  <>
                    {listData?.docs?.map((row) => (
                      <PlanRoomTableRow
                        key={row._id}
                        row={row}
                        onEditRow={() => handleEditRow(row?._id)}
                        onDeleteRow={(onDelete) => handleDeleteRow(row?._id, onDelete)}
                        onViewRow={() => handleViewRow(row?._id)}
                      />
                    ))}
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, listData?.docs?.length)}
                    />
                  </>
                ) : (
                  <TableNoData notFound={notFound} />
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={listData?.totalDocs}
          page={page - 1}
          rowsPerPage={10}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[]}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters }) {
  // const { name, status, role } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData?.filter(
  //     (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }

  // if (status !== 'all') {
  //   inputData = inputData?.filter((user) => user.status === status);
  // }

  // if (role.length) {
  //   inputData = inputData?.filter((user) => role.includes(user.role));
  // }

  return inputData;
}

// function applyFilter({ inputData, comparator, filters }) {
//   const { name, status } = filters;
//   let filteredData = inputData;

//   if (name) {
//     filteredData = filteredData.filter((item) =>
//       item.name.toLowerCase().includes(name.toLowerCase())
//     );
//   }

//   if (status.length) {
//     filteredData = filteredData.filter((item) => status.includes(item.status));
//   }

//   return filteredData?.sort(comparator);
// }

// function getComparator(orderBy, orderDir) {
//   return (a, b) => {
//     if (a[orderBy] < b[orderBy]) return orderDir === 'asc' ? -1 : 1;
//     if (a[orderBy] > b[orderBy]) return orderDir === 'asc' ? 1 : -1;
//     return 0;
//   };
// }

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
