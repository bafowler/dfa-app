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

const NODE_TEXT_SPACE = 14;
const CURVE_MULTIPLIER = 26;
const CURVED_ARROW_BUFFER = Math.PI / 8;

export default function NodeLoop({ node, relativeAnchor, incomplete=false, removeArrow, addError }) {
  const anchor = {
    x: node.position.x + relativeAnchor.x,
    y: node.position.y + relativeAnchor.y,
  };

  const closestPoint = getClosestPointOnCircle(node.position, anchor, NODE_OUTER_RADIUS);
  const start = rotatePointAlongCircle(node.position, closestPoint, CURVED_ARROW_BUFFER );
  const end = rotatePointAlongCircle(node.position, closestPoint, -CURVED_ARROW_BUFFER );
  const midpoint = getMidpoint(closestPoint, anchor);
  const unitVector = getUnitVector(closestPoint, anchor);
  const perpendicularUnitVector = getPerpendicularVector(unitVector);

  const curveOneApex = {
    x: midpoint.x + (perpendicularUnitVector.x * CURVE_MULTIPLIER),
    y: midpoint.y + (perpendicularUnitVector.y * CURVE_MULTIPLIER)
  }; 
  const curveTwoApex = {
    x: midpoint.x - (perpendicularUnitVector.x * CURVE_MULTIPLIER),
    y: midpoint.y - (perpendicularUnitVector.y * CURVE_MULTIPLIER)
  };
  const lineEnd = {
    x: anchor.x + (perpendicularUnitVector.x * NODE_TEXT_SPACE),
    y: anchor.y + (perpendicularUnitVector.y * NODE_TEXT_SPACE),
  };
  const arrowStart = {
    x: anchor.x - (perpendicularUnitVector.x * NODE_TEXT_SPACE),
    y: anchor.y - (perpendicularUnitVector.y * NODE_TEXT_SPACE),
  };

  return (
    <>
      <Line points={getPointsOnCurve(start, lineEnd, curveOneApex, start, lineEnd)} fill='black' stroke='black' />
      {!incomplete && <NodeArrowText position={anchor} removeArrow={removeArrow} addError={addError} />}
      <Arrow points={getPointsOnCurve(arrowStart, end, curveTwoApex, arrowStart, end)} fill='black' stroke='black' />
    </>
  );
};