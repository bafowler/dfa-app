import './App.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';

export default function NodeArrowText({ position, space }) {
  const textRef = useRef(null);
  const inputRef = useRef(null);
  const [ editing, setEditing ] = useState(false);
  const [ text, setText ] = useState('0, 1');

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
        x: position.x - (textNode.width() / 2),
        y: position.y - (textNode.height() / 2),
      };

      input.style.top = inputPosition.y + 'px';
      input.style.left = inputPosition.x + 'px';
      input.style.width = 24 + 'px';
      input.style.height = 24 + 'px';
      input.focus();
    }
  }, [editing, position, space]);

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
        text={text}
        visible={!editing}
      />
      {editing && (
        <Html>
          <input 
            className='arrowText' 
            ref={inputRef}
            onBlur={e => {
              setText(e.target.value);
              setEditing(false);
            }}
            onKeyDown={e => {
              console.log(e.code);
              if (e.code === 'Enter') {
                e.target.blur();
              }
            }}
          />
        </Html>
      )}
    </>
  );
}