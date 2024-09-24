import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// Redux API Functions
import {
  accessCompany,
  deleteCompany,
  fetchCompanyList,
  updateCompanyStatus,
} from 'src/redux/slices/companySlice';
// _mock
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
import CompanyTableRow from '../company-table-row';
import CompanyTableToolbar from '../company-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'companyName', label: 'Company Name', minWidth: 170 },
  { id: 'adminName', label: 'Admin Name', minWidth: 150 },
  { id: 'adminEmail', label: 'Email', width: 220 },
  { id: 'phoneNumber', label: 'Phone Number', width: 170, minWidth: 150 },
  { id: 'address', label: 'Address', width: 220 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
  query: '',
};

// ----------------------------------------------------------------------

export default function CompanyListView() {
  const dispatch = useDispatch();

  const table = useTable();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const confirm = useBoolean();

  const listData = useSelector((state) => state?.company?.list);

  const [tableData, setTableData] = useState(listData?.docs || []);

  const [filters, setFilters] = useState(defaultFilters);

  const [page, setPage] = useState(1);

  const denseHeight = table.dense ? 52 : 72;

  const notFound = listData?.totalDocs === 0;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      dispatch(deleteCompany(id));
      enqueueSnackbar('Company deleted successfully!', { variant: 'success' });
      dispatch(fetchCompanyList({ search: filters.query, page }));
    },
    [dispatch, filters?.query, page, enqueueSnackbar]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.admin.company.edit(id));
    },
    [router]
  );
  const handleUpdateStatus = useCallback(
    async (id, value) => {
      const status = value === '1' ? '2' : '1';
      await dispatch(updateCompanyStatus({ id, status }));
      await dispatch(fetchCompanyList());
    },
    [dispatch]
  );

  const handleAccessRow = useCallback(
    async (id) => {
      try {
        const data = await dispatch(accessCompany({ id }));
        router.push('/');
        router.reload();
      } catch (e) {
        // console.log(e);
      }
    },
    [dispatch, router]
  );

  useEffect(() => {
    // Fetch company list data
    dispatch(fetchCompanyList({ search: filters.query, page }));
  }, [dispatch, filters.query, page]);

  const handlePageChange = (e, pg) => {
    setPage(pg + 1);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Company"
          links={[{ name: 'Companies', href: paths.dashboard.company.root }, { name: 'List' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.company.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Company
            </Button>
          }
          sx={{
            my: { xs: 3 },
          }}
        />

        <Card>
          <CompanyTableToolbar onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  // onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {listData?.docs?.map((row) => (
                    <CompanyTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onUpdate={() => handleUpdateStatus(row._id, row.status)}
                      onAccessRow={() => handleAccessRow(row._id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
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
CompanyListView.prototype = {
  isEdit: PropTypes.bool,
};

// ----------------------------------------------------------------------
