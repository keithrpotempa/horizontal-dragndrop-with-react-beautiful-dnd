import { DropResult } from "react-beautiful-dnd";
// import {
//   useUpsertChunkOrderMutation,
//   useUpsertChunkPlaceOrderMutation,
//   useDeleteChunkPlaceMutation
// } from "graphql/tripPlanning/TripOperations";

export const UseTripReordering = (tripState, setTripState) => {
  // GRAPHQL BACK END MUTATIONS
  // const [upsertChunkOrderMutation] = useUpsertChunkOrderMutation();
  // const [upsertChunkPlaceOrderMutation] = useUpsertChunkPlaceOrderMutation();
  // const [deleteChunkPlaceMutation] = useDeleteChunkPlaceMutation();

  const getNewOrder = (result: DropResult, whatToReorder: string[]) => {
    const { destination, source, draggableId } = result;
    const newOrder = Array.from(whatToReorder);
    newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, draggableId);
    return newOrder;
  };

  const reorderChunks = (result: DropResult) => {
    const newChunkOrder = getNewOrder(result, tripState.chunkOrder);
    postReorderedChunks(newChunkOrder);
    setTripState(prevState => ({ ...prevState, chunkOrder: newChunkOrder }));
  };

  const postReorderedChunks = newChunkOrder => {
    const tripId = tripState.trip.id;
    let queryObjects = new Array(newChunkOrder.length);
    newChunkOrder.forEach((chunkId, index) => {
      queryObjects[index] = {
        tripId: tripId,
        id: chunkId,
        name: tripState.chunks[chunkId].name,
        order: index + 1
      };
    });

    // POSTING TO THE GRAPHQL BACK END
    // upsertChunkOrderMutation({
    //   variables: {
    //     tripId: tripId,
    //     objects: queryObjects
    //   }
    // })//.then(resp => console.log(resp))
  };

  const reorderChunkPlaces = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    const chunkPlaceId = draggableId;
    const homeChunk = tripState.chunks[source.droppableId];
    const foreignChunk = tripState.chunks[destination.droppableId];

    // Moving chunkPlaces within the same chunk
    if (homeChunk === foreignChunk) {
      const newChunkPlaceOrder = getNewOrder(result, homeChunk.chunkPlaceOrder);
      postReorderedChunkPlaces(homeChunk.id, newChunkPlaceOrder);
      setTripState(prevState => {
        let newState = { ...prevState };
        newState.chunks[homeChunk.id] = {
          ...prevState.chunks[homeChunk.id],
          chunkPlaceOrder: newChunkPlaceOrder
        };
        return newState;
      });
    }

    // Moving chunkPlaces from one chunk to another
    else {
      // Make a new chunkPlaceOrder *without* the moved chunkPlace
      const homeChunkPlaceOrder = Array.from(homeChunk.chunkPlaceOrder);
      homeChunkPlaceOrder.splice(source.index, 1);

      // Make a new chunkPlaceOrder *with* the moved chunkPlace
      const foreignChunkPlaceOrder = Array.from(foreignChunk.chunkPlaceOrder);
      foreignChunkPlaceOrder.splice(destination.index, 0, chunkPlaceId);

      // TODO: KP: it seems like it would be more efficient
      // for a custom mutation to hit
      // each of these three endpoints in one go

      // Posting updated versions of the home chunk
      // (reordered without the moved place)
      postReorderedChunkPlaces(homeChunk.id, homeChunkPlaceOrder);

      // Posting the updated foreign chunk
      // (reordered with the newly added place)
      postReorderedChunkPlaces(foreignChunk.id, foreignChunkPlaceOrder);

      // Deleting the chunkPlace from the home chunk that it left
      deleteChunkPlace(homeChunk.id, chunkPlaceId);

      setTripState(prevState => {
        let newState = { ...prevState };

        // Save both of the new chunkPlaceOrders in state
        newState.chunks[homeChunk.id].chunkPlaceOrder = homeChunkPlaceOrder;
        newState.chunks[
          foreignChunk.id
        ].chunkPlaceOrder = foreignChunkPlaceOrder;

        return newState;
      });
    }
  };

  const postReorderedChunkPlaces = (chunkId, newChunkPlaceOrder) => {
    let queryObjects = new Array(newChunkPlaceOrder.length);
    newChunkPlaceOrder.forEach((chunkPlaceId, index) => {
      queryObjects[index] = {
        chunkId: chunkId,
        placeId: chunkPlaceId,
        order: index + 1
      };
    });
    // upsertChunkPlaceOrderMutation({
    //   variables: {
    //     chunkId: chunkId,
    //     objects: queryObjects
    //   }
    // });//.then(resp => console.log(resp))
  };

  // const deleteChunkPlace = (chunkId, placeId) => {
  //   deleteChunkPlaceMutation({
  //     variables: {
  //       "chunkId": chunkId,
  //       "placeId": placeId
  //     }
  //   })//.then(resp => console.log("deleteResponse", resp));
  // }

  return {
    reorderChunks,
    reorderChunkPlaces
  };
};
