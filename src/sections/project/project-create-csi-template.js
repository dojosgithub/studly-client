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
  const MemoizedTreeItem = React.memo(CustomTreeItem);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trades',
  });

  useEffect(() => {
    console.log('Checked items array:', checkedItems);
  }, [checkedItems]);

  // Define handleCheckboxChange with useCallback
  const handleCheckboxChange = useCallback((event, node) => {
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
          return [...prevCheckedItems, transformedNode];
        }
      } else {
        // If the checkbox is unchecked, remove the item from the state
        return prevCheckedItems.filter((item) => item._id !== transformedNode._id);
      }

      // Return the previous state if no changes were made
      return prevCheckedItems;
    });
  }, []);

  const renderTree = useCallback(
    (nodes) => (
      <MemoizedTreeItem
        key={nodes.id}
        itemId={nodes.id}
        label={
          <>
            {(!nodes.children || nodes.children.length === 0) && (
              <Checkbox onChange={(event) => handleCheckboxChange(event, nodes)} />
            )}
            {nodes.name}
          </>
        }
      >
        {Array.isArray(nodes.children) &&
          nodes.children.length > 0 &&
          nodes.children.map((node) => renderTree(node))}
      </MemoizedTreeItem>
    ),
    [handleCheckboxChange]
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
          {renderTree(CSI_CODE_TEMPLATE)}
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
