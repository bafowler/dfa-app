import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import Node from './Node';
import NodeArrow from './NodeArrow';

function reducer(state, {type, position, id }) {
  switch(type) {
    case 'beginArrow':
      const arrowId = state.currentArrowId + 1;
      const arrow = {
        id: arrowId,
        initialPosition: position,
        currentPosition: position,
      };

      return { ...state, currentArrowId: state.currentArrowId + 1, drawing: arrow };
    case 'continueArrow':
      const currentArrow = state.drawing;
      if (currentArrow) {
        currentArrow.currentPosition = position;
      }

      return { ...state, drawing: currentArrow };
    case 'endArrow':
      if (state.drawing) {
        return { ...state, arrows: [...state.arrows, state.drawing], drawing: null };
      }
      return state;
    case 'moveNode':
      const node = state.nodes.find(n => n.id === id);
      node.position = position;

      return { ...state, nodes: [ ...state.nodes.filter(n => n !== node), node ] };
    default:
      throw new Error();
  }
}

const initialState = {
  arrows: [],
  currentArrowId: -1,
  drawing: null,
  nodes: [
    { position: {x: 50, y: 50}, id: 0 },
    { position: {x: 200, y: 50}, id: 1 },
  ],
  currentNodeId: 1,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleMouseDown = e => {
    if (e.target === e.target.getStage()) {
      dispatch({ type: 'beginArrow', position: e.target.getStage().getPointerPosition() });
    }
  };

  const handleMouseMove = e => {
    dispatch({ type: 'continueArrow', position: e.target.getStage().getPointerPosition() });
  };

  const handleMouseUp = e => {
    dispatch({ type: 'endArrow', position: e.target.getStage().getPointerPosition() });
  }

  const moveNode = (id, position) => dispatch({ type: 'moveNode', id, position });

  const { nodes, arrows, drawing } = state;

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
          {nodes.map(({ id, position }) => 
            <Node key={`state-${id}`} position={position} number={id} setPosition={position => moveNode(id, position)} />)}
          {arrows.map(({ id, initialPosition, currentPosition }) => 
            <NodeArrow key={`arrow-${id}`} initialPosition={initialPosition} currentPosition={currentPosition} />)}
          {drawing && 
            <NodeArrow key={`arrow-${drawing.id}`} initialPosition={drawing.initialPosition} currentPosition={drawing.currentPosition} />}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
