import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
// _mock
import { PROJECT_TEMPLATES, PROJECT_TEMPLATE_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CustomSelect({ onSelect, selectedTemplate }) {
    // const { enqueueSnackbar } = useSnackbar();

    // const NewUserSchema = Yup.object().shape({
    //     template: Yup.string().required('Template is required'),
    // });

    // const defaultValues = useMemo(
    //     () => ({
    //         template: '',
    //     }),
    //     []
    // );

    // const methods = useForm({
    //     resolver: yupResolver(NewUserSchema),
    //     defaultValues,
    // });

    // const {
    //     reset,
    //     handleSubmit,
    //     formState: { isSubmitting },
    // } = methods;


    // const onSubmit = handleSubmit(async (data) => {
    //     try {
    //         await new Promise((resolve) => setTimeout(resolve, 500));
    //         reset();
    //         // onClose();
    //         enqueueSnackbar('Update success!');
    //         console.info('DATA', data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });

    return (

        // <FormProvider methods={methods} onSubmit={onSubmit}>

        <Box
            rowGap={3}
            columnGap={2}
            display="grid"

            sx={{ marginBottom: "2rem" }}
        >
            {/* name="template" */}
            <Select onChange={(e) => onSelect(e.target.value)} name="template" value={selectedTemplate} label="" placeholder='Choose Template' sx={{
                "& .MuiSelect-select": {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                }
            }}>
                {/* {PROJECT_TEMPLATE_OPTIONS.map(({ value, label, icon }) => (
                    <MenuItem  key={value} value={value} sx={{ height: 50, px: 3, borderTop: value === 'create' ? '1px solid black' : '', borderRadius: 0 }}>
                        {(value === 'create') && <Iconify
                            icon={icon}
                            width={20}
                            sx={{ mr: 1 }}
                        />}
                        {label}
                        {(value === 'default') && <Iconify
                            icon={icon}
                            width={28}
                            sx={{ mx: 1 }}
                        />}
                    </MenuItem>
                ))} */}
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

// {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 2 }}>
//     Update
// </LoadingButton> */}
// {/* </FormProvider> */ }
CustomSelect.propTypes = {
    onSelect: PropTypes.func,
    selectedTemplate: PropTypes.string,
};
