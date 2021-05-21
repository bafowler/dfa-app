import { Arrow, Line, Text } from 'react-konva';
import NodeArrowText from './NodeArrowText';

export default function NodeArrow({ initialPosition, currentPosition, incomplete=false }) {
  const midpoint = { 
    x: (currentPosition.x + initialPosition.x) / 2, 
    y: (currentPosition.y + initialPosition.y) / 2
  };

  const length = Math.hypot(currentPosition.x - initialPosition.x, currentPosition.y - initialPosition.y);
  
  const unitVector = {
    x: (currentPosition.x - initialPosition.x) / length,
    y: (currentPosition.y - initialPosition.y) / length
  };

  const space = 16;
  
  return incomplete ? (
    <Arrow 
      points={[ initialPosition.x, initialPosition.y, currentPosition.x, currentPosition.y ]} 
      fill='black' 
      stroke='black' 
    />
  ) : (
    <> 
    <Line 
      points={[ initialPosition.x, initialPosition.y, midpoint.x - (unitVector.x * space), midpoint.y - (unitVector.y * space)]} 
      fill='black' 
      stroke='black' 
    />
    <NodeArrowText position={midpoint} />
    <Arrow 
      points={[ midpoint.x + (unitVector.x * space), midpoint.y + (unitVector.y * space), currentPosition.x, currentPosition.y ]} 
      fill='black' 
      stroke='black' 
    />
    </>
  );
};