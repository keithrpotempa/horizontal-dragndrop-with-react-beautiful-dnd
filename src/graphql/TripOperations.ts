// @ts-nocheck

// GRAPHQL MUTATIONS AND FRAGMENTS

import gql from "graphql-tag";
import { useTypedQuery, TypedQuery } from "graphql/TypedQuery";
import { createApolloQueryResponse } from "graphql/UseApolloQueryResponse";
import { PlaceNode } from "graphql/Fragments";
import { useMutationWrapper } from "graphql/UseMutationWrapper";
import { useMutation } from "@apollo/client";
import { LogTags } from "utilities";

export function useTrip(
  input: any, // TODO: KP: Type
  options?: any // TODO: KP: Type
) {
  return createApolloQueryResponse(
    useTypedQuery(useTripByPKTypedQuery, {
      variables: {
        ...input
      },
      ...options
    }),
    options
  );
}

const TRIP_DETAIL_RAW_FRAGMENT = `
    creatorId
    description
    id
    name
`;

const CHUNK_DETAIL_RAW_FRAGMENT = `
      connectionDetails
      description
      id
      name
      order
      tripId
`;

const CHUNKPLACE_DETAIL_RAW_FRAGMENT = `
        chunkId
        details
        estimatedTimeInMinutes
        order
        placeId
        `;

const TripNode = {
  fragments: {
    tripDetail: gql`
      fragment TripDetail on tripPlanning_trips {
        ${TRIP_DETAIL_RAW_FRAGMENT}
        __typename
      }
    `,
    chunksData: gql`
      fragment ChunksData on tripPlanning_chunks {
        ${CHUNK_DETAIL_RAW_FRAGMENT}
      }
    `,
    chunkPlacesData: gql`
      fragment ChunkPlacesData on tripPlanning_chunkPlaces {
        ${CHUNKPLACE_DETAIL_RAW_FRAGMENT}
      }
    `
  }
};

const GET_TRIP_DETAILS_BY_PK = gql`
  query GetTripsByPK($tripId: uuid!) {
    tripPlanning_trips_by_pk(id: $tripId) {
      ...TripDetail
      chunks {
        ...ChunksData
        chunkPlaces {
          ...ChunkPlacesData
          place {
            ...PlaceData
          }
        }
      }
    }
  }
  ${TripNode.fragments.tripDetail}
  ${TripNode.fragments.chunksData}
  ${TripNode.fragments.chunkPlacesData}
  ${PlaceNode.fragments.placeData}
`;

export const useTripByPKTypedQuery: TypedQuery<any, {}> = {
  queryDocument: GET_TRIP_DETAILS_BY_PK,
  queryName: "GetTripsByPK"
};

// Upsert is being used as a work-around to:
// - pass in an array of objects
// - change the order on "conflicts"
// https://hasura.io/docs/1.0/graphql/manual/mutations/upsert.html#update-selected-columns-on-conflict
const UPSERT_CHUNK_ORDER = gql`
  mutation UpdateChunkOrder(
    $tripId: uuid!
    $objects: [tripPlanning_chunks_insert_input!]!
  ) {
    insert_tripPlanning_chunks(
      objects: $objects
      on_conflict: {
        constraint: chunks_pkey
        update_columns: [order]
        where: { tripId: { _eq: $tripId } }
      }
    ) {
      affected_rows
    }
  }
`;
export function useUpsertChunkOrderMutation() {
  return useMutationWrapper(
    useMutation<any, any>(UPSERT_CHUNK_ORDER), // TODO: KP: types
    {
      errorTag: LogTags.ErrorUpdatingCity, // TODO: KP: make error tag
      displayAlert: false
    }
  );
}

const UPSERT_CHUNKPLACE_ORDER = gql`
  mutation UpdateChunkPlaceOrder(
    $chunkId: uuid!
    $objects: [tripPlanning_chunkPlaces_insert_input!]!
  ) {
    insert_tripPlanning_chunkPlaces(
      objects: $objects
      on_conflict: {
        constraint: chunkPlaces_pkey
        update_columns: [order]
        where: { chunkId: { _eq: $chunkId } }
      }
    ) {
      affected_rows
    }
  }
`;

const DELETE_CHUNKPLACE = gql`
  mutation DeleteChunkPlace($chunkId: uuid, $placeId: uuid) {
    delete_tripPlanning_chunkPlaces(
      where: {
        _and: { placeId: { _eq: $placeId }, chunkId: { _eq: $chunkId } }
      }
    ) {
      affected_rows
    }
  }
`;

export function useUpsertChunkPlaceOrderMutation() {
  return useMutationWrapper(
    useMutation<any, any>(UPSERT_CHUNKPLACE_ORDER), // TODO: KP: types
    {
      errorTag: LogTags.ErrorUpdatingCity, // TODO: KP: make error tag
      displayAlert: false
    }
  );
}

export function useDeleteChunkPlaceMutation() {
  return useMutationWrapper(
    useMutation<any, any>(DELETE_CHUNKPLACE), // TODO: KP: types
    {
      errorTag: LogTags.ErrorUpdatingCity, // TODO: KP: make error tag
      displayAlert: false
    }
  );
}
