import { useCallback, useRef } from 'react';

export default function useCenterText(condition=true) {
  const textRef = useRef(null)
  const setTextRef = useCallback(textNode => {
    if (condition && textNode) {
      textNode.offsetX(textNode.width() / 2);
      textNode.offsetY(textNode.height() / 2);
    }
    textRef.current = textNode
  }, [ condition ])
  
  return [textRef, setTextRef]
}