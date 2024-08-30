import React, { useEffect } from 'react';

// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
//
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
// components
import { isEmpty } from 'lodash';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { getInviteDetails } from 'src/redux/slices/inviteSlice';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo/logo1';
import InviteUserForm from '../invite-user-form';

// ----------------------------------------------------------------------

export default function InviteNewUserView() {
  const showForm = useBoolean();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      const { error, payload } = await dispatch(getInviteDetails(params?.inviteId));
      if (!isEmpty(error)) {
        enqueueSnackbar(error.message, { variant: 'error' });
        router.push(paths.page404);
      }
    };
    if (!isEmpty(params)) {
      initialize();
    }
  }, [dispatch, params, enqueueSnackbar, router]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        maxWidth={500}
        mx="auto"
        sx={{
          alignItems: 'center',
        }}
      >
        <Logo style={{ marginBottom: '5rem', height: '2.5rem', width: 'auto' }} />
        <Typography sx={{ mb: 4 }} textAlign="center" fontSize="2rem" fontWeight="bold">
          You have been Invited to Studly
        </Typography>

        {!showForm?.value && (
          <Button variant="contained" color="primary" onClick={showForm.onToggle}>
            Join Now
          </Button>
        )}
        {showForm?.value && <InviteUserForm />}
      </Stack>
    </Container>
  );
}
