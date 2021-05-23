import './App.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';

const MAX_TEXT_SPACE = 12;

export default function NodeArrowText({ position }) {
  const textRef = useRef(null);
  const inputRef = useRef(null);
  const [ editing, setEditing ] = useState(true);
  const [ values, setValues ] = useState([]);

  useLayoutEffect(() => {
      // Center text in the middle of the arrow
      if (!editing && textRef.current) {
        const textNode = textRef.current;
        textNode.offsetX(textNode.width() / 2);
        textNode.offsetY(textNode.height() / 2);
      }
    }, [editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      const input = inputRef.current;

      const inputPosition = {
        x: position.x - MAX_TEXT_SPACE,
        y: position.y - MAX_TEXT_SPACE,
      };

      input.style.top = inputPosition.y + 'px';
      input.style.left = inputPosition.x + 'px';
      input.style.width = (MAX_TEXT_SPACE * 2) + 'px';
      input.style.height = (MAX_TEXT_SPACE * 2) + 'px';

      input.focus();
    }
  }, [editing, position]);

  function handleKeyDown(e) {
    if (e.code === 'Enter' || e.code === 'Escape') {
      e.target.blur();
    }
    if (e.code === 'Backspace') {
      const newValues = [...values];
      newValues.pop();
      setValues(newValues);
    }
    if (e.code === 'Digit0' && !values.includes(0)) {
      setValues([ 0, ...values ]);
    }
    if (e.code === 'Digit1' && !values.includes(1)) {
      setValues([ ...values, 1 ]);
    }
    return false;
  }

  return (
    <>
      <Text
        onMouseDown={e => {
          setEditing(true)
          e.cancelBubble = true;
        }}
        ref={textRef}
        x={position.x}
        y={position.y}
        fontFamily='Gothic A1'
        fontSize={14}
        fill='black'
        text={values.join()}
        visible={!editing}
      />
      {editing && (
        <Html>
          <input 
            className='arrowText' 
            ref={inputRef}
            value={values.join()}
            onBlur={() => setEditing(false)}
            onChange={() => false}
            onKeyDown={handleKeyDown}
          />
        </Html>
      )}
    </>
  );
}