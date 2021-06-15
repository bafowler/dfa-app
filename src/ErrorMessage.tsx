import { useEffect, useState } from 'react';
import { Text } from 'react-konva';
import useCenterText from './useCenterText';
import { Position} from './types';

const ERROR_DURATION_MS = 2000;

interface ErrorMessageProps {
  message: string;
  position: Position;
  removeError: () => void;
}

export default function ErrorMessage({ message, position, removeError }: ErrorMessageProps) {
  const [ errorRef, setErrorRef ] = useCenterText();
  const [ fadeIn, setFadeIn ] = useState(true);

  useEffect(() => {
    // Fade error message in and then out
    const durationInSeconds = ERROR_DURATION_MS / 1000;

    if (errorRef && errorRef.current) {
      if (fadeIn) {
        errorRef.current.to({
          opacity: 1,
          duration: durationInSeconds / 2,
          onFinish: () => setFadeIn(false)
        });
      } else {
        errorRef.current.to({
          opacity: 0,
          duration: durationInSeconds / 2,
          onFinish: () => removeError()
        });
      }
    }
  }, [ fadeIn, removeError, errorRef ]);

  return (
    <Text
      ref={setErrorRef}
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