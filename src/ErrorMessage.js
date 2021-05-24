import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';

const ERROR_OFFSET = 15;

export default function ErrorMessage({ duration, message, position, removeError }) {
  const errorRef = useRef(null);
  const [ fadeIn, setFadeIn ] = useState(true);

  useEffect(() => {
    // Fade error message in and then out
    const durationInSeconds = duration / 1000;

    if (errorRef.current) {
      if (fadeIn) {
        errorRef.current.to({
          opacity: 1,
          duration: durationInSeconds / 2,
        });
        setTimeout(() => setFadeIn(false), duration / 2);
      } else {
        errorRef.current.to({
          opacity: 0,
          duration: durationInSeconds / 2,
        });
        setTimeout(() => removeError(), duration / 2);
      }
    }
  }, [ duration, fadeIn, removeError ]);

  return (
    <Text
      ref={errorRef}
      x={position.x + ERROR_OFFSET}
      y={position.y + ERROR_OFFSET}
      fontFamily='Gothic A1'
      fontSize={14}
      fill='red'
      text={message}
      opacity={0}
    />
  );
}