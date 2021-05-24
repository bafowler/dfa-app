import { useEffect } from 'react';
import { Text } from 'react-konva';

const ERROR_OFFSET = 15;

export default function ErrorMessage({ duration, message, position, removeError }) {
  useEffect(() => {
    setTimeout(() => {
      removeError();
    }, duration);
  }, [ duration, message, removeError ])

  return (
    <Text
      x={position.x + ERROR_OFFSET}
      y={position.y + ERROR_OFFSET}
      fontFamily='Gothic A1'
      fontSize={14}
      fill='red'
      text={message}
    />
  );
}