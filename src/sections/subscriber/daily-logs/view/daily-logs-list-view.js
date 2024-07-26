import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Button, Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Scrollbar from 'src/components/scrollbar';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/components/table';
import DailyLogsTableToolbar from '../daily-logs-table-toolbar'; // Uncommented and fixed import
// import PlanRoomTableRow from '../meeting-minutes-table-row'; // Uncommented and fixed import

// Redux actions
// import { deleteMeeting, getDailyLogsList } from 'src/redux/slices/DailyLogsSlice'; // Uncommented and fixed import

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'createdDate', label: ' Date', width: '16%' },
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
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const listData = useSelector((state) => state?.DailyLogs?.list);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState('asc');

  // useEffect(() => {
  //   dispatch(
  //     getDailyLogsList({ search: filters.query, page, sortDir, status: filters.status })
  //   );
  // }, [dispatch, filters, page, sortDir]);

  const handlePageChange = (e, newPage) => setPage(newPage + 1);
  const handleSortChange = () => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // const handleDeleteRow = useCallback(
  //   async (rowId) => {
  //     await dispatch(deleteMeeting(rowId));
  //     enqueueSnackbar('Meeting Deleted Successfully', { variant: 'success' });
  //     dispatch(
  //       getDailyLogsList({ search: filters.query, page, sortDir, status: filters.status })
  //     );
  //   },
  //   [dispatch, enqueueSnackbar, filters, page, sortDir]
  // );

  const handleEditRow = useCallback(
    (id) => navigate(paths.subscriber.DailyLogs.edit(id)),
    [navigate]
  );
  const handleViewRow = useCallback(
    (id) => navigate(paths.subscriber.DailyLogs.details(id)),
    [navigate]
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
          role === 'CAD' || role === 'PWU' ? (
            <Button
              component={RouterLink}
              href={paths.subscriber.logs.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New Log
            </Button>
          ) : null
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
                rowCount={listData?.docs?.length}
                handleSortChange={handleSortChange}
              />

              <TableBody>
                {/* {dataFiltered.map((row) => (
                  <PlanRoomTableRow
                    key={row.id}
                    row={row}
                    // onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                    onViewRow={() => handleViewRow(row.id)}
                  />
                ))} */}

                <TableEmptyRows height={72} emptyRows={emptyRows(listData?.docs?.length)} />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={listData?.totalDocs}
          page={page - 1}
          rowsPerPage={10}
          onPageChange={handlePageChange}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;
  let filteredData = inputData;

  if (name) {
    filteredData = filteredData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status.length) {
    filteredData = filteredData.filter((item) => status.includes(item.status));
  }

  return filteredData?.sort(comparator);
}

function getComparator(orderBy, orderDir) {
  return (a, b) => {
    if (a[orderBy] < b[orderBy]) return orderDir === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return orderDir === 'asc' ? 1 : -1;
    return 0;
  };
}

function emptyRows(rowCount) {
  return Math.max(0, 10 - rowCount);
}
