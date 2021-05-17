import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import State from './State';
import StateArrow from './StateArrow';

function reducer(state, { type, position }) {
  switch(type) {
    case 'beginArrow':
      const id = state.currentId + 1;
      const newArrow = {
        id,
        initial: position,
        current: position,
      };

      return { ...state, currentId: state.currentId + 1, drawing: newArrow };
    case 'continueArrow':
      const currentArrow = state.drawing;
      if (currentArrow) {
        currentArrow.current = position;
      }

      return { ...state, drawing: currentArrow };
    case 'endArrow':
      const arrowToEnd = state.drawing;

      return { ...state, arrows: [...state.arrows, arrowToEnd], drawing: null };
    default:
      throw new Error();
  }
}

const initialState = {
  arrows: [],
  currentId: -1,
  drawing: null,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleMouseDown = e => {
    dispatch({ type: 'beginArrow', position: e.target.getStage().getPointerPosition() });
  };

  const handleMouseMove = e => {
    dispatch({ type: 'continueArrow', position: e.target.getStage().getPointerPosition() });
  };

  const handleMouseUp = e => {
    dispatch({ type: 'endArrow', position: e.target.getStage().getPointerPosition() });
  }

  const { arrows, drawing } = state;
  const arrowsToDraw = drawing ? [...arrows, drawing] : arrows;

  return (
    <div className="App">
      <Stage 
        className="stage" 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={600} 
        height={400}
      >
        <Layer>
          <State number={0} />
          <State number={1} />
          {arrowsToDraw.map(({ id, initial, current }) => <StateArrow key={id} initial={initial} current={current} />)}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
