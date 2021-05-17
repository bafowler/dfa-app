import { useEffect, useState, useRef } from 'react';
import { Group, Circle, Text } from 'react-konva';

export default function State({ number }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current;
      text.offsetX(text.width() / 2);
      text.offsetY(text.height() / 2);
    }
  }, []);

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onDragEnd={e => 
        setPosition({ x: e.target.x(), y: e.target.y() })
      }
    >
      <Circle 
        stroke='#282c34'
        strokeWidth={2}
        radius={25}
      />
      <Text 
        ref={textRef}
        fontFamily='Gothic A1'
        fontSize={14}
        align='center'
        text='q'
        fill='#282c34'
        verticalAlign='middle'
      />
    </Group>

  );
}