import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';

const ERROR_DURATION_MS = 2000;

export default function ErrorMessage({ message, position, removeError }) {
  const errorRef = useRef(null);
  const [ fadeIn, setFadeIn ] = useState(true);
  
  useLayoutEffect(() => {
    // Center text in the middle of the arrow
    if (errorRef.current) {
      const errorNode = errorRef.current;
      errorNode.offsetX(errorNode.width() / 2);
      errorNode.offsetY(errorNode.height() / 2);
    }
  }, []);

  useEffect(() => {
    // Fade error message in and then out
    const durationInSeconds = ERROR_DURATION_MS / 1000;

    if (errorRef.current) {
      if (fadeIn) {
        errorRef.current.to({
          opacity: 1,
          duration: durationInSeconds / 2,
        });
        setTimeout(() => setFadeIn(false), ERROR_DURATION_MS / 2);
      } else {
        errorRef.current.to({
          opacity: 0,
          duration: durationInSeconds / 2,
        });
        setTimeout(() => removeError(), ERROR_DURATION_MS / 2);
      }
    }
  }, [ fadeIn, removeError ]);

  return (
    <Text
      ref={errorRef}
      x={position.x}
      y={position.y}
      fontFamily='Gothic A1'
      fontSize={14}
      fill='red'
      text={message}
      opacity={0}
    />
  );
}