import { useEffect, useRef } from 'react';
import { Group, Circle, Text } from 'react-konva';

export const NODE_RADIUS = 25;
export const NODE_OUTER_RADIUS = NODE_RADIUS + 10;
export const NODE_CLICK_RADIUS = NODE_OUTER_RADIUS + 10;

export function Node({ position, number, isDraggable, setPosition, type='default', onClick, focusOnCreation }) {
  const textRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    // Center text within node
    if (textRef.current) {
      const text = textRef.current;
      text.offsetX(text.width() / 2);
      text.offsetY(text.height() / 2);
    }
  }, []);

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
      onDragMove={e => setPosition({ x: e.target.x(), y: e.target.y() })}
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
        ref={textRef}
        fontFamily='Gothic A1'
        fontSize={14}
        text={number === undefined  ?  'q' : `q${number}`}
        fill='#282c34'
        verticalAlign='middle'
      />
    </Group>
  );
}