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

export default function NodeLoop({ node, relativeAnchor, incomplete=false, removeArrow, addError }) {
  const anchor = {
    x: node.position.x + relativeAnchor.x,
    y: node.position.y + relativeAnchor.y,
  };

  const closestPoint = getClosestPointOnCircle(node.position, anchor, NODE_OUTER_RADIUS);
  const start = rotatePointAlongCircle(node.position, closestPoint, -CURVED_ARROW_POINT_ROTATION );
  const end = rotatePointAlongCircle(node.position, closestPoint, CURVED_ARROW_POINT_ROTATION );
  const midpoint = getMidpoint(closestPoint, anchor);
  const unitVector = getUnitVector(closestPoint, anchor);
  const perpendicularUnitVector = getPerpendicularVector(unitVector);

  const curveOneApex = {
    x: midpoint.x - (perpendicularUnitVector.x * CURVED_ARROW_MULTIPLIER),
    y: midpoint.y - (perpendicularUnitVector.y * CURVED_ARROW_MULTIPLIER)
  }; 
  const curveTwoApex = {
    x: midpoint.x + (perpendicularUnitVector.x * CURVED_ARROW_MULTIPLIER),
    y: midpoint.y + (perpendicularUnitVector.y * CURVED_ARROW_MULTIPLIER)
  };
  const lineEnd = {
    x: anchor.x - (perpendicularUnitVector.x * ARROW_TEXT_SPACE),
    y: anchor.y - (perpendicularUnitVector.y * ARROW_TEXT_SPACE),
  };
  const arrowStart = {
    x: anchor.x + (perpendicularUnitVector.x * ARROW_TEXT_SPACE),
    y: anchor.y + (perpendicularUnitVector.y * ARROW_TEXT_SPACE),
  };

  return (
    <>
      <Line points={getPointsOnCurve(start, lineEnd, curveOneApex, start, lineEnd)} fill='black' stroke='black' />
      {!incomplete && <NodeArrowText position={anchor} removeArrow={removeArrow} addError={addError} />}
      <Arrow points={getPointsOnCurve(arrowStart, end, curveTwoApex, arrowStart, end)} fill='black' stroke='black' />
    </>
  );
};