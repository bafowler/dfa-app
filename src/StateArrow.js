import { Arrow } from 'react-konva';

export default function StateArrow({ initial, current }) {

  return <Arrow points={[ initial.x, initial.y, current.x, current.y ]} fill='black' stroke='black' />;
};