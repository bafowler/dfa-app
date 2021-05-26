import { Arrow, Line } from 'react-konva';
import NodeArrowText from './NodeArrowText';
import CurvedLine from './CurvedLine';

const NODE_ARROW_SPACE = 16;
const CURVE_MULTIPLIER = 40;

const getLinePoints = (initialPosition, midpoint, unitVector) => {
  const lineStart = [ initialPosition.x, initialPosition.y ];
  const lineEnd = [ midpoint.x - (unitVector.x * NODE_ARROW_SPACE), midpoint.y - (unitVector.y * NODE_ARROW_SPACE) ];
  return [ ...lineStart, ...lineEnd ];
};

const getArrowPoints = (midpoint, currentPosition, unitVector) => {
  const arrowStart = [ midpoint.x + (unitVector.x * NODE_ARROW_SPACE), midpoint.y + (unitVector.y * NODE_ARROW_SPACE) ];
  const arrowEnd = [ currentPosition.x, currentPosition.y ];
  return [ ...arrowStart, ...arrowEnd ];
};

const getBezierControlPoint = (start, end) => {
  const midpoint = {
    x: (end.x + start.x) / 2,
    y: (end.y + start.y) / 2
  };
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const unitVector = {
    x: (end.x - start.x) / length,
    y: (end.y - start.y) / length,
  }
  const perpendicularUnitVector = {
    x: unitVector.y,
    y: -unitVector.x
  }
  return {
    x: midpoint.x + (perpendicularUnitVector.x * 20),
    y: midpoint.y + (perpendicularUnitVector.y * 20),
  }
};

export default function NodeArrow({ initialPosition, currentPosition, incomplete=false, curved=false, removeArrow, addError }) {
  const midpoint = {
    x: (currentPosition.x + initialPosition.x) / 2, 
    y: (currentPosition.y + initialPosition.y) / 2
  };
  const length = Math.hypot(currentPosition.x - initialPosition.x, currentPosition.y - initialPosition.y);
  const unitVector = {
    x: (currentPosition.x - initialPosition.x) / length,
    y: (currentPosition.y - initialPosition.y) / length
  };

  if (incomplete) {
    return (
      <Arrow 
        points={[ initialPosition.x, initialPosition.y, currentPosition.x, currentPosition.y ]} 
        fill='black' 
        stroke='black' 
      />
    );
  } else if (curved) {
    const perpendicularUnitVector = {
      x: unitVector.y,
      y: -unitVector.x,
    };
    const apex = {
      x: midpoint.x + (perpendicularUnitVector.x * CURVE_MULTIPLIER),
      y: midpoint.y + (perpendicularUnitVector.y * CURVE_MULTIPLIER)
    };
   const firstLineEnd = { 
     x: apex.x - (unitVector.x * NODE_ARROW_SPACE), 
     y: apex.y - (unitVector.y * NODE_ARROW_SPACE) 
    };
   const secondLineStart = { 
     x: apex.x + (unitVector.x * NODE_ARROW_SPACE), 
     y: apex.y + (unitVector.y * NODE_ARROW_SPACE) 
    };


    return (
      <> 
        <CurvedLine 
          points={[ initialPosition, firstLineEnd ]} 
          control={getBezierControlPoint(initialPosition, firstLineEnd)}
        /> 
        <NodeArrowText position={apex} removeArrow={removeArrow} addError={addError} />
        <CurvedLine 
          points={[ secondLineStart, currentPosition ]} 
          control={getBezierControlPoint(secondLineStart, currentPosition)}
        /> 
      </>
    );
  } else {
    return (
      <>
        <Line 
          points={getLinePoints(initialPosition, midpoint, unitVector)}
          fill='black'
          stroke='black'
        />
        <NodeArrowText position={midpoint} removeArrow={removeArrow} addError={addError} />
        <Arrow 
          points={getArrowPoints(midpoint, currentPosition, unitVector)} 
          fill='black' 
          stroke='black' 
        />
      </>
    );
  }
};