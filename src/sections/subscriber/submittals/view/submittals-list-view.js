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
import 'pdfjs-dist/build/pdf.worker.entry';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { STATUS_WORKFLOW } from 'src/_mock';
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
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

//
import { useResponsive } from 'src/hooks/use-responsive';
import { deleteSubmittal, getSubmittalList } from 'src/redux/slices/submittalSlice';
import SubmittalsTableRow from '../submittals-table-row';
import SubmittalsTableToolbar from '../submittals-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Submittal ID', minWidth: 150, width: 150 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'name', label: 'Name', width: 250 },
  { id: 'leadTime', label: 'Lead Time', minWidth: 170, width: 170 },
  { id: 'description', label: 'Description', width: 220 },
  { id: 'type', label: 'Type', width: 180 },
  { id: 'submittedDate', label: 'Date Submitted', minWidth: 170, width: 170 },
  { id: 'returnDate', label: 'Return Date', minWidth: 150, width: 150 },
  { id: 'creator', label: 'Creator', width: 180 },
  { id: 'owner', label: 'Owner / Assignee', minWidth: 180, width: 400 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: [],
  query: '',
};

// ----------------------------------------------------------------------

export default function SubmittalsListView() {
  const table = useTable();
  const listData = useSelector((state) => state?.submittal?.list);
  const role = useSelector((state) => state?.user?.user?.role?.shortName);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [sortDir, setSortDir] = useState('asc');
  const smDown = useResponsive('down', 'sm');

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
    dispatch(getSubmittalList({ search: filters.query, page, sortDir, status: filters.status }));
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
      await dispatch(deleteSubmittal(id));
      await dispatch(
        getSubmittalList({ search: filters.query, page, sortDir, status: filters.status })
      );
      onDelete.onFalse();
      enqueueSnackbar('Submittal Deleted Successfully', { variant: 'success' });
    },
    [dispatch, enqueueSnackbar, sortDir, filters, page]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.subscriber.submittals.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.subscriber.submittals.details(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Submittal Log "
          links={[
            {
              name: 'Dashboard',
            },
            { name: 'Submittals', href: paths.subscriber.submittals.list },
            { name: 'Log' },
          ]}
          action={
            (role === 'CAD' || role === 'PWU') && (
              <Button
                component={RouterLink}
                href={paths.subscriber.submittals.new}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                fullWidth
              >
                Create New Submittal
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
          <SubmittalsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={STATUS_WORKFLOW}
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
                      <SubmittalsTableRow
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
