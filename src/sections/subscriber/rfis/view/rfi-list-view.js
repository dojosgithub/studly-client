import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
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
import { _userList, _submittalsList, _roles, USER_STATUS_OPTIONS, STATUS_WORKFLOW } from 'src/_mock';
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
import RfiTableRow from '../rfi-table-row';
import RfiTableToolbar from '../rfi-table-toolbar';
import RfiTableFiltersResult from '../rfi-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];
// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...SUBMITTALS_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'rfiId', label: 'ID', minWidth: 100, width: 100, },
  { id: 'name', label: 'Title', minWidth: 150, width: 220 },
  { id: 'description', label: 'Description',minWidth: 170, width: 220 },
  { id: 'drawingSheet', label: 'Drawing Sheet', minWidth: 170, width: 170 },
  { id: 'createdDate', label: 'Created Date', minWidth: 170, width: 170 },
  { id: 'dueDate', label: 'Due Date', minWidth: 150, width: 150 },
  { id: 'costImpact', label: 'Cost Impact',  minWidth: 150,width: 180 },
  { id: 'scheduleDelay', label: 'Schedule Delay', minWidth: 150, width: 200 },
  { id: 'owner', label: 'Owner / Assignee', minWidth: 200, width: 400 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  // status: 'all',
  query: ''
};

// ----------------------------------------------------------------------

export default function RfiListView() {
  const table = useTable();
  const listData = useSelector(state => state?.rfi?.list)
  const role = useSelector(state => state?.user?.user?.role?.shortName);
  const [tableData, setTableData] = useState(listData?.docs || []);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

  const handlePageChange = (e, pg) => {
    setPage(pg + 1);
  }

  const settings = useSettingsContext();

  const router = useRouter();
  const dispatch = useDispatch();

  const confirm = useBoolean();

  useEffect(() => {
    console.log('filters.status', filters.status);
    dispatch(getRfiList({ search: filters.query, page, status: filters.status }))
  }, [dispatch, filters.query, filters.status, page])


  const dataFiltered = applyFilter({
    inputData: listData?.docs,
    comparator: getComparator(table.order, table.orderBy),
    // filters,
  });

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
    async (id, onDelete) => {
      console.log('id', id)
      await dispatch(deleteRfi(id))
      const { error, payload } = await dispatch(getRfiList({ search: '', page: 1, status: [] }))
      console.log('payload', payload)
      onDelete.onFalse()
      enqueueSnackbar('RFI Deleted Successfully', { variant: "success" });
    },
    [dispatch, enqueueSnackbar]
  );

  // const handleDeleteRows = useCallback(() => {
  //   const deleteRows = tableData?.filter((row) => !table.selected.includes(row.id));
  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRows: tableData.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: listData?.docs?.length,
  //   });
  // }, [listData?.docs?.length, dataInPage.length, table, tableData]);

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
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="RFI Logs"
          links={[
            {
              name: 'Dashboard',
              // href: paths.subscriber.root
            },
            { name: 'RFIs', href: paths.subscriber.rfi.list },
            { name: 'Log' },
          ]}
          action={
            ((role === "CAD" || role === "PWU") && <Button
              component={RouterLink}
              href={paths.subscriber.rfi.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New RFI
            </Button>)
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && _submittalsList.length}
                    {tab.value === 'active' &&
                      _submittalsList?.filter((user) => user.status === 'active').length}

                    {tab.value === 'pending' &&
                      _submittalsList?.filter((user) => user.status === 'pending').length}
                    {tab.value === 'banned' &&
                      _submittalsList?.filter((user) => user.status === 'banned').length}
                    {tab.value === 'rejected' &&
                      _submittalsList?.filter((user) => user.status === 'rejected').length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <RfiTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            // roleOptions={_roles}
            roleOptions={STATUS_WORKFLOW?.slice(0,2)}
          />

          {/* {canReset && (
            <RfiTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={listData?.docs?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  // onSort={table.onSort}
                  rowCount={listData?.docs?.length}
                // numSelected={table.selected.length}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row.id)
                //   )
                // }
                />

                <TableBody>
                  {dataFiltered && dataFiltered?.map((row) => (
                    <RfiTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={(onDelete) => handleDeleteRow(row.id, onDelete)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
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
              // handleDeleteRows();
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
