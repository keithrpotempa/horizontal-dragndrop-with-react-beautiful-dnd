import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import { ChunkPlaceCard } from "../cards/ChunkPlaceCard";
import { ChunkPlace } from "components/pages/trips/Trip";

interface Props {
  chunkPlace: ChunkPlace;
  chunkPlaceId: string;
  index: number;
}

export const DraggableChunkPlace = ({
  chunkPlace,
  chunkPlaceId,
  index
}: Props) => {
  return (
    <Draggable draggableId={chunkPlaceId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <ChunkPlaceCard
          chunkPlace={chunkPlace}
          provided={provided}
          snapshot={snapshot}
          innerRef={provided.innerRef}
        />
      )}
    </Draggable>
  );
};
