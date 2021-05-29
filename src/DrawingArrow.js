import { Arrow } from 'react-konva';

const DrawingArrow = ({ start, end} ) => (
  <Arrow 
    points={[ start.x, start.y, end.x, end.y ]} 
    fill='black' 
    stroke='black' 
  />
);

export default DrawingArrow;