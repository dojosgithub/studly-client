import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Card,
  Button,
  IconButton,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeInvitedSubcontractor,
  setProjectSettingsTrades,
} from 'src/redux/slices/projectSlice';
import Iconify from 'src/components/iconify';
import ProjectSettingsInviteSubcontractorDialog from './project-settings-invite-subcontractor-dialog';

const ProjectSettingsSubcontractor = () => {
  const { setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [ID, setID] = useState('');
  // GET Subcontractor list in Company
  const subcontractorsList = useSelector((state) => state.project?.subcontractors?.list?.company);
  const subcontractorsInvitedList = useSelector((state) => state.project?.subcontractors?.invited);
  const subcontractors = useMemo(
    () => [...subcontractorsList, ...subcontractorsInvitedList],
    [subcontractorsList, subcontractorsInvitedList]
  );
  const trades = useSelector((state) => state.project.update.trades);
  const initialOptions = trades.reduce((acc, { tradeId, email, firstName, lastName }) => {
    acc[tradeId] = {
      tradeId,
      subcontractorId: '',
      email: email ?? '',
      firstName: firstName ?? '',
      lastName: lastName ?? '',
    };
    return acc;
  }, {});

  const [options, setOptions] = useState(initialOptions);
  const dispatch = useDispatch();

  useEffect(() => {}, [subcontractors, options, trades]);

  const handleSelect = (tradeId, email) => {
    if (email === 'create') {
      setOpen(true);
      setID(tradeId);
    }
  };

  const handleRemove = (tradeId, emailId) => {
    dispatch(removeInvitedSubcontractor(emailId));
    const modifiedTrades = trades.map((trade) => {
      if (trade.tradeId === tradeId) {
        // Remove email from the trade
        const { subcontractorId, email, firstName, lastName, ...restOfTrade } = trade;
        return { ...restOfTrade };
      }
      return trade;
    });
    setValue('trades', modifiedTrades);
    dispatch(setProjectSettingsTrades(modifiedTrades));

    setOptions((prevOptions) => {
      const tradeIds = Object.keys(prevOptions);

      // Check if there's already an option with the same tradeId
      const existingTradeIndex = tradeIds.findIndex((id) => prevOptions[id].tradeId === tradeId);

      if (existingTradeIndex !== -1) {
        // If an option with the same tradeId exists, update its subcontractorId
        const updatedOptions = { ...prevOptions };

        updatedOptions[tradeId].email = '';
        updatedOptions[tradeId].firstName = '';
        updatedOptions[tradeId].lastName = '';
        return updatedOptions;
      }

      return prevOptions;
    });
  };

  return (
    <>
      <Typography sx={{ my: 2 }} fontSize="1.5rem" fontWeight="bold">
        Assign Subcontractor
      </Typography>
      <Divider sx={{ mb: 5 }} />
      <Container>
        <Stack rowGap={5} alignItems="center">
          <Box
            sx={{
              // maxWidth: '500px',
              width: '100%',
              pb: '1rem',
              borderBottom: (theme) => `2px solid ${theme.palette.secondary.main}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              Trade{' '}
            </Typography>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: (theme) => theme.palette.secondary.main,
              }}
            >
              Subcontractor
            </Typography>
          </Box>
          {trades?.map(({ tradeId, name }) => (
            <Card
              sx={{
                width: '100%',
                p: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <Typography fontSize="1rem" minWidth="max-content">
                  {tradeId}
                </Typography>
                <Typography fontSize="1rem">{name}</Typography>
              </Box>
              <Box
                width="100%"
                display="flex"
                gap=".5rem"
                sx={{
                  maxWidth: { xs: '100%', md: '200px' },
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                {!(options[tradeId] && options[tradeId].email) && (
                  <Button variant="contained" onClick={(e) => handleSelect(tradeId, 'create')}>
                    Invite Subcontractor
                  </Button>
                )}

                {options[tradeId] && options[tradeId].email && (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ fontSize: '.75rem' }}
                      onClick={() => handleSelect(tradeId, 'create')}
                    >
                      {options[tradeId]?.firstName && options[tradeId]?.lastName
                        ? `${options[tradeId]?.firstName} ${options[tradeId]?.lastName}`
                        : options[tradeId]?.email?.split('@')[0]}
                    </Button>
                    <IconButton
                      variant="contained"
                      onClick={() => handleRemove(tradeId, options[tradeId].email)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </>
                )}
              </Box>
            </Card>
          ))}
        </Stack>

        {open && (
          <ProjectSettingsInviteSubcontractorDialog
            ID={ID}
            options={options}
            setOptions={setOptions}
            open={open}
            onClose={() => setOpen(false)}
          />
        )}
      </Container>
    </>
  );
};

export default ProjectSettingsSubcontractor;
