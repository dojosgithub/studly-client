import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _submittalsList, _roles, USER_STATUS_OPTIONS, STATUS_WORKFLOW, _mock, FILTER_CATEGORIES_MEETINGROOM } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { deleteRfi, getRfiList } from 'src/redux/slices/rfiSlice';
import { deletePlanRoomSheet, getPlanRoomList } from 'src/redux/slices/planRoomSlice';
import { getMeetingMinutesList } from 'src/redux/slices/meetingMinutesSlice';
//
import PlanRoomTableRow from '../meeting-minutes-table-row';
import MeetingMinutesTableToolbar from '../meeting-minutes-table-toolbar';
import MeetingMinutesTableFiltersResult from '../meeting-minutes-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  // { id: 'rfiId', label: 'ID', minWidth: 100, width: 100, },
  { id: 'name', label: 'Meeting No', width: "25%" }, // minWidth: 150, width: 220,
  { id: 'createdDate', label: 'Meeting Date', width: "25%" }, // minWidth: 170, width: 170 
  { id: 'creator', label: 'Status', width: "25%" }, // minWidth: 170,  
  // { id: 'status', label: 'Status', width: 100 },
  { id: '', width: "5%" }, // width: 88 
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  // status: 'all',
  query: ''
};

// ----------------------------------------------------------------------



export default function MeetingMinutesListView() {
  const table = useTable();
  const listData = useSelector(state => state?.meetingMinutes?.list)
  const role = useSelector(state => state?.user?.user?.role?.shortName);
  const [tableData, setTableData] = useState(listData?.docs || []);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState('asc');

  const { enqueueSnackbar } = useSnackbar();

  const handlePageChange = (e, pg) => {
    setPage(pg + 1);
  }
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
    console.log('filters.status', filters.status);
    dispatch(getMeetingMinutesList({ search: filters.query, page, sortDir, status: filters.status }));
  }, [dispatch, filters.query, filters.status, page, sortDir]);

  const dataFiltered = useMemo(() => applyFilter({
    inputData: listData?.docs,
    comparator: getComparator(table.order, table.orderBy),
  }), [listData?.docs, table.order, table.orderBy]);

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = listData?.totalDocs === 0

  const handleFilters = useCallback(
    (name, value) => {
      // table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleDeleteRow = useCallback(
    async (row, onDelete) => {
      console.log('row', row)
      // const { projectId, planRoomId, _id: sheetId } = row
      // console.log('id-->', projectId, planRoomId, sheetId)
      // const { error, payload } = await dispatch(deletePlanRoomSheet({ projectId, planRoomId, sheetId }));
      // await dispatch(getPlanRoomList({ search: '', page: 1, status: [] }))
      // console.log('e-p', error, payload)
      // onDelete.onFalse()
      // enqueueSnackbar('Sheet Deleted Successfully', { variant: "success" });
    },
    []
  );


  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.subscriber.meetingMinutes.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.subscriber.meetingMinutes.details(id));
      // confirm.onTrue()
      console.log('handleViewRow', id)
    },
    [router]
  );

  // const handleFilterStatus = useCallback(
  //   (event, newValue) => {
  //     handleFilters('status', newValue);
  //   },
  //   [handleFilters]
  // );

  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Meeting Minutes"
        links={[
          {
            name: 'Dashboard',
            // href: paths.subscriber.root
          },
          { name: 'Meeting Minutes', href: paths.subscriber.meetingMinutes.list },
          { name: 'Logs' },
        ]}
        action={
          ((role === "CAD" || role === "PWU") && <Button
            component={RouterLink}
            href={paths.subscriber.meetingMinutes.new}
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New Meeting
          </Button>)
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>

        <MeetingMinutesTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          // roleOptions={_roles}
          roleOptions={FILTER_CATEGORIES_MEETINGROOM}
        />


        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                // onSort={table.onSort}
                rowCount={listData?.docs?.length}
                handleSortChange={handleSortChange}
                sortDir={sortDir}
              />

              <TableBody>
                {
                  // dataFiltered && dataFiltered?
                  listData?.docs &&
                  listData?.docs?.map((row) => (
                    <PlanRoomTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={(onDelete) => handleDeleteRow(row.id, onDelete)}
                      onEditRow={() => handleEditRow(row?.id)}
                      onViewRow={() => handleViewRow(row?.id)}
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
        {/* <TablePaginationCustom
            count={listData?.docs?.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
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
