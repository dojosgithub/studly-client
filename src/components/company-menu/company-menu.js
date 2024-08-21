import { useState } from 'react';
import { useSelector } from 'react-redux';
// @mui
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function CompanyMenu() {
  const companies = useSelector((state) => state.user.user.companies);
  const [selectedCompany, setSelectedCompany] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCompanyMenu = (company) => {
    setSelectedCompany(company.name);
    handleClose();
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        type="button"
        size="large"
        variant="custom"
        sx={{ width: '18rem', display: 'flex', justifyContent: 'space-between' }}
      >
        {selectedCompany || 'Select Company'}
        <Stack>
          <Iconify icon="uiw:up" style={{ height: '1em' }} />
          <Iconify icon="uiw:down" style={{ height: '1em' }} />
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {companies.length > 0 &&
          companies.map((company) => (
            <MenuItem
              key={company._id}
              sx={{ width: '17.5rem' }}
              onClick={() => handleCompanyMenu(company.companyId)}
            >
              {company.companyId.name}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
