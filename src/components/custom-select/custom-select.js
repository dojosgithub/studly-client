import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
// _mock
import { PROJECT_TEMPLATES, PROJECT_TEMPLATE_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CustomSelect({ onSelect, selectedTemplate }) {
  

    return (

        <Box
            rowGap={3}
            columnGap={2}
            display="grid"

            sx={{ marginBottom: "2rem" }}
        >
            <Select onChange={(e) => onSelect(e.target.value)} name="template" value={selectedTemplate} label="" placeholder='Choose Template' sx={{
                "& .MuiSelect-select": {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                }
            }}>
              
                {PROJECT_TEMPLATES.map(({ name }) => (
                    <MenuItem key={name} value={name} sx={{ height: 50, px: 3, borderRadius: 0 }}>

                        {name === 'default' ? 'Studly Default Template' : name.toUpperCase()}
                        {(name === 'default') && <Iconify
                            icon='mdi:crown-outline'
                            width={28}
                            sx={{ mx: 1 }}
                        />}
                    </MenuItem>
                ))}
                <MenuItem value='create' sx={{ height: 50, px: 3, borderTop: '1px solid black', borderRadius: 0 }}>
                    <Iconify
                        icon='material-symbols:add-circle-outline'
                        width={20}
                        sx={{ mr: 1 }}
                    />
                    Create New Template
                </MenuItem>
            </Select>

        </Box>


    );
}


CustomSelect.propTypes = {
    onSelect: PropTypes.func,
    selectedTemplate: PropTypes.string,
};
