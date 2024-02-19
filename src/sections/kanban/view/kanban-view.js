import { useCallback, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
  const [board, setBoard] = useState(boardAPI)

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
        if (sourceColumn.id === destinationColumn.id) {
          const newTaskIds = [...sourceColumn.taskIds];

          newTaskIds.splice(source.index, 1);

          newTaskIds.splice(destination.index, 0, draggableId);

          // moveTask({
          //   ...board?.columns,
          //   [sourceColumn.id]: {
          //     ...sourceColumn,
          //     taskIds: newTaskIds,
          //   },
          // });
          
          const updatedColumns = {
            ...board?.columns,
            [sourceColumn.id]: {
              ...sourceColumn,
              taskIds: newTaskIds,
            },
          }
          // update board.columns
          const columns = updatedColumns;
          const obj = {
            ...board,
            columns,
          };
          setBoard(obj)



          console.info('Moving to same list!');
          console.log('board', board);

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
        //   [sourceColumn.id]: {
        //     ...sourceColumn,
        //     taskIds: sourceTaskIds,
        //   },
        //   [destinationColumn.id]: {
        //     ...destinationColumn,
        //     taskIds: destinationTaskIds,
        //   },
        // });


        const updatedColumns = {
          ...board?.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumn.id]: {
            ...destinationColumn,
            taskIds: destinationTaskIds,
          },
        }
        // update board.columns
        const columns = updatedColumns;
        const obj = {
          ...board,
          columns,
        };
        setBoard(obj)

        console.info('Moving to different list!');
        console.log('board', board);

      } catch (error) {
        console.error(error);
      }
    },
    // [board?.columns, board?.ordered, board]
    [board]
  );





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
                {board?.ordered.map((columnId, index) => (
                  (index <= 1) && (
                    <KanbanColumn
                      index={index}
                      key={columnId}
                      column={board?.columns[columnId]}
                      tasks={board?.tasks}
                    />)
                ))}

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
