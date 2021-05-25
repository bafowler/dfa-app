import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import useCenterText from './useCenterText';

const MAX_TEXT_SPACE = 12;

export default function NodeArrowText({ position, removeArrow, addError }) {
  const inputRef = useRef(null);
  const [ editing, setEditing ] = useState(true);
  const [ values, setValues ] = useState([]);
  const [ , setTextRef ] = useCenterText(!editing);

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
    } else if (e.code === 'Backspace') {
      const newValues = [...values];
      newValues.pop();
      setValues(newValues);
    } else if (e.code === 'Digit0' && !values.includes(0)) {
      setValues([ 0, ...values ]);
    } else if (e.code === 'Digit1' && !values.includes(1)) {
      setValues([ ...values, 1 ]);
    } else {
      addError('only valid transitions are 0 and 1');
    }
    return false;
  }

  function handleInputBlur() {
    if (values.length === 0) {
      removeArrow('must select a transition');
    } else {
      setEditing(false);
    }
  }

  return (
    <>
      <Text
        onMouseDown={e => {
          setEditing(true)
          e.cancelBubble = true;
        }}
        ref={setTextRef}
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
            onBlur={handleInputBlur}
            onChange={() => false}
            onKeyDown={handleKeyDown}
          />
        </Html>
      )}
    </>
  );
}