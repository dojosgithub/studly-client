import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
// @mui
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// api
import {
  updateColumn,
  clearColumn,
  deleteColumn,
  createTask,
  updateTask,
  deleteTask,
} from 'src/api/kanban';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
//
import Scrollbar from 'src/components/scrollbar';
import KanbanTaskItem from './kanban-task-item';
import KanbanTaskAdd from './kanban-task-add';
import KanbanColumnToolBar from './kanban-column-tool-bar';

// ----------------------------------------------------------------------

export default function KanbanColumn({ column, tasks, index }) {
  const { enqueueSnackbar } = useSnackbar();

  const openAddTask = useBoolean();

  // const handleUpdateColumn = useCallback(
  //   async (columnName) => {
  //     try {
  //       if (column.name !== columnName) {
  //         updateColumn(column.id, columnName);

  //         enqueueSnackbar('Update success!', {
  //           anchorOrigin: { vertical: 'top', horizontal: 'center' },
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [column.id, column.name, enqueueSnackbar]
  // );

  // const handleClearColumn = useCallback(async () => {
  //   try {
  //     clearColumn(column.id);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [column.id]);

  // const handleDeleteColumn = useCallback(async () => {
  //   try {
  //     deleteColumn(column.id);

  //     enqueueSnackbar('Delete success!', {
  //       anchorOrigin: { vertical: 'top', horizontal: 'center' },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [column.id, enqueueSnackbar]);

  // const handleAddTask = useCallback(
  //   async (taskData) => {
  //     try {
  //       createTask(column.id, taskData);

  //       openAddTask.onFalse();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [column.id, openAddTask]
  // );



  // add task button
  // const renderAddTask = (
  //   <Stack
  //     spacing={2}
  //     sx={{
  //       pb: 3,
  //     }}
  //   >
  //     {openAddTask.value && (
  //       <KanbanTaskAdd
  //         status={column.name}
  //         onAddTask={handleAddTask}
  //         onCloseAddTask={openAddTask.onFalse}
  //       />
  //     )}

  //     <Button
  //       fullWidth
  //       size="large"
  //       color="inherit"
  //       startIcon={
  //         <Iconify
  //           icon={openAddTask.value ? 'solar:close-circle-broken' : 'mingcute:add-line'}
  //           width={18}
  //           sx={{ mr: -0.5 }}
  //         />
  //       }
  //       onClick={openAddTask.onToggle}
  //       sx={{ fontSize: 14 }}
  //     >
  //       {openAddTask.value ? 'Close' : 'Add Task'}
  //     </Button>
  //   </Stack>
  // );

  const handleUpdateTask = useCallback(async (taskData) => {
    try {
      updateTask(taskData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDeleteTask = useCallback(
    async (taskId) => {
      try {
        deleteTask(column.id, taskId);

        enqueueSnackbar('Delete success!', {
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      } catch (error) {
        console.error(error);
      }
    },
    [column.id, enqueueSnackbar]
  );

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            px: 2,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            ...(snapshot.isDragging && {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }),
            width: index === 1 ? '100%' : 400,
            height: index === 1 ? '100%' : 'auto',
            display: index === 1 ? 'grid' : 'initial',
            placeContent: index === 1 ? 'center' : 'start',
          }}
        >
          <Stack {...provided.dragHandleProps}>
            {/* column toolbar header */}
            {/* <KanbanColumnToolBar
                columnName={column.name}
                onUpdateColumn={handleUpdateColumn}
                onClearColumn={handleClearColumn}
                onDeleteColumn={handleDeleteColumn}
              /> */}
            {/* <Scrollbar sx={{ maxHeight: index === 0 ? "300px" : "100%" }}> */}

              <Droppable droppableId={column.id} type="TASK">
                {(dropProvided) => (
                  <Stack
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    spacing={2}
                    sx={{
                      py: 3,
                      // width: 280,
                      width: "100%",
                      alignSelf: index === 1 ? 'center' : 'inherit'
                    }}
                  >
                    {(column.taskIds.length <= 0) && (<RenderEmptyColumn />)}
                    {column.taskIds.map((taskId, taskIndex) => (
                      <KanbanTaskItem
                        key={taskId}
                        index={taskIndex}
                        task={tasks[taskId]}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={() => handleDeleteTask(taskId)}
                      />
                    ))}
                    {dropProvided.placeholder}
                  </Stack>
                )}
              </Droppable>

            {/* </Scrollbar> */}

          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}




KanbanColumn.propTypes = {
  column: PropTypes.object,
  index: PropTypes.number,
  tasks: PropTypes.object,
};

const RenderEmptyColumn = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
    <Iconify width={24} icon="streamline:add-circle" sx={{ mr: 0.25, color: 'dimgrey' }} />
    <Typography fontWeight='500' color='dimgrey'>Drag and Drop a Status</Typography>
  </Box>
)
