import { Arrow, Line } from 'react-konva';
import { NODE_OUTER_RADIUS } from './Node';
import NodeArrowText from './NodeArrowText';
import { 
  getClosestPointOnCircle,
  getMidpoint,
  getPerpendicularVector, 
  getPointsOnCurve, 
  getUnitVector, 
  rotatePointAlongCircle
} from './utils';

const NODE_TEXT_SPACE = 16;
const CURVE_MULTIPLIER = 40;
const CURVED_ARROW_BUFFER = Math.PI / 8;

const getLineEndAndArrowStart = (textPosition, unitVector, space) => (
  [{ 
    x: textPosition.x - (unitVector.x * space), 
    y: textPosition.y - (unitVector.y * space) 
  }, { 
    x: textPosition.x + (unitVector.x * space), 
    y: textPosition.y + (unitVector.y * space) 
  }]
);

export default function NodeArrow({ startNode, endNode, curved=false, removeArrow, addError }) {
  let start = getClosestPointOnCircle(startNode.position, endNode.position, NODE_OUTER_RADIUS);
  let end = getClosestPointOnCircle(endNode.position, startNode.position, NODE_OUTER_RADIUS);

  if (curved) {
    start = rotatePointAlongCircle(startNode.position, start, CURVED_ARROW_BUFFER );
    end = rotatePointAlongCircle(endNode.position, end, -CURVED_ARROW_BUFFER );
  }

  const midpoint = getMidpoint(start, end);
  const unitVector = getUnitVector(start, end);
  const perpendicularUnitVector = getPerpendicularVector(unitVector);

  let linePoints, lineEnd, arrowPoints, arrowStart, textPosition;

  if (curved) {
    textPosition = {
      x: midpoint.x + (perpendicularUnitVector.x * CURVE_MULTIPLIER),
      y: midpoint.y + (perpendicularUnitVector.y * CURVE_MULTIPLIER)
    }; 
    [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, NODE_TEXT_SPACE);
    linePoints = getPointsOnCurve(start, end, textPosition, start, lineEnd);
    arrowPoints = getPointsOnCurve(start, end, textPosition, arrowStart, end);
  } else {
    textPosition = midpoint;
    [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, NODE_TEXT_SPACE);
    linePoints = [ start.x, start.y, lineEnd.x, lineEnd.y ];
    arrowPoints = [ arrowStart.x, arrowStart.y, end.x, end.y ];
  }

  return (
    <>
      <Line points={linePoints} fill='black' stroke='black' />
      <NodeArrowText position={textPosition} removeArrow={removeArrow} addError={addError} />
      <Arrow points={arrowPoints} fill='black' stroke='black' />
    </>
  );
};