import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled } from '@mui/material/styles';
import debounce from 'lodash/debounce';
// @mui
import { IconButton, alpha, Box, Button, Stack, Typography, Checkbox } from '@mui/material';
import { CSI_CODE_TEMPLATE } from 'src/_mock';
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
  const [checkedItems, setCheckedItems] = useState([]);
  const [template, setTemplate] = useState(CSI_CODE_TEMPLATE);
  const MemoizedTreeItem = React.memo(CustomTreeItem);
  const { trades } = getValues();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trades',
  });
  useEffect(() => {
    setCheckedItems(trades || []);
  }, [trades]);
  useEffect(() => {
    // console.log('Checked items array:', checkedItems);
    // console.log('trades:', trades);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

  // Define handleCheckboxChange with useCallback
  const handleCheckboxChange = useCallback(
    (event, node) => {
      const isChecked = event.target.checked;
      const transformedNode = {
        _id: node.id, // Rename `id` to `_id`
        name: node.name,
        tradeId: node.tradeId,
        // Exclude `children` property
      };

      setCheckedItems((prevCheckedItems) => {
        // If the checkbox is checked
        if (isChecked) {
          // Check if the item already exists in the state
          const exists = prevCheckedItems.some((item) => item._id === transformedNode._id);
          // If it doesn't exist, add it to the state
          if (!exists) {
            const newTrades = [...prevCheckedItems, transformedNode];
            setValue('trades', newTrades);
            return newTrades;
          }
        } else {
          // If the checkbox is unchecked, remove the item from the state
          const updatedTrades = prevCheckedItems.filter((item) => item._id !== transformedNode._id);
          setValue('trades', updatedTrades);
          return updatedTrades;
        }

        // Return the previous state if no changes were made
        setValue('trades', prevCheckedItems);
        return prevCheckedItems;
      });
    },
    [setValue]
  );

  const checkIfIdExistsInTree = useCallback((id, nodes) => {
    if (nodes.id === id) {
      return true;
    }

    if (nodes.children && nodes.children.length > 0) {
      return nodes.children.some((child) => checkIfIdExistsInTree(id, child));
    }

    return false;
  }, []);

  const renderTree = useCallback(
    (nodes) => {
      const isChecked = checkedItems.some((nestedItem) =>
        checkIfIdExistsInTree(nestedItem._id, nodes)
      );

      return (
        <MemoizedTreeItem
          key={nodes.id}
          itemId={nodes.id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                {(!nodes.children || nodes.children.length === 0) && (
                  <Checkbox
                    name={nodes.name}
                    onChange={(event) => handleCheckboxChange(event, nodes)}
                    checked={isChecked}
                  />
                )}
                {nodes.tradeId}
              </Box>
              <Box>{nodes.name}</Box>
            </Box>
          }
        >
          {Array.isArray(nodes.children) &&
            nodes.children.length > 0 &&
            nodes.children.map((node) => renderTree(node))}
        </MemoizedTreeItem>
      );
    },
    [checkedItems, handleCheckboxChange, checkIfIdExistsInTree]
  );

  return (
    <>
      <Box sx={{ marginBottom: '2rem', width: '100%' }}>
        <SimpleTreeView
          aria-label="customized"
          defaultExpandedItems={['1', '3']}
          slots={{
            expandIcon: ExpandIcon,
            collapseIcon: CollapseIcon,
            // endIcon: EndIcon,
          }}
          sx={{
            minHeight: 270,
            flexGrow: 1,
            width: '100%',
          }}
        >
          {renderTree(template)}
        </SimpleTreeView>
      </Box>

      {/* <Button
        component="button"
        variant="outlined"
        startIcon={<Iconify icon="mingcute:add-line" />}
        color="secondary"
        onClick={handleAdd}
      >
        Add Another Trade
      </Button> */}
    </>
  );
};

export default ProjectCreateCsiTrade;
