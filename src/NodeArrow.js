import { useLayoutEffect, useRef } from 'react';
import { Arrow, Line, Text } from 'react-konva';

export default function NodeArrow({ initialPosition, currentPosition, incomplete=false }) {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    // Center text in the middle of the arrow
    if (textRef.current && !incomplete) {
      console.log('setting height and width');
      const text = textRef.current;
      text.offsetX(text.width() / 2);
      text.offsetY(text.height() / 2);
    }
  }, [incomplete]);

  const midpoint = { 
    x: (currentPosition.x + initialPosition.x) / 2, 
    y: (currentPosition.y + initialPosition.y) / 2
  };

  const length = Math.hypot(currentPosition.x - initialPosition.x, currentPosition.y - initialPosition.y);
  
  const unitVector = {
    x: (currentPosition.x - initialPosition.x) / length,
    y: (currentPosition.y - initialPosition.y) / length
  };

  const space = 16;
  
  return incomplete ? (
    <Arrow 
      points={[ initialPosition.x, initialPosition.y, currentPosition.x, currentPosition.y ]} 
      fill='black' 
      stroke='black' 
    />
  ) : (
    <> 
    <Line 
      points={[ initialPosition.x, initialPosition.y, midpoint.x - (unitVector.x * space) , midpoint.y - (unitVector.y * space)]} 
      fill='black' 
      stroke='black' 
    />
    <Text
      ref={textRef}
      x={midpoint.x}
      y={midpoint.y}
      fontFamily='Gothic A1'
      fontSize={14}
      fill='black'
      text='0, 1'
    />
    <Arrow 
      points={[ midpoint.x + (unitVector.x * space), midpoint.y + (unitVector.y * space), currentPosition.x, currentPosition.y ]} 
      fill='black' 
      stroke='black' 
    />
    </>
  );
};