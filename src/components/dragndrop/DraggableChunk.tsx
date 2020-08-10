import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

interface Props {
  chunk: any; // TODO: KP
  children: any; // TODO: KP
  index: number;
}

export const DraggableChunk = ({ chunk, children, index }: Props) => {
  return (
    <Draggable draggableId={chunk.id} index={index}>
      {(provided: DraggableProvided) => (
        <Grid
          item
          xs={6}
          {...provided.draggableProps}
          innerRef={provided.innerRef}
        >
          <Typography variant="h2" gutterBottom {...provided.dragHandleProps}>
            {chunk.name}
          </Typography>
          {children}
        </Grid>
      )}
    </Draggable>
  );
};
