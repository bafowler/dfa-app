import './App.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';

const MAX_TEXT_SPACE = 12;

export default function NodeArrowText({ position }) {
  const textRef = useRef(null);
  const inputRef = useRef(null);
  const [ editing, setEditing ] = useState(false);
  const [ values, setValues ] = useState([0, 1]);

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
      const textNode = textRef.current;
      const input = inputRef.current;

      input.value = textNode.text();

      const inputPosition = {
        x: position.x - MAX_TEXT_SPACE,
        y: position.y - MAX_TEXT_SPACE,
      };
      input.style.top = inputPosition.y + 'px';
      input.style.left = inputPosition.x + 'px';
      input.style.width = (MAX_TEXT_SPACE * 2) + 'px';
      input.style.height = (MAX_TEXT_SPACE * 2) + 'px';

      // Adjust position on Firefox
      let transform = '';
      let px = 0;
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';
      input.style.transform = transform;

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
            onBlur={e => {
              setEditing(false);
            }}
            onChange={() => false}
            onKeyDown={handleKeyDown}
          />
        </Html>
      )}
    </>
  );
}