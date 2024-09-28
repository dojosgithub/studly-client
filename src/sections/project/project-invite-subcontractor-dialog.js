import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// hook-form
import * as Yup from 'yup';
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Stack } from '@mui/material';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// mock
import { SUBSCRIBER_USER_ROLE_STUDLY, USER_TYPES_STUDLY, getRoleKeyByValue } from 'src/_mock';
import { setInvitedSubcontractor, setProjectTrades } from 'src/redux/slices/projectSlice';

// ----------------------------------------------------------------------

export default function ProjectInviteSubcontractorDialog({
  //
  ID: tradeId,
  options,
  setOptions,
  open,
  onClose,
  ...other
}) {
  // Get List of Subcontractors in DB
  const subcontractorsList = useSelector((state) => state.project?.subcontractors?.list?.company);

  const trades = useSelector((state) => state.project.create.trades);
  const { setValue } = useFormContext();

  const dispatch = useDispatch();
  const InviteUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('User email is required'),
    status: Yup.string(),
    role: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      role: SUBSCRIBER_USER_ROLE_STUDLY.SCO,
      status: 'invited',
      team: null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(InviteUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const isEmailAlreadyExists = async ({ email, firstName, lastName }) => {
    const filteredSubcontractorCompany = subcontractorsList.filter((sub) => sub.email === email);
    const isEmailExistsInCompanyList = filteredSubcontractorCompany?.length > 0;

    const data = { email, firstName, lastName };

    const modifiedTrades = trades.map((trade) => {
      if (trade.tradeId === tradeId) {
        if (!isEmailExistsInCompanyList && trade.subcontractorId) {
          // Remove subcontractorId from the trade
          const { subcontractorId, ...restOfTrade } = trade;
          return { ...restOfTrade, ...data };
        }
        return { ...trade, ...data };
      }
      return trade;
    });
    setValue('trades', modifiedTrades);
    dispatch(setProjectTrades(modifiedTrades));

    setOptions((prevOptions) => {
      const tradeIds = Object.keys(prevOptions);

      // Check if the options object is empty or if the tradeId is not present in prevOptions
      if (tradeIds.length === 0 || !prevOptions[tradeId]) {
        // If options object is empty or tradeId is not present, add a new entry with provided tradeId and subcontractorId
        return { ...prevOptions, [tradeId]: { tradeId, email, firstName, lastName } };
      }

      // Check if there's already an option with the same tradeId
      const existingTradeIndex = tradeIds.findIndex((id) => prevOptions[id].tradeId === tradeId);

      if (existingTradeIndex !== -1) {
        // If an option with the same tradeId exists, update its subcontractorId
        const updatedOptions = { ...prevOptions };

        updatedOptions[tradeId].email = email;
        updatedOptions[tradeId].firstName = firstName;
        updatedOptions[tradeId].lastName = lastName;
        return updatedOptions;
      }

      // If no option with the same tradeId exists, add a new option with provided tradeId and subcontractorId
      return { ...prevOptions, [tradeId]: { tradeId, ...data } };
    });
    return false;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { email, firstName, lastName } = data;
      await isEmailAlreadyExists({ email, firstName, lastName });

      const { role } = data;
      const finalData = {
        ...data,
        role: {
          name: role,
          shortName: getRoleKeyByValue(role),
          loggedInAs: USER_TYPES_STUDLY.SUB,
        },
        team: null,
        status: 'invited',
      };

      // ? if user id exists then the user already exist in the system we directly add in the project but if it doesn't we need to create new user first send invitation via email along with login credentials
      dispatch(setInvitedSubcontractor(finalData));
      reset();
      onClose();
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle> Invite </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(2, 1fr)',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <RHFTextField
                name="firstName"
                label="First Name"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField name="lastName" label="Last Name" InputLabelProps={{ shrink: true }} />
            </Box>

            <Stack>
              <RHFTextField name="email" label="Email address" />
            </Stack>
          </Box>
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
        <Button color="inherit" onClick={handleSubmit(onSubmit)} variant="contained">
          Invite Subcontractor
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProjectInviteSubcontractorDialog.propTypes = {
  ID: PropTypes.string,
  open: PropTypes.bool,
  options: PropTypes.array,
  onClose: PropTypes.func,
  setOptions: PropTypes.func,
};
