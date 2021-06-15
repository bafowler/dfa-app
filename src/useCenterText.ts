import Konva from 'konva';
import React, { useCallback, useRef } from 'react';

export default function useCenterText(condition=true) {
  const textRef = useRef<Konva.Text>(null)
  const setTextRef = useCallback(textNode => {
    if (condition && textNode) {
      textNode.offsetX(textNode.width() / 2);
      textNode.offsetY(textNode.height() / 2);
    }
    (textRef as React.MutableRefObject<Konva.Text>).current = textNode
  }, [ condition ])
  
  return [ textRef, setTextRef ] as const;
}