import React from "react";
// import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Box } from "@material-ui/core";
import { DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
// import { ChunkPlace } from 'components/pages/trips/Trip';

interface Props {
  innerRef: any; // TODO: KP
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  // chunkPlace: ChunkPlace;
}

export const ChunkPlaceCard = ({
  innerRef,
  provided,
  snapshot,
  chunkPlace
}: any) => {
  // const classes = useStyles();
  const { place } = chunkPlace;
  const { id, name, placeTypes, reviews, photoUrls } = place;

  return (
    <Card
      // className={classes.root}
      ref={innerRef}
      raised={snapshot.isDragging}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <CardContent>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          // className={classes.placeInfoContainer}
        >
          <Typography variant="h5" component="h5">
            {name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
