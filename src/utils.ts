import { ArrowType, Position, Vector } from './types';

const X_AXIS_UNIT_VECTOR = { x: 1, y: 0 };

// Return true iff dest is within the circle defined by center and radius
export const withinCircle = (center: Position, dest: Position, radius: number) => 
  (dest.x - center.x) ** 2 + (dest.y - center.y) ** 2 < radius ** 2;

// Return the point closest to dest on the circle defined by center and radius 
export const getClosestPointOnCircle = (center: Position, dest: Position, radius: number) => {
  const distance = Math.hypot(center.x - dest.x, center.y - dest.y);

  return { x: center.x + (radius * (dest.x - center.x) / distance), 
           y: center.y + (radius * (dest.y - center.y) / distance) };
};

// Return the amount of radians needed to get from the beginning of the circle defined by center to point
export const getRadiansAroundCircle = (point: Position, center: Position) => 
  Math.atan2(point.y - center.y, point.x - center.x);

// Return point rotated angle radians around the circle defined by center
export const rotatePointAlongCircle = (center: Position, point: Position, angle: number) => {
  const radius = getDistance(center, point);
  const rads = getRadiansAroundCircle(point, center);
  return {
    x: center.x + radius * Math.cos(rads + angle),
    y: center.y + radius * Math.sin(rads + angle)
  };
};

// Return true iff there is an arrow in arrows connecting startNodeId to endNodeId
export const isArrowBetweenNodes = (arrows: ArrowType[], startNodeId: number, endNodeId: number) => {
  if (startNodeId === undefined || endNodeId === undefined) {
    return false;
  }
  return !!arrows.find(arrow => {
    if (arrow.startNode && 
        arrow.kind === 'loop' && 
        arrow.startNode.id === startNodeId && 
        startNodeId === endNodeId) {
      return true;
    }

    if (arrow.startNode &&
        arrow.kind === 'node' &&
        arrow.startNode.id === startNodeId &&
        arrow.endNode.id === endNodeId) {
      return true;
    }

    return false;
  });
};

export const getDistance = (p1: Position, p2: Position) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

// Return the midpoint between points p1 and p2
export const getMidpoint = (p1: Position, p2: Position) => ({
  x: (p1.x + p2.x) / 2, 
  y: (p1.y + p2.y) / 2
});

// Return the vector of length 1 connecting points p1 and p2
export const getUnitVector = (p1: Position, p2: Position) => {
  const length = getDistance(p1, p2);
  return {
    x: (p2.x - p1.x) / length,
    y: (p2.y - p1.y) / length
  };
};

// Return the vector perpdendicular to v
export const getPerpendicularVector = (v: Vector) => ({
  x: -v.y,
  y: v.x
});

// Return the angle between l1 and l2 in radians
export const getAngleBetweenLines = (l1: Vector, l2: Vector) => {
  const length1 = Math.hypot(l1.x, l1.y);
  const length2 = Math.hypot(l2.x, l2.y);
  let angle = Math.acos((l1.x * l2.x) + (l1.y * l2.y) / (length1 * length2));
  if (l2.y <= l1.y) {
    return angle;
  } else {
    return (Math.PI * 2) - angle;
  }
};

// Given a point in the standard axis, return the corresponding
// point in the axis rotated by angle radians
export const getStandardPointInRotatedAxis = (point: Position, angle: number) => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.y * Math.cos(angle) + point.x * Math.sin(angle)
});

// Given a point in the axis rotated by angle radians, return
// the corresponding point in the standard axis
export const getRotatedPointInStandardAxis = (point: Position, angle: number) => ({
  x: point.x * Math.cos(angle) + point.y * Math.sin(angle),
  y: point.y * Math.cos(angle) - point.x * Math.sin(angle)
});

// Return the parabolic function defined by vertex and point
export const getParabola = (point: Position, vertex: Position) => {
  const a = (point.y - vertex.y) / (point.x - vertex.x) ** 2;
  return (x: number) => a * (x - vertex.x) ** 2 + vertex.y;
};

// Return an array of points between pointsStart and pointsEnd 
// on the parabola defined by curveStart, curveEnd, and curveVertex
// where curveStart and curveEnd define a new axis of rotation
export const getPointsOnCurve = (
    curveStart: Position, 
    curveEnd: Position, 
    curveVertex: Position, 
    pointsStart: Position, 
    pointsEnd: Position
  ) => {
  const angle = getAngleBetweenLines(X_AXIS_UNIT_VECTOR, getUnitVector(curveStart, curveEnd));
  const rotatedCurveStart = getStandardPointInRotatedAxis(curveStart, angle);
  const rotatedCurveVertex = getStandardPointInRotatedAxis(curveVertex, angle);
  const f = getParabola(rotatedCurveStart, rotatedCurveVertex);

  const rotatedStart = getStandardPointInRotatedAxis(pointsStart, angle);
  const rotatedEnd = getStandardPointInRotatedAxis(pointsEnd, angle);
  const numPoints = Math.floor(rotatedEnd.x - rotatedStart.x);
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const point = getRotatedPointInStandardAxis({
      x: rotatedStart.x + i,
      y: f(rotatedStart.x + i),
    }, angle);

    points.push(point.x);
    points.push(point.y);
  }
  return points;
};