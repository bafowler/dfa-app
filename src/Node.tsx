import { useEffect, useRef } from 'react';
import { Group, Circle, Text } from 'react-konva';
import useCenterText from './useCenterText';
import { NODE_RADIUS } from './constants';
import { KonvaEventObject } from 'konva/types/Node';
import { NodeVariant, Position } from './types';
import Konva from 'konva';

const isMouseDown = (e: KonvaEventObject<MouseEvent>) => e.evt.buttons === 1;

interface NodeProps {
  id?: number;
  isDraggable?: boolean;
  position: Position;
  type?: NodeVariant;
  focusOnCreation?: boolean;
  setPosition?: (position: Position) => void;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
}

export function Node({ 
  id, 
  isDraggable=true, 
  position, 
  type='default', 
  setPosition,
  onClick, 
  focusOnCreation=false 
}: NodeProps) {
  const nodeRef = useRef<Konva.Group>(null);
  const [, setTextRef ] = useCenterText();

  useEffect(() => {
    // Begin drag event on node creation to enable drag & drop
    if (nodeRef.current && focusOnCreation) {
      nodeRef.current.startDrag();
    }
  }, [focusOnCreation]);

  return (
    <Group
      ref={nodeRef}
      x={position.x}
      y={position.y}
      draggable={isDraggable}
      onDragMove={(e: KonvaEventObject<DragEvent>) => {
        if (isMouseDown(e) && setPosition) {
          setPosition({ x: e.target.x(), y: e.target.y() })
        } else {
          e.target.stopDrag();
        }
      }}
      onMouseDown={e => {
        if (onClick) onClick(e);
        e.cancelBubble = true;
      }}
    >
      {type === 'accept' && (
        <Circle
          stroke='#282c34'
          strokeWidth={2}
          radius={NODE_RADIUS + 5}
        />
      )}
      <Circle 
        stroke='#282c34'
        strokeWidth={2}
        radius={NODE_RADIUS}
      />
      <Text 
        ref={setTextRef}
        fontFamily='Gothic A1'
        fontSize={14}
        text={id === undefined ? 'q' : `q${id}`}
        fill='#282c34'
        verticalAlign='middle'
      />
    </Group>
  );
}