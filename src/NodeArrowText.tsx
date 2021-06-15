import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
// @ts-ignore
import { Html } from 'react-konva-utils';
import useCenterText from './useCenterText';
import { ARROW_TEXT_SPACE as MAX_TEXT_SPACE } from './constants';
import { Position } from './types';

interface NodeArrowTextProps {
  position: Position;
  removeArrow: (errorMsg: string) => void;
  addError: (errorMsg: string) => void;
}

export default function NodeArrowText({ position, removeArrow, addError }: NodeArrowTextProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ editing, setEditing ] = useState(true);
  const [ values, setValues ] = useState<number[]>([]);
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === 'Enter' || e.code === 'Escape') {
      (e.target as HTMLInputElement).blur();
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