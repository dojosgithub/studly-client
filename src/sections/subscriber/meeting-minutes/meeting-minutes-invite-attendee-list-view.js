// import PropTypes from 'prop-types';
// import { useState, useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import isEqual from 'lodash/isEqual';
// import { useFormContext } from 'react-hook-form';
// // @mui
// // // import { alpha } from '@mui/material/styles';
// // // import Tab from '@mui/material/Tab';
// // // import Tabs from '@mui/material/Tabs';
// // // import Button from '@mui/material/Button';
// // // import Tooltip from '@mui/material/Tooltip';
// // // import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// // //import Table from '@mui/material/Table';
// import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
// import TableContainer from '@mui/material/TableContainer';
// // routes
// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// // // import { RouterLink } from 'src/routes/components';
// // _mock
// import { _userList, _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// // hooks
// import { useBoolean } from 'src/hooks/use-boolean';
// // components
// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
// // // import Label from 'src/components/label';
// // // import { ConfirmDialog } from 'src/components/custom-dialog';
// // // import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// import {
//     useTable,
//     getComparator,
//     emptyRows,
//     TableNoData,
//     TableEmptyRows,
//     TableHeadCustom,
//     TableSelectedAction,
//     TablePaginationCustom,
// } from 'src/components/table';
// //
// import { removeMember, setExternalUsers, setInternalUsers,  } from 'src/redux/slices/projectSlice';
// //
// import MeetingMinutesTableRow from './meeting-minutes-table-row';

// // ----------------------------------------------------------------------

// const TABLE_HEAD = [
//     // { id: '', width: 50 },
//     { id: 'name', label: 'Name', },
//     { id: 'company', label: 'Company', },
//     { id: 'email', label: 'Email', },
//     // { id: 'attended', label: 'Attended' },
//     { id: '', },
// ];

// const defaultFilters = {
//     name: '',
//     role: [],
//     status: 'all',
// };

// // ----------------------------------------------------------------------

// export default function MeetingMinutesInviteAttendeeListView() {
//     const table = useTable();
//     const dispatch = useDispatch();
//     const { control, setValue, getValues, watch, resetField } = useFormContext();

//     const members = useSelector(state => state?.project?.members);

//     useEffect(() => {
//         const userList = members.filter(member => member.team);
//         setTableData(userList);
//         console.log('userList updated:', userList);
//     }, [members]);

//     const settings = useSettingsContext();

//     const router = useRouter();

//     const confirm = useBoolean();

//     const [tableData, setTableData] = useState([]);

//     const [filters, setFilters] = useState(defaultFilters);

//     const dataFiltered = applyFilter({
//         inputData: tableData,
//         comparator: getComparator(table.order, table.orderBy),
//         filters,
//     });

//     const dataInPage = dataFiltered.slice(
//         table.page * table.rowsPerPage,
//         table.page * table.rowsPerPage + table.rowsPerPage
//     );

//     const denseHeight = table.dense ? 52 : 72;

//     const canReset = !isEqual(defaultFilters, filters);

//     const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

//     const handleFilters = useCallback(
//         (name, value) => {
//             table.onResetPage();
//             setFilters((prevState) => ({
//                 ...prevState,
//                 [name]: value,
//             }));
//         },
//         [table]
//     );

//     const handleDeleteRow = useCallback(
//         (email) => {
//             console.log('tableData', tableData)
//             console.log('email', email)
//             const filteredRows = tableData.filter((row) => row.email !== email);
//             console.log('filteredRows', filteredRows)
//             dispatch(removeMember(email))

//             setTableData(filteredRows);
//             table.onUpdatePageDeleteRow(dataInPage.length);
//         },
//         [dataInPage.length, table, tableData, dispatch]
//     );

//     return (
//         <Container maxWidth={settings.themeStretch ? false : 'lg'}>

//             <Card>
//                 {/* <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

//                     <Scrollbar>
//                         <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 540 }}>
//                             <TableHeadCustom
//                                 order={table.order}
//                                 orderBy={table.orderBy}
//                                 headLabel={TABLE_HEAD}
//                                 rowCount={tableData.length}
//                                 numSelected={table.selected.length}
//                                 onSort={table.onSort}
//                                 onSelectAllRows={(checked) => {
//                                     table.onSelectAllRows(
//                                         checked,
//                                         tableData.map((row) => row._id)
//                                     )
//                                 }
//                                 }
//                             />

//                             <TableBody>
//                                 {dataFiltered
//                                     .map((row) => (
//                                         <MeetingMinutesTableRow
//                                             key={row.email}
//                                             row={row}
//                                             selected={table.selected.includes(row.email)}
//                                             onDeleteRow={() => handleDeleteRow(row.email)}
//                                         />
//                                     ))}

//                                 <TableEmptyRows
//                                     height={denseHeight}
//                                     emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
//                                 />

//                                 <TableNoData notFound={notFound} />
//                             </TableBody>
//                         </Table>
//                     </Scrollbar>
//                 </TableContainer> */}

//             </Card>
//         </Container>

//     );
// }

// // ----------------------------------------------------------------------

// function applyFilter({ inputData, comparator, filters }) {
//     const { name, status, role } = filters;

//     const stabilizedThis = inputData.map((el, index) => [el, index]);

//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });

//     inputData = stabilizedThis.map((el) => el[0]);

//     if (name) {
//         inputData = inputData.filter(
//             (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
//         );
//     }

//     if (status !== 'all') {
//         inputData = inputData.filter((user) => user.status === status);
//     }

//     if (role.length) {
//         inputData = inputData.filter((user) => role.includes(user.role));
//     }

//     return inputData;
// }

// // MeetingMinutesInviteAttendeeListView.propTypes = {
// // };
