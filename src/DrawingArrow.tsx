import { Arrow } from 'react-konva';
import { Position } from './types';

interface DrawingArrowProps {
  start: Position;
  end: Position;
}

const DrawingArrow = ({ start, end }: DrawingArrowProps ) => (
  <Arrow 
    points={[ start.x, start.y, end.x, end.y ]} 
    fill='black' 
    stroke='black' 
  />
);

export default DrawingArrow;