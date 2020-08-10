import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { DroppableChunkList } from "../dragndrop/DroppableChunkList";
// import { Place } from "../../../@types/Place";
import { useTripDND } from "../../hooks/UseTripDND";
// import { TripHeader } from "components/trips/TripHeader";
import { Box } from "@material-ui/core";
import { sampleResponse } from "../../graphql/sampleData";

export interface Chunk {
  id: string;
  title: string;
  chunkPlaceIds: string[];
}

export interface ChunkPlace {
  id: string;
  content: string;
}

export interface Chunk {
  id: string;
  name: string;
  description: string | null;
  order: number;
  chunkPlaces: ChunkPlace[];
}

export interface ChunkPlace {
  details: string;
  estimatedTimeInMinutes: number | null;
  order: number;
  // place: Place;
}

export function TripContainer() {
  return (
    <Box display="flex" flexDirection="column">
      <Trip response={sampleResponse.data} />
    </Box>
  );
}

const Trip = response => {
  // TODO: KP: I feel like this is a weird way
  // to pass the raw query to state...
  // but not certain of a better way
  console.log(response);
  const { tripState, onDragEnd } = useTripDND(response);

  return (
    <>
      {/* <TripHeader
        state={tripState} 
      /> */}
      <h1> Horizontal Drag-n-Drop with React Beautiful DND </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <DroppableChunkList state={tripState} />
      </DragDropContext>
    </>
  );
};
