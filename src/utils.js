
// Return true iff dest is within the circle defined by center and radius
export const closeTo = (center, dest, radius) => (Math.pow(dest.x - center.x, 2) + Math.pow(dest.y - center.y, 2)) < Math.pow(radius, 2);

// Return the point closest to dest on the circle defined by center and radius 
export const getClosestPointOnCircle = (center, dest, radius) => {
  const distance = Math.hypot(center.x - dest.x, center.y - dest.y);

  return { x: center.x + (radius*(dest.x - center.x) / distance), 
           y: center.y + (radius*(dest.y - center.y) / distance) };
};