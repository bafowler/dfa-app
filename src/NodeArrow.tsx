import { Arrow, Line } from 'react-konva';
import NodeArrowText from './NodeArrowText';
import { 
  getClosestPointOnCircle,
  getMidpoint,
  getPerpendicularVector, 
  getPointsOnCurve, 
  getUnitVector, 
  rotatePointAlongCircle
} from './utils';
import {
  ARROW_TEXT_SPACE, 
  CURVED_ARROW_MULTIPLIER, 
  CURVED_ARROW_POINT_ROTATION, 
  NODE_OUTER_RADIUS
} from './constants';
import { NodeType, Position, Vector } from './types';

const getLineEndAndArrowStart = (textPosition: Position, unitVector: Vector, space: number) => (
  [{ 
    x: textPosition.x - (unitVector.x * space), 
    y: textPosition.y - (unitVector.y * space) 
  }, { 
    x: textPosition.x + (unitVector.x * space), 
    y: textPosition.y + (unitVector.y * space) 
  }]
);

interface NodeArrowProps {
  startNode: NodeType;
  endNode: NodeType;
  curved?: boolean;
  incomplete?: boolean;
  removeArrow?: (errorMsg: string) => void;
  addError?: (errorMsg: string) => void;
}


export default function NodeArrow({ startNode, endNode, curved=false, incomplete=false, removeArrow, addError }: NodeArrowProps) {
  let start = getClosestPointOnCircle(startNode.position, endNode.position, NODE_OUTER_RADIUS);
  let end = getClosestPointOnCircle(endNode.position, startNode.position, NODE_OUTER_RADIUS);

  if (curved) {
    start = rotatePointAlongCircle(startNode.position, start, CURVED_ARROW_POINT_ROTATION );
    end = rotatePointAlongCircle(endNode.position, end, -CURVED_ARROW_POINT_ROTATION );
  }

  const midpoint = getMidpoint(start, end);
  const unitVector = getUnitVector(start, end);
  const perpendicularUnitVector = getPerpendicularVector(unitVector);

  let linePoints, lineEnd, arrowPoints, arrowStart, textPosition;

  if (curved) {
    textPosition = {
      x: midpoint.x + (perpendicularUnitVector.x * CURVED_ARROW_MULTIPLIER),
      y: midpoint.y + (perpendicularUnitVector.y * CURVED_ARROW_MULTIPLIER)
    }; 
    [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, ARROW_TEXT_SPACE);
    linePoints = getPointsOnCurve(start, end, textPosition, start, lineEnd);
    arrowPoints = getPointsOnCurve(start, end, textPosition, arrowStart, end);
  } else {
    textPosition = midpoint;
    [ lineEnd, arrowStart ] = getLineEndAndArrowStart(textPosition, unitVector, ARROW_TEXT_SPACE);
    linePoints = [ start.x, start.y, lineEnd.x, lineEnd.y ];
    arrowPoints = [ arrowStart.x, arrowStart.y, end.x, end.y ];
  }

  return (
    <>
      <Line points={linePoints} fill='black' stroke='black' />
      {!incomplete && removeArrow && addError && <NodeArrowText position={textPosition} removeArrow={removeArrow} addError={addError} />}
      <Arrow points={arrowPoints} fill='black' stroke='black' />
    </>
  );
};