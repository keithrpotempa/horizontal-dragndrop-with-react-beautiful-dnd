import { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { UseTripReordering } from "./UseTripReordering";

const mungeInitialTripState = ({ response }) => {
  // This function converts the raw Apollo response into
  // the drag n drop friendly format for state

  // Declare the trip object, containing the trip name and details
  const trip = { ...response.tripPlanning_trips_by_pk };

  // Define the array of raw chunks
  const rawChunks = [...trip.chunks];

  // We don't need the chunks to be stored on the trip
  delete trip.chunks;

  // Seeding the three ingredients for the new state:
  let newChunkOrder = new Array(rawChunks.length);
  let newChunks = {};
  let newChunkPlaces = {};
  rawChunks.forEach(rawChunk => {
    // Converting the order of chunks from the raw object's key
    // to the index of the new order array
    newChunkOrder[rawChunk.order - 1] = rawChunk.id;

    // Creating the newChunk as a dictionary key/value pair
    // with the key being the id,
    // and the value being a copy of the rawChunk's data
    const newChunk = (newChunks[rawChunk.id] = { ...rawChunk });

    // This array is used in state
    // to keep the order of the chunkPlaces within the chunk
    newChunk.chunkPlaceOrder = new Array(rawChunk.chunkPlaces.length);

    // TODO: KP: loop in a loop is slow...
    // For each chunkPlace nested within a rawChunk:
    rawChunk.chunkPlaces.forEach(chunkPlace => {
      // add the chunkPlace ids to this order array
      // preserving their order from the raw object
      newChunk.chunkPlaceOrder[chunkPlace.order - 1] = chunkPlace.place.id;

      // Making a "master dictionary" of chunkplaces,
      // to quickly reference the chunkPlace's data,
      // even when migrating between chunks
      newChunkPlaces[chunkPlace.place.id] = { ...chunkPlace };

      // Note: there isn't a chunkplace id, there's only
      // a chunk id and a place id
    });
  });

  let newState: any = {
    trip: trip,
    chunks: newChunks,
    chunkPlaces: newChunkPlaces,
    chunkOrder: newChunkOrder
  };

  return newState;
};

export function useTripDND(rawData) {
  const [tripState, setTripState] = useState<any>(
    mungeInitialTripState(rawData)
  );
  const { reorderChunks, reorderChunkPlaces } = UseTripReordering(
    tripState,
    setTripState
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If they didn't drop the draggable onto a droppable,
    // then don't do anything
    if (!destination) {
      return;
    }

    // If they dropped the draggable into the same spot it was in,
    // then don't do anything
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "chunk") {
      reorderChunks(result);
    }

    if (type === "chunkPlace") {
      reorderChunkPlaces(result);
    }
  };

  return {
    tripState,
    onDragEnd
  };
}
