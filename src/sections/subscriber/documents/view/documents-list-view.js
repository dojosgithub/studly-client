import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui

import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { Button, Menu, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock

import { _allFiles, FILE_TYPE_OPTIONS, STUDLY_ROLES_ACTION } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// components
import { getDocumentsList, deleteDocument } from 'src/redux/slices/documentsSlice';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
//
import RoleAccessWrapper from 'src/components/role-access-wrapper';
import DocumentsTable from '../documents-table';
import DocumentsFilters from '../documents-filters';

import DocumentsNewFolderDialog from '../documents-new-folder-dialog';
import DocumentsNewFileDialog from '../documents-new-file-dialog';

// ----------------------------------------------------------------------

const defaultFilters = {
  query: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function DocumentsListView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const dispatch = useDispatch();
  const settings = useSettingsContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const openDateRange = useBoolean();
  const listData = useSelector((state) => state?.documents?.list);
  const confirm = useBoolean();
  const [folderName, setFolderName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const upload = useBoolean();
  const newFolder = useBoolean();
  const [page, setPage] = useState(1);

  const [tableData, setTableData] = useState(_allFiles);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  useEffect(() => {
    dispatch(getDocumentsList({ search: filters.query, page }));
  }, [dispatch, filters.query, page]);

  useEffect(() => {
    console.log('Dont remove this');
    return () => dispatch(getDocumentsList({ search: '', page: 1, parentId: null }));
  }, [dispatch]);

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeFolderName = useCallback((value) => {
    setFolderName(value);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleUpload = () => {
    handleClose();
    upload.onTrue(); // Call your upload function here
  };

  const handleNewFolder = () => {
    handleClose();
    newFolder.onTrue(); // Call your new folder function here
  };
  const handlePageChange = (e, newPage) => setPage(newPage + 1);

  const handleDeleteItems = useCallback(
    async (row) => {
      await dispatch(deleteDocument(row));

      enqueueSnackbar('Document Deleted Successfully', { variant: 'success' });

      dispatch(getDocumentsList({ search: filters.query, status: filters.status }));
    },
    [dispatch, enqueueSnackbar, filters.status, filters.query]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderFilters = (
    <Stack
      spacing={2}
      marginTop={5}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <DocumentsFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const fetchData = async (props, setPages) => {
    await dispatch(getDocumentsList({ search: filters.query, status: filters.status, ...props }));
    if (setPages) {
      setPage(1);
    }
  };

  const clicked = (item) => {
    if (/\b[a-fA-F0-9]{24}\b/.test(item)) {
      fetchData({ parentId: item.replace('/', '') }, true);
    } else {
      fetchData({ parentId: null }, true);
    }
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        {listData?.links && (
          <CustomBreadcrumbs
            notLink
            heading="Documents"
            links={listData?.links?.map((item) => ({
              name: item.name,
              href: item.href,
            }))}
            onClick={clicked}
            action={
              <RoleAccessWrapper allowedRoles={STUDLY_ROLES_ACTION.documents.create}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleClick}
                  style={{ paddingRight: 46 }}
                >
                  Upload
                </Button>
              </RoleAccessWrapper>
            }
          />
        )}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleUpload}>
            <NoteAddIcon style={{ marginRight: 8 }} /> {/* Add some margin for spacing */}
            Upload File
          </MenuItem>
          <MenuItem onClick={handleNewFolder}>
            <CreateNewFolderIcon style={{ marginRight: 8 }} /> {/* Add some margin for spacing */}
            New Folder
          </MenuItem>
        </Menu>
        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {renderFilters}
        </Stack>

        {notFound ? (
          <EmptyContent filled title="No Data" sx={{ py: 10 }} />
        ) : (
          <DocumentsTable
            table={table}
            tableData={tableData}
            onDeleteRow={() => fetchData()}
            notFound={notFound}
            onOpenConfirm={confirm.onTrue}
            fetchData={fetchData}
            page={page}
            handlePageChange={handlePageChange}
          />
        )}
      </Container>

      <DocumentsNewFileDialog open={upload.value} onClose={upload.onFalse} fetchData={fetchData} />

      <DocumentsNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          setFolderName('');
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
        fetchData={fetchData}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems(confirm);
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
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, type, startDate, endDate } = filters;

  // Step 1: Sort the data based on the comparator
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  // Step 2: Apply name filter
  if (name) {
    filteredData = filteredData.filter((file) =>
      file.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Step 3: Apply type filter
  if (type.length) {
    filteredData = filteredData.filter((file) => type.includes(fileFormat(file.type)));
  }

  // Step 4: Apply date range filter if there's no date error
  if (!dateError && startDate && endDate) {
    filteredData = filteredData.filter((file) => {
      const fileDate = fTimestamp(file.createdAt);
      return fileDate >= fTimestamp(startDate) && fileDate <= fTimestamp(endDate);
    });
  }

  return filteredData;
}
