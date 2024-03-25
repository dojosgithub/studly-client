import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { useFormContext } from 'react-hook-form';
// @mui
// // import { alpha } from '@mui/material/styles';
// // import Tab from '@mui/material/Tab';
// // import Tabs from '@mui/material/Tabs';
// // import Button from '@mui/material/Button';
// // import Tooltip from '@mui/material/Tooltip';
// // import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// // import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
// // import Label from 'src/components/label';
// // import { ConfirmDialog } from 'src/components/custom-dialog';
// // import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
import { setExternalUsers, setInternalUsers, setRemoveExternalUser, setRemoveInternalUser } from 'src/redux/slices/projectSlice';
//
import ProjectTableRow from './project-table-row';
import ProjectTableToolbar from './project-table-toolbar';
import ProjectTableFiltersResult from './project-table-filters-result';
import ProjectInviteNewUser from './project-invite-new-user';

// ----------------------------------------------------------------------

// // const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
    // { id: '', width: 50 },
    { id: 'email', label: 'Email', },
    { id: 'role', label: 'Role' },
    { id: '', },
    { id: '', },
    // //  { id: 'phoneNumber', label: 'Phone Number', width: 180 },
    // //  { id: 'company', label: 'Company', width: 220 },
    // //  { id: 'status', label: 'Status', width: 100 },
];

const defaultFilters = {
    name: '',
    role: [],
    status: 'all',
};

// ----------------------------------------------------------------------

export default function ProjectInviteUserListView({ type }) {
    const table = useTable();
    const dispatch = useDispatch();
    const { control, setValue, getValues, watch, resetField } = useFormContext();

    const internal = useSelector(state => state?.project?.inviteUsers?.internal);
    const external = useSelector(state => state?.project?.inviteUsers?.external);
    // const userList = type === 'internal' ? internal : external;
    const members = useSelector(state => state?.project?.members);

    useEffect(() => {
        const userList = members.filter(member => member.team === type);
        setTableData(userList);
        console.log('userList updated:', userList);
      }, [members, type]);

    
    
    
    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 52 : 72;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

    const handleDeleteRow = useCallback(
        (id) => {
            console.log('tableData', tableData)
            console.log('id', id)
            const deleteRow = tableData.filter((row) => row.id !== id);
            const setUsersActions = type === "internal" ? setRemoveInternalUser : setRemoveExternalUser
            // enqueueSnackbar('User removed from the team successfully!');
            dispatch(setUsersActions(id))
            setTableData(deleteRow);
            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData, dispatch, type]
    );

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );

    function handleCheckedChange(checked) {
        const setUsersAction = type === 'internal' ? setInternalUsers : setExternalUsers
        if (checked) {
            const rowSelected = tableData.map(row => row.id);
            setValue(`inviteUsers.inside[${type}]`, rowSelected)
            dispatch(setUsersAction(rowSelected));
        } else {
            setValue(`inviteUsers.inside[${type}]`, [])
            dispatch(setUsersAction([]));
        }
    }
    function handleUserUpdate(rowId) {
        const setUsersAction = type === 'internal' ? setInternalUsers : setExternalUsers
        const updatedUsers = type === 'internal' ? [...internal] : [...external];
        const userIndex = updatedUsers.indexOf(rowId);

        if (userIndex !== -1) {
            // Remove the rowId if it exists
            const updatedUsersFiltered = updatedUsers.filter(id => id !== rowId);
            setValue(`inviteUsers.inside[${type}]`, updatedUsersFiltered)
            dispatch(setUsersAction(updatedUsersFiltered));
        } else {
            // Add the rowId if it doesn't exist
            const updatedUsersConcat = [...updatedUsers, rowId];
            setValue(`inviteUsers.inside[${type}]`, updatedUsersConcat)
            dispatch(setUsersAction(updatedUsersConcat));
        }
    }

    




    // //   const handleDeleteRows = useCallback(() => {
    // //     const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    // //     setTableData(deleteRows);

    // //     table.onUpdatePageDeleteRows({
    // //       totalRows: tableData.length,
    // //       totalRowsInPage: dataInPage.length,
    // //       totalRowsFiltered: dataFiltered.length,
    // //     });
    // //   }, [dataFiltered.length, dataInPage.length, table, tableData]);



    // //  const handleFilterStatus = useCallback(
    // //    (event, newValue) => {
    // //      handleFilters('status', newValue);
    // //    },
    // //    [handleFilters]
    // //  );


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {/* <Box mb={5}>
                <ProjectInviteNewUser type={type} />
            </Box> */}

            <Card>
                {/* 
                    <ProjectTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        roleOptions={_roles}
                    />

                    {canReset && (
                        <ProjectTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            //
                            onResetFilters={handleResetFilters}
                            //
                            results={dataFiltered.length}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )} */}

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    {/* <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) => {

                                table.onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                                console.log("checked", checked)

                                handleCheckedChange(checked);


                            }
                            }
                        // action={
                        //     <Tooltip title="Delete">
                        //         <IconButton color="primary" onClick={confirm.onTrue}>
                        //             <Iconify icon="solar:trash-bin-trash-bold" />
                        //         </IconButton>
                        //     </Tooltip>
                        // }
                        /> */}

                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 540 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={tableData.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) => {
                                    table.onSelectAllRows(
                                        checked,
                                        tableData.map((row) => row.id)
                                    )
                                }
                                }
                            />

                            <TableBody>
                                {dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row) => (
                                        <ProjectTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(row.id)}
                                            onDeleteRow={() => handleDeleteRow(row.id)}
                                        // onSelectRow={() => {
                                        //     table.onSelectRow(row.id)

                                        //     handleUserUpdate(row.id);
                                        //     console.log('row-selected', row.id)
                                        // }}
                                        // onEditRow={() => handleEditRow(row.id)}
                                        />
                                    ))}
                                <ProjectInviteNewUser type={type} />

                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                />

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                {/* <TablePaginationCustom
                    count={dataFiltered.length}
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
    const { name, status, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (status !== 'all') {
        inputData = inputData.filter((user) => user.status === status);
    }

    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.role));
    }

    return inputData;
}


ProjectInviteUserListView.propTypes = {
    type: PropTypes.string,
};
