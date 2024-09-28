import React, { useCallback, useEffect } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { styled } from '@mui/material/styles';
// @mui
import { IconButton, alpha, Box, Button, Stack, Typography } from '@mui/material';

// hook-form
import { RHFTextField } from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import Iconify from 'src/components/iconify';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 50,
  height: 50,
  opacity: 1,
  borderRadius: '10px',
  outline: `1px solid ${alpha(theme.palette.grey[700], 0.2)} `,
  '&:hover': {
    opacity: 1,
    outline: `1px solid ${alpha(theme.palette.grey[700], 1)} `,
  },
}));

const ProjectExistingTrade = () => {
  const { control, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trades',
  });

  useEffect(() => {}, [fields]);

  const handleAdd = useCallback(() => {
    append({
      name: '',
      tradeId: '',
      _id: uuidv4(),
    });
  }, [append]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Tab') {
        handleAdd();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleAdd]);

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <>
      <Box sx={{ marginBottom: '2rem' }}>
        <Box
          sx={{
            display: 'grid',
            marginBottom: '1rem',
            gridTemplateColumns: 'repeat(2, 1fr) 50px',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>ID</Typography>
          <Typography sx={{ fontSize: '.75rem', fontWeight: '600' }}>Name</Typography>
          <Typography> </Typography>
        </Box>
        <Stack gap="1.5rem">
          {fields &&
            fields?.map(({ _id }, index) => (
              <Box
                key={_id}
                sx={{
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: 'repeat(2, 1fr) 50px',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
              >
                <RHFTextField
                  name={`trades[${index}].tradeId`}
                  label="Trade Id"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name={`trades[${index}].name`}
                  label="Trade Name"
                  InputLabelProps={{ shrink: true }}
                />
                <StyledIconButton color="inherit" onClick={() => handleRemove(index)}>
                  <Iconify icon="ic:sharp-remove-circle-outline" width="40px" height="40px" />
                </StyledIconButton>
              </Box>
            ))}
        </Stack>
      </Box>

      <Button
        component="button"
        variant="outlined"
        startIcon={<Iconify icon="mingcute:add-line" />}
        color="secondary"
        onClick={handleAdd}
      >
        Add Another Trade
      </Button>
    </>
  );
};

export default ProjectExistingTrade;
