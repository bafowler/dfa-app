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
  return arrows.find(arrow => arrow.startNodeId === startNodeId && arrow.endNodeId === endNodeId);
}