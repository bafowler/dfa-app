import { Arrow } from 'react-konva';

export default function NodeArrow({ initialPosition, currentPosition }) {
  return (<Arrow 
            points={[ initialPosition.x, initialPosition.y, currentPosition.x, currentPosition.y ]} 
            fill='black' 
            stroke='black' 
          />);
};