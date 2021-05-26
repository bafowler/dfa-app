import { Shape } from 'react-konva';

const CurvedLine = ({ points, control }) => (
  <Shape
    points={points}
    sceneFunc={(context, shape) => {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      context.quadraticCurveTo(
        control.x,
        control.y,
        points[1].x,
        points[1].y,
      );
      context.fillStrokeShape(shape);
    }}
    stroke="black"
    strokeWidth={2}
  />
);

  export default CurvedLine;