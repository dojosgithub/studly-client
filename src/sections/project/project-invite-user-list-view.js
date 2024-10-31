import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from 'src/components/table';
//
import { removeMember } from 'src/redux/slices/projectSlice';
//
import ProjectTableRow from './project-table-row';
import ProjectInviteNewUser from './project-invite-new-user';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: '' },
  { id: '' },
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
  const members = useSelector((state) => state?.project?.members);
  useEffect(() => {
    const userList = members.filter((member) => member.team === type);
    setTableData(userList);
  }, [members, type]);
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [filters] = useState(defaultFilters);
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
  const handleDeleteRow = useCallback(
    (email) => {
      const filteredRows = tableData.filter((row) => row.email !== email);
      dispatch(removeMember(email));
      setTableData(filteredRows);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, dispatch]
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                    tableData.map((row) => row._id)
                  );
                }}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <ProjectTableRow
                    key={row.email}
                    row={row}
                    selected={table.selected.includes(row.email)}
                    onDeleteRow={() => handleDeleteRow(row.email)}
                  />
                ))}
                {/* <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />
                <TableNoData notFound={notFound} /> */}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <ProjectInviteNewUser type={type} />
        {notFound && (
          <TableContainer>
            <Table sx={{ minWidth: { xs: '100%', md: 540 } }}>
              <TableBody>
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
