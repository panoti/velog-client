import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { SeriesPostPreview } from '../../lib/graphql/series';
import SeriesPostItem from './SeriesPostItem';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

const DraggableSeriesPostList = styled.div`
  margin-top: 2.25rem;
`;

const DroppableBlock = styled.div<{ isDraggingOver: boolean }>`
  background: ${props =>
    props.isDraggingOver ? palette.gray1 : palette.gray0};
  border-radius: 4px;
  padding: 1.5rem;
`;

const DraggableBlock = styled.div<{ isDragging: boolean }>`
  user-select: none;
  ${props =>
    props.isDragging
      ? css`
          opacity: 0.6;
        `
      : css`
          opacity: 1;
        `}

  & + & {
    margin-top: 1rem;
  }
`;

export interface DraggableSeriesListProps {
  seriesPosts: SeriesPostPreview[];
}

const DraggableSeriesList = ({ seriesPosts }: DraggableSeriesListProps) => {
  const [tempPosts, setTempPosts] = useState(seriesPosts);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DraggableSeriesPostList>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
            return (
              <DroppableBlock
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tempPosts.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <DraggableBlock
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <SeriesPostItem
                          date={item.post.released_at}
                          title={item.post.title}
                          description={item.post.short_description}
                          thumbnail={item.post.thumbnail}
                          index={index + 1}
                          urlSlug={item.post.url_slug}
                          key={item.id}
                          username=""
                          edit
                        />
                      </DraggableBlock>
                    )}
                  </Draggable>
                ))}
              </DroppableBlock>
            );
          }}
        </Droppable>
      </DraggableSeriesPostList>
    </DragDropContext>
  );
};

export default DraggableSeriesList;