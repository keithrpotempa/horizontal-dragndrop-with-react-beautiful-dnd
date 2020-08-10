import React from "react";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DraggableChunkPlace } from "./DraggableChunkPlace";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from "react-beautiful-dnd";
import { Chunk, ChunkPlace } from "components/pages/trips/Trip";

interface Props {
  chunk: Chunk;
  chunkPlaces: ChunkPlace[];
  // TODO: KP
  chunkPlaceOrder: any;
}

const useStyles = makeStyles({
  isDraggingOver: {
    transition: "background-color 01s ease",
    backgroundColor: "pink"
  }
});

export const DroppableChunkPlaceList = ({
  chunk,
  chunkPlaces,
  chunkPlaceOrder
}: Props) => {
  const classes = useStyles();
  return (
    <Droppable droppableId={chunk.id} type="chunkPlace">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <List
          innerRef={provided.innerRef}
          // String interpolation to allow multiple classes
          // conditionally applying one style
          // if the droppable is being dragged over
          className={`
            ${snapshot.isDraggingOver ? classes.isDraggingOver : ""}
          `}
          {...provided.droppableProps}
        >
          {chunkPlaceOrder.map((chunkPlaceId: string, index: number) => {
            const chunkPlace = chunkPlaces[chunkPlaceId];

            return (
              <ListItem key={chunkPlaceId}>
                <DraggableChunkPlace
                  key={chunkPlaceId}
                  chunkPlace={chunkPlace}
                  chunkPlaceId={chunkPlaceId}
                  index={index}
                />
              </ListItem>
            );
          })}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );
};
