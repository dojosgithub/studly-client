import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled } from '@mui/material/styles';

// @mui
import { IconButton, alpha, Box, Button, Stack, Typography } from '@mui/material';

// hook-form
import { RHFTextField } from 'src/components/hook-form';
// utils
import uuidv4 from 'src/utils/uuidv4';
//
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

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

function ExpandIcon(props) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(props) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}

const ProjectCreateCsiTrade = () => {
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trades',
  });
  // const [rows, setRows] = useState(trades)
  // const currentTrades = useSelector(state => state.project?.create?.trades);
  // useEffect(() => {
  //     console.log("currentTrades->", currentTrades)
  //     // if (currentTrades && currentTrades?.length > 1) {
  //         console.log("template changed->", currentTrades)
  //         setValue('trades', currentTrades)
  //     // }
  // }, [currentTrades, setValue])

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

  //   const handleAdd = () => {
  //     append({
  //         name: '',
  //         tradeId: '',
  //         _id: uuidv4(),
  //     });
  // };
  const values = watch();

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      resetField(`trades[${index}].name`);
      resetField(`trades[${index}].tradeId`);
    },
    [resetField]
  );

  // const currentDefaultValues = {
  //     name: '',
  //     tradeId: '',
  //     _id: uuidv4(),
  // }

  // const handleDelete = (id) => {
  //     console.log('id', id)
  //     const filteredTrades = trades?.filter(row => row._id !== id);
  //     console.log('filteredTrades', filteredTrades)
  //     setRows(filteredTrades )

  //     setValue("trades", filteredTrades)
  // }

  // const handleAddField = () => {
  //     const updatedTrades = [...trades, { ...currentDefaultValues, _id: uuidv4() }]
  //     console.log('addfield updatedTrades', updatedTrades)
  //     setRows(updatedTrades)
  //     setValue("trades", updatedTrades)

  // }

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
        <SimpleTreeView
          aria-label="customized"
          defaultExpandedItems={['1', '3']}
          slots={{
            expandIcon: ExpandIcon,
            collapseIcon: CollapseIcon,
            endIcon: EndIcon,
          }}
          sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
        >
          <CustomTreeItem itemId="1" label="Main">
            <CustomTreeItem itemId="2" label="Hello" />
            <CustomTreeItem itemId="3" label="Subtree with children">
              <CustomTreeItem itemId="6" label="Hello" />
              <CustomTreeItem itemId="7" label="Sub-subtree with children">
                <CustomTreeItem itemId="9" label="Child 1" />
                <CustomTreeItem itemId="10" label="Child 2" />
                <CustomTreeItem itemId="11" label="Child 3" />
              </CustomTreeItem>
              <CustomTreeItem itemId="8" label="Hello" />
            </CustomTreeItem>
            <CustomTreeItem itemId="4" label="World" />
            <CustomTreeItem itemId="5" label="Something something" />
          </CustomTreeItem>
        </SimpleTreeView>
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

export default ProjectCreateCsiTrade;
