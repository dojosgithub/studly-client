import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Typography } from '@mui/material';
import Label from 'src/components/label';
// _mock
import { USER_STATUS_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProjectTemplateName({ open, onClose, getTemplateName,trades }) {
    const { enqueueSnackbar } = useSnackbar();

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Template Name is required'),
        // trades: Yup.array()
        //     .of(
        //         Yup.object().shape({
        //             tradeId: Yup.string().required('Trade ID is required'),
        //             name: Yup.string().required('Trade Name is required'),
        //             _id: Yup.string()
        //         })
        //     )
        //     .min(1, 'At least one trade is required'),
    });

    const defaultValues = useMemo(
        () => ({
            name: '',
            // trades: trades || [],
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async ({ name }) => {
        try {
            getTemplateName(name)
            const data = { name, trades }
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            // onClose();
            enqueueSnackbar('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { maxWidth: 720, py: 4, px: 2 },
            }}
        >
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <DialogTitle textAlign='center'>
                    You Have Edited Studly Default Template
                    <Typography sx={{ typography: 'body2' }}>Please name the new template</Typography>
                </DialogTitle>

                <DialogContent>

                    <Stack py='1rem'>
                        <RHFTextField name="name" label="Template Name" />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Done
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}

ProjectTemplateName.propTypes = {
    getTemplateName: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    trades: PropTypes.array,
};
