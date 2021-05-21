import { Rect, Text, Group } from 'react-konva';
import { Node } from './Node';

export default function NodeMenu({ createNode }) {
  return (
    <Group
      x={20}
      y={20}
    >
      <Rect
        y={20}
        width={240}
        height={80}
        stroke='#282c34'
        strokeWidth={2}
        cornerRadius={10}
      />
      <Node 
        onClick={e => createNode(e.target.getStage().getPointerPosition())}
        position={{ x: 40, y: 60}}
        isDraggable={false}
      />
      <Node 
        position={{ x: 120, y: 60}}
        isDraggable={false}
        type='accept'
      />
      <Node 
        position={{ x: 200, y: 60}}
        isDraggable={false}
      />
      <Text 
        x={30}
        y={0}
        fontFamily='Gothic A1'
        fontSize={14}
        text="drag and drop to add a state"
        fill='#282c34'
      />
    </Group>
  );
}