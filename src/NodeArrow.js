import { Arrow, Line } from 'react-konva';
import NodeArrowText from './NodeArrowText';
import { getPerpendicularVector, getPointsOnCurve, getUnitVector } from './utils';

const NODE_TEXT_SPACE = 16;
const CURVE_MULTIPLIER = 40;

const getLineEndAndArrowStart = (textPosition, unitVector, space) => (
  [{ 
    x: textPosition.x - (unitVector.x * space), 
    y: textPosition.y - (unitVector.y * space) 
  }, { 
    x: textPosition.x + (unitVector.x * space), 
    y: textPosition.y + (unitVector.y * space) 
  }]
);

export default function NodeArrow({ initialPosition, currentPosition, incomplete=false, curved=false, removeArrow, addError }) {
  const midpoint = {
    x: (currentPosition.x + initialPosition.x) / 2, 
    y: (currentPosition.y + initialPosition.y) / 2
  };
  const unitVector = getUnitVector(initialPosition, currentPosition);
  const perpendicularUnitVector = getPerpendicularVector(unitVector);

  if (incomplete) {
    return (
      <Arrow 
        points={[ initialPosition.x, initialPosition.y, currentPosition.x, currentPosition.y ]} 
        fill='black' 
        stroke='black' 
      />
    );
  } else {
    let linePoints, lineEnd, arrowPoints, arrowStart, textPosition;

    if (curved) {
      textPosition = {
        x: midpoint.x + (perpendicularUnitVector.x * CURVE_MULTIPLIER),
        y: midpoint.y + (perpendicularUnitVector.y * CURVE_MULTIPLIER)
      }; 
      [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, NODE_TEXT_SPACE);
      linePoints = getPointsOnCurve(initialPosition, currentPosition, textPosition, initialPosition, lineEnd);
      arrowPoints = getPointsOnCurve(initialPosition, currentPosition, textPosition, arrowStart, currentPosition);
    } else {
      textPosition = midpoint;
      [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, NODE_TEXT_SPACE);
      linePoints = [ initialPosition.x, initialPosition.y, lineEnd.x, lineEnd.y ];
      arrowPoints = [ arrowStart.x, arrowStart.y, currentPosition.x, currentPosition.y ];
    }

    return (
      <>
        <Line points={linePoints} fill='black' stroke='black' />
        <NodeArrowText position={textPosition} removeArrow={removeArrow} addError={addError} />
        <Arrow points={arrowPoints} fill='black' stroke='black' />
      </>
    );
  }
};