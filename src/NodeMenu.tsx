import { Rect, Text, Group } from 'react-konva';
import { Node } from './Node';
import { NodeVariant, Position } from './types';

const NODE_MENU_HEIGHT = 80;
const NODE_MENU_WIDTH = 180;
const NODE_MENU_PADDING = 50;
const NODE_MENU_GROUP_POSITION = {
  x: 20,
  y: 20,
};
const NODE_MENU_POSITION = {
  x: 0,
  y: 20,
};

interface NodeMenuProps {
  createNode: (type: NodeVariant, position?: Position) => void;
}

export default function NodeMenu({ createNode }: NodeMenuProps) {
  return (
    <Group
      x={NODE_MENU_GROUP_POSITION.x}
      y={NODE_MENU_GROUP_POSITION.y}
    >
      <Rect
        x={NODE_MENU_POSITION.x}
        y={NODE_MENU_POSITION.y}
        width={NODE_MENU_WIDTH}
        height={NODE_MENU_HEIGHT}
        stroke='#282c34'
        strokeWidth={2}
        cornerRadius={10}
      />
      <Node 
        onClick={e => createNode('default', e.target?.getStage()?.getPointerPosition() ?? undefined)}
        position={{ x: NODE_MENU_PADDING, y: NODE_MENU_HEIGHT - NODE_MENU_POSITION.y}}
        isDraggable={false}
      />
      <Node 
        onClick={e => createNode('accept', e.target?.getStage()?.getPointerPosition() ?? undefined)}
        position={{ x: NODE_MENU_WIDTH - NODE_MENU_PADDING, y: NODE_MENU_HEIGHT - NODE_MENU_POSITION.y}}
        isDraggable={false}
        type='accept'
      />
      <Text 
        fontFamily='Gothic A1'
        fontSize={14}
        text="drag and drop to add a state"
        fill='#282c34'
      />
    </Group>
  );
}