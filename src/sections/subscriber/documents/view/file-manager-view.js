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
import Typography from '@mui/material/Typography';

import ToggleButton from '@mui/material/ToggleButton';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock

import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import { getDocumentsList, deleteDocument } from 'src/redux/slices/documentsSlice';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
//
import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';

import FileManagerGridView from '../file-manager-grid-view';

import FileManagerFiltersResult from '../file-manager-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';
import FileManagerNewFileDialog from '../file-manager-new-file';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FileManagerView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const dispatch = useDispatch();
  const settings = useSettingsContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const openDateRange = useBoolean();
  const listData = useSelector((state) => state?.documents?.list);
  const [files, setFiles] = useState([]);
  const confirm = useBoolean();
  const [folderName, setFolderName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const upload = useBoolean();
  const newFolder = useBoolean();

  const [view, setView] = useState('list');

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
    dispatch(getDocumentsList({ search: filters.query }));
  }, [dispatch, filters.query]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  }, []);
  const handleChangeFolderName = useCallback((value) => {
    setFolderName(value);
  }, []);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleUpload = () => {
    handleClose();
    upload.onTrue(); // Call your upload function here
  };

  const handleNewFolder = () => {
    handleClose();
    newFolder.onTrue(); // Call your new folder function here
  };

  // const handleDeleteItem = useCallback(
  //   (id) => {
  //     const deleteRow = tableData.filter((row) => row._id !== id);
  //     setTableData(deleteRow);

  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );

  // const handleDeleteItems = useCallback(async(row) => {
  //   const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));
  //   setTableData(deleteRows);

  //   table.onUpdatePageDeleteRows({
  //     totalRows: tableData.length,
  //     totalRowsInPage: dataInPage.length,
  //     totalRowsFiltered: dataFiltered.length,
  //   });
  // }, [dataFiltered.length, dataInPage.length, table, tableData]);
  const handleDeleteItems = useCallback(
    async (row) => {
      console.log(row);
      await dispatch(deleteDocument(row));

      enqueueSnackbar('Document Deleted Successfully', { variant: 'success' });

      dispatch(getDocumentsList({ search: filters.query, status: filters.status }));
    },
    [dispatch, enqueueSnackbar, filters.status, filters.query]
  );
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
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
      <FileManagerFilters
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

      {/* <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup> */}
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  const fetchData = (props) => {
    dispatch(getDocumentsList({ search: filters.query, status: filters.status, ...props }));
  };

  const clicked = (item) => {
    if (/\b[a-fA-F0-9]{24}\b/.test(item)) {
      console.log('Clicked', item);
      fetchData({ parentId: item.replace('/', '') });
    } else {
      fetchData({ parentId: null });
    }
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        {listData?.links && (
          <CustomBreadcrumbs
            notLink
            heading="Documents"
            // links={[
            //   { name: 'Dashboard' },
            //   { name: 'Documents', href: paths.subscriber.documents.list, onClick: clicked },
            //   { name: 'Documentss', href: paths.subscriber.documents.list, onClick: clicked },
            // ]}
            links={listData?.links?.map((item) => ({
              name: item.name,
              href: item.href,
            }))}
            onClick={clicked}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClick}
                style={{ paddingRight: 46 }}
              >
                Upload
              </Button>
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
          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent filled title="No Data" sx={{ py: 10 }} />
        ) : (
          <>
            {/* {view === 'list' ? (
              <FileManagerTable
                table={table}
                tableData={tableData}
                dataFiltered={listData}
                onDeleteRow={handleDeleteItems}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
              />
            ) : (
              <FileManagerGridView
                table={table}
                data={tableData}
                dataFiltered={listData}
                onDeleteItem={handleDeleteItems}
                onOpenConfirm={confirm.onTrue}
              />
            )} */}
            <FileManagerTable
              table={table}
              tableData={tableData}
              // onDeleteRow={(id) => handleDeleteItems(id)}
              onDeleteRow={() => fetchData()}
              notFound={notFound}
              onOpenConfirm={confirm.onTrue}
              fetchData={fetchData}
            />
          </>
        )}
      </Container>

      <FileManagerNewFileDialog
        open={upload.value}
        onClose={upload.onFalse}
        fetchData={fetchData}
      />

      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          setFolderName('');
          console.info('CREATE NEW FOLDER', folderName);
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
