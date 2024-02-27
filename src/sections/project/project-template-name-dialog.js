import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Typography } from '@mui/material';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { setCreateTemplate } from 'src/redux/slices/projectSlice';

// ----------------------------------------------------------------------

export default function ProjectTemplateName({ open, onClose,setSelectedTemplate, onTemplateCreation, trades }) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Template Name is required'),

    });

    const defaultValues = useMemo(
        () => ({
            name: '',
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
            const data = { name, trades }
            onTemplateCreation(data)
            console.info('DATA', data);
            setSelectedTemplate('')
            dispatch(setCreateTemplate(data))
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            onClose();
            enqueueSnackbar('Update success!');
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
    onTemplateCreation: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    trades: PropTypes.array,
    setSelectedTemplate: PropTypes.func,
};
