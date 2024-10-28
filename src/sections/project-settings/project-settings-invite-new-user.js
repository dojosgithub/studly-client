import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// mui
import { Box, MenuItem, Stack, TableCell, TableRow, Typography, Button } from '@mui/material';
//
import { setUpdateProjectMembers } from 'src/redux/slices/projectSlice';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

// components
import {
  PROJECT_INVITE_EXTERNAL_USER_ROLES,
  PROJECT_INVITE_INTERNAL_USER_ROLES,
  USER_TYPES_STUDLY,
  getRoleKeyByValue,
} from 'src/_mock';
import { CustomInviteAutoComplete } from 'src/components/custom-invite-autocomplete';
import { useResponsive } from 'src/hooks/use-responsive';

const ProjectSettingsInviteNewUser = ({ type = 'internal' }) => {
  const dispatch = useDispatch();
  const isMobile = useResponsive('down', 'sm');

  const userListOptions = useSelector((state) => state?.project?.users);
  const userRoles =
    type === 'external' ? PROJECT_INVITE_EXTERNAL_USER_ROLES : PROJECT_INVITE_INTERNAL_USER_ROLES;
  const InviteUserSchema = Yup.object().shape({
    user: Yup.object().shape({
      email: Yup.string().email('Invalid email').required('User email is required'),
      id: Yup.string(),
    }),
    role: Yup.string().required('User role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      user: {},
      role: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const handleSelectRole = useCallback(
    (index, option) => {
      setValue(`role`, option);
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { role, user } = data;
      const hasEmailAndId = 'email' in user && 'id' in user;
      const finalData = {
        role: {
          name: role,
          shortName: getRoleKeyByValue(role),
          loggedInAs: USER_TYPES_STUDLY.SUB,
        },
        email: user?.email,
        team: type,
        status: 'invited',
      };
      if (hasEmailAndId) {
        finalData.user = data.user._id;
        finalData.status = 'joined';
      }
      // ? if user id exists then the user already exist in the system we directly add in the project but if it doesn't we need to create new user first send invitation via email along with login credentials
      dispatch(setUpdateProjectMembers(finalData));
      reset(defaultValues);
    } catch (e) {
      console.error(e);
    }
  });

  return (
    // <TableRow>
    //   <TableCell colSpan={isMobile ? 4 : 3} variant="footer">
    <Box p={2}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            // display: 'grid',
            // gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr) 50px' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: '1rem',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Stack flex={1}>
            <CustomInviteAutoComplete optionsList={userListOptions} />
            {errors && errors?.user?.message && (
              <Typography color="red" fontSize=".75rem">
                {errors?.user?.message}
              </Typography>
            )}
            {errors && errors?.user?.email?.message && (
              <Typography color="red" fontSize=".75rem">
                {errors?.user?.email?.message}
              </Typography>
            )}
          </Stack>
          <RHFSelect name="role" label="Role" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }}>
            {userRoles.map((role, index) => (
              <MenuItem
                key={role.value}
                value={role.value}
                onClick={() => handleSelectRole(index, role.value)}
              >
                {role.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <Button
            disabled={isSubmitting}
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ minWidth: 'max-content' }}
          >
            Add User
          </Button>
        </Box>
      </FormProvider>
    </Box>
    //   </TableCell>
    // </TableRow>
  );
};

export default ProjectSettingsInviteNewUser;
ProjectSettingsInviteNewUser.propTypes = {
  type: PropTypes.string,
};
