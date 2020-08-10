import React, { useEffect } from "react";
import { Container } from "@material-ui/core";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { DraggableChunk } from "./DraggableChunk";
import { DroppableChunkPlaceList } from "./DroppableChunkPlaceList";

interface Props {
  state: any;
  // state: {
  //   chunkPlaces: any, // TODO: KP
  //   chunks: any, // TODO: KP
  //   chunkOrder: string[],
  // }
}

export const DroppableChunkList = ({ state }: Props) => {
  useEffect(() => {}, [state]);

  return (
    <Droppable droppableId="all-chunks" direction="vertical" type="chunk">
      {(provided: DroppableProvided) => (
        <Container {...provided.droppableProps} innerRef={provided.innerRef}>
          {/* 
            For each Chunk in the state,
            render a DraggableChunk,
            with a child list DroppableChunkPlaceList
            containing all the (draggable) ChunkPlaces within that Chunk
          */}
          {state.chunkOrder.map((chunkId: string, index: number) => {
            const chunk = state.chunks[chunkId];
            const chunkPlaces = state.chunkPlaces;
            const chunkPlaceOrder = chunk.chunkPlaceOrder;

            return (
              <DraggableChunk key={chunkId} chunk={chunk} index={index}>
                <DroppableChunkPlaceList
                  chunk={chunk}
                  chunkPlaces={chunkPlaces}
                  chunkPlaceOrder={chunkPlaceOrder}
                />
              </DraggableChunk>
            );
          })}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
};
