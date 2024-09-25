import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @muidash';
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
import { FILTER_CATEGORIES_MEETINGROOM } from 'src/_mock';
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
import { deleteMeeting, getMeetingMinutesList } from 'src/redux/slices/meetingMinutesSlice';
//
import MeetingMinutesTableRow from '../meeting-minutes-table-row';
import MeetingMinutesTableToolbar from '../meeting-minutes-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Meeting No', width: '25%' },
  { id: 'createdDate', label: 'Meeting Date', width: '25%' },
  { id: 'creator', label: 'Status', width: '25%' },
  { id: '', width: '5%' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  query: '',
};

// ----------------------------------------------------------------------

export default function MeetingMinutesListView() {
  const table = useTable();
  const listData = useSelector((state) => state?.meetingMinutes?.list);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
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

  useEffect(() => {
    dispatch(
      getMeetingMinutesList({ search: filters.query, page, sortDir, status: filters.status })
    );
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
    async (row, onDelete) => {
      await dispatch(deleteMeeting(row));
      onDelete.onFalse();
      enqueueSnackbar('Meeting Deleted Successfully', { variant: 'success' });
      dispatch(
        getMeetingMinutesList({ search: filters.query, page, sortDir, status: filters.status })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    },
    [router]
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Meeting Minutes"
        links={[
          {
            name: 'Dashboard',
          },
          { name: 'Meeting Minutes', href: paths.subscriber.meetingMinutes.list },
          { name: 'Logs' },
        ]}
        action={
          (role === 'CAD' || role === 'PWU') && (
            <Button
              component={RouterLink}
              href={paths.subscriber.meetingMinutes.new}
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Create New Meeting
            </Button>
          )
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
          roleOptions={FILTER_CATEGORIES_MEETINGROOM}
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
                    <MeetingMinutesTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onDeleteRow={(onDelete) => handleDeleteRow(row._id, onDelete)}
                      onEditRow={() => handleEditRow(row?._id)}
                      onViewRow={() => handleViewRow(row?._id)}
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
  );
}

// ----------------------------------------------------------------------
