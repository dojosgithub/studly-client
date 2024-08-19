import { useCallback, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useFormContext } from 'react-hook-form';
// api
import { useGetBoard, moveColumn, moveTask } from 'src/api/kanban';
// theme
import { hideScroll } from 'src/theme/css';
// components
import EmptyContent from 'src/components/empty-content';
//
import { PROJECT_WORKFLOW_BOARD_DATA } from 'src/_mock';
import KanbanColumn from '../kanban-column';
import KanbanColumnAdd from '../kanban-column-add';
import { KanbanColumnSkeleton } from '../kanban-skeleton';

// ----------------------------------------------------------------------

export default function KanbanView() {
  // const { board, boardLoading, boardEmpty } = useGetBoard();
  const { board: boardAPI } = PROJECT_WORKFLOW_BOARD_DATA;
  const [board, setBoard] = useState(boardAPI);
  const { getValues, setValue } = useFormContext();
  const formValues = getValues();

  const onDragEnd = useCallback(
    async ({ destination, source, draggableId, type }) => {
      try {
        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return;
        }

        // Moving column
        if (type === 'COLUMN') {
          return;
          // const newOrdered = [...board.ordered];

          // newOrdered.splice(source.index, 1);

          // newOrdered.splice(destination.index, 0, draggableId);

          // // moveColumn(newOrdered);
          // const ordered = newOrdered;

          // const updatedBoard={
          //     ...board,
          //     ordered,
          // }

          // setBoard(updatedBoard)

          // return;
        }

        const sourceColumn = board?.columns[source.droppableId];

        const destinationColumn = board?.columns[destination.droppableId];

        // Moving task to same list
        if (sourceColumn._id === destinationColumn._id) {
          const newTaskIds = [...sourceColumn.taskIds];

          newTaskIds.splice(source.index, 1);

          newTaskIds.splice(destination.index, 0, draggableId);

          // moveTask({
          //   ...board?.columns,
          //   [sourceColumn._id]: {
          //     ...sourceColumn,
          //     taskIds: newTaskIds,
          //   },
          // });

          const updatedColumns = {
            ...board?.columns,
            [sourceColumn._id]: {
              ...sourceColumn,
              taskIds: newTaskIds,
            },
          };
          // update board.columns
          const columns = updatedColumns;
          const obj = {
            ...board,
            columns,
          };
          setBoard(obj);
          const statuses = getTaskObjectsFromColumn(obj);
          setValue('statuses', statuses);
          // const jsonData = JSON.stringify(obj);

          console.info('Moving to same list!');

          return;
        }

        // Moving task to different list
        const sourceTaskIds = [...sourceColumn.taskIds];

        const destinationTaskIds = [...destinationColumn.taskIds];

        // Remove from source
        sourceTaskIds.splice(source.index, 1);

        // Insert into destination
        destinationTaskIds.splice(destination.index, 0, draggableId);

        // moveTask({
        //   ...board?.columns,
        //   [sourceColumn._id]: {
        //     ...sourceColumn,
        //     taskIds: sourceTaskIds,
        //   },
        //   [destinationColumn._id]: {
        //     ...destinationColumn,
        //     taskIds: destinationTaskIds,
        //   },
        // });

        const updatedColumns = {
          ...board?.columns,
          [sourceColumn._id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumn._id]: {
            ...destinationColumn,
            taskIds: destinationTaskIds,
          },
        };
        // update board.columns
        const columns = updatedColumns;
        const obj = {
          ...board,
          columns,
        };
        setBoard(obj);
        const statuses = getTaskObjectsFromColumn(obj);
        setValue('statuses', statuses);
        // const jsonData = JSON.stringify(obj);
        // console.log('jsonData', jsonData);

        console.info('Moving to different list!');
      } catch (error) {
        console.error(error);
      }
    },
    // [board?.columns, board?.ordered, board]
    [board, setValue]
  );

  function getTaskObjectsFromColumn(jsonData) {
    const columnId = '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2';
    const taskIds = jsonData.columns[columnId].taskIds;
    const tasks = jsonData.tasks;

    return taskIds
      .map((taskId) => {
        const task = tasks[taskId];
        return task
          ? {
              id: task._id,
              name: task.name,
              status: task.status,
              priority: task.priority,
            }
          : null;
      })
      .filter((task) => task !== null);
  }

  // const renderSkeleton = (
  //   <Stack direction="row" alignItems="flex-start" spacing={3}>
  //     {[...Array(4)].map((_, index) => (
  //       <KanbanColumnSkeleton key={index} index={index} />
  //     ))}
  //   </Stack>
  // );

  return (
    <Container
      maxWidth={false}
      sx={{
        height: 1,
      }}
    >
      {/* <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Kanban
      </Typography>

      {boardLoading && renderSkeleton}

      {boardEmpty && (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
            maxHeight: { md: 480 },
          }}
        />
      )} */}

      {!!board?.ordered?.length && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <Stack
                ref={provided.innerRef}
                {...provided.droppableProps}
                spacing={3}
                direction="row"
                alignItems="flex-start"
                sx={{
                  p: 0.25,
                  height: 1,
                  overflowY: 'hidden',
                  ...hideScroll.x,
                }}
              >
                {board?.ordered.map(
                  (columnId, index) =>
                    index <= 1 && (
                      <KanbanColumn
                        index={index}
                        key={columnId}
                        column={board?.columns[columnId]}
                        tasks={board?.tasks}
                      />
                    )
                )}

                {provided.placeholder}

                {/* <KanbanColumnAdd /> */}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Container>
  );
}
