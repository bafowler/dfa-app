const X_AXIS_UNIT_VECTOR = { x: 1, y: 0 };

// Return true iff dest is within the circle defined by center and radius
export const withinCircle = (center, dest, radius) => (Math.pow(dest.x - center.x, 2) + Math.pow(dest.y - center.y, 2)) < Math.pow(radius, 2);

// Return the point closest to dest on the circle defined by center and radius 
export const getClosestPointOnCircle = (center, dest, radius) => {
  const distance = Math.hypot(center.x - dest.x, center.y - dest.y);

  return { x: center.x + (radius*(dest.x - center.x) / distance), 
           y: center.y + (radius*(dest.y - center.y) / distance) };
};

// Return true iff there is an arrow in arrows connecting startNodeId to endNodeId
export const isArrowBetweenNodes = (arrows, startNodeId, endNodeId) => {
  if (startNodeId === undefined || endNodeId === undefined) {
    return false;
  }
  return !!arrows.find(arrow => arrow.startNodeId === startNodeId && arrow.endNodeId === endNodeId);
};

// Return the vector of length 1 connecting points p1 and p2
export const getUnitVector = (p1, p2) => {
  const length = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  return {
    x: (p2.x - p1.x) / length,
    y: (p2.y - p1.y) / length
  };
};

// Return the vector perpdendicular to v
export const getPerpendicularVector = v => ({
  x: -v.y,
  y: v.x
});

// Return the angle between l1 and l2 in radians
export const getAngleBetweenLines = (l1, l2) => {
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
export const getStandardPointInRotatedAxis = (point, angle) => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.y * Math.cos(angle) + point.x * Math.sin(angle)
});

// Given a point in the axis rotated by angle radians, return
// the corresponding point in the standard axis
export const getRotatedPointInStandardAxis = (point, angle) => ({
  x: point.x * Math.cos(angle) + point.y * Math.sin(angle),
  y: point.y * Math.cos(angle) - point.x * Math.sin(angle)
});

// Return the parabolic function defined by vertex and point
export const getParabola = (point, vertex) => {
  const a = (point.y - vertex.y) / Math.pow(point.x - vertex.x, 2);
  return x => a * Math.pow(x - vertex.x, 2) + vertex.y;
};

// Return an array of points between pointsStart and pointsEnd 
// on the parabola defined by curveStart, curveEnd, and curveVertex
// where curveStart and curveEnd define a new axis of rotation
export const getPointsOnCurve = (curveStart, curveEnd, curveVertex, pointsStart, pointsEnd) => {
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