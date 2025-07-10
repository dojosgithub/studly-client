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
import { FILTER_CATEGORIES_PLANROOM } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import { deletePlanRoomSheet, getPlanRoomList } from 'src/redux/slices/planRoomSlice';
import { CustomDrawerPlanRoom } from 'src/components/custom-drawer-planroom';
import { useResponsive } from 'src/hooks/use-responsive';
//
import PlanRoomTableRow from '../plan-room-table-row';
import PlanRoomTableToolbar from '../plan-room-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Sheet Title', width: '20%' },
  { id: 'sheetNumber', label: 'Sheet Number', width: '20%', minWidth: 140 },
  { id: 'description', label: 'Plan set', width: '30%' },
  { id: 'tags', label: 'Tags', width: '30%' },
  { id: 'createdDate', label: 'Issue date', width: '20%' },
  { id: 'creator', label: 'Uploaded by', width: '15%', minWidth: 120 },
  { id: '', width: '5%' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  query: '',
};

// ----------------------------------------------------------------------

export default function PlanRoomListView() {
  const table = useTable();
  const listData = useSelector((state) => state?.planRoom?.list);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState('asc');
  const [activeRow, setActiveRow] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const handlePageChange = (e, pg) => {
    setPage(pg + 1);
  };
  const handleSortChange = () => {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
  };
  const settings = useSettingsContext();

  const router = useRouter();
  const dispatch = useDispatch();

  const confirm = useBoolean();

  useEffect(() => {
    dispatch(getPlanRoomList({ search: filters.query, page, sortDir, status: filters.status }));
  }, [dispatch, filters.query, filters.status, page, sortDir]);

  const denseHeight = table.dense ? 52 : 72;

  const notFound = listData?.totalDocs === 0;
  const smDown = useResponsive('down', 'sm');
  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleDeleteRow = useCallback(
    async (row, onDelete) => {
      const { projectId, planRoomId, _id: sheetId } = row;
      const { error, payload } = await dispatch(
        deletePlanRoomSheet({ projectId, planRoomId, sheetId })
      );
      await dispatch(getPlanRoomList({ search: '', page: 1, status: [] }));
      onDelete.onFalse();
      enqueueSnackbar('Sheet Deleted Successfully', { variant: 'success' });
    },
    [enqueueSnackbar, dispatch]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.subscriber.planRoom.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (row) => {
      setActiveRow(row);
      confirm.onTrue();
    },
    [confirm]
  );

  const closePlanRoomView = () => {
    confirm.onFalse();
    setActiveRow(null);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Plan Room"
          links={[
            {
              name: 'Dashboard',
            },
            { name: 'Plan Room', href: paths.subscriber.planRoom.list },
            { name: 'Logs' },
          ]}
          action={
            (role === 'CAD' || role === 'PWU') && (
              <Button
                component={RouterLink}
                href={paths.subscriber.planRoom.new}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                fullWidth={smDown} // responsive behavior added here
              >
                Upload Plans
              </Button>
            )
          }
          sx={{
            mb: { xs: 3, md: 5 },
            ...(smDown && {
              '& .MuiStack-root': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1.5rem',
                '& .MuiBox-root': {
                  width: '100%',
                },
              },
            }),
          }}
        />

        <Card>
          <PlanRoomTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={FILTER_CATEGORIES_PLANROOM}
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
                      <PlanRoomTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={(onDelete) => handleDeleteRow(row, onDelete)}
                        onEditRow={() => handleEditRow(row?._id)}
                        onViewRow={() => handleViewRow(row)}
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

      {confirm.value && (
        <CustomDrawerPlanRoom
          open={confirm.value}
          onClose={closePlanRoomView}
          activeRow={activeRow}
        />
      )}
    </>
  );
}
