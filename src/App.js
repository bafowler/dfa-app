import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import Node from './Node';
import NodeArrow from './NodeArrow';
import { closeTo, getClosestPointOnCircle } from './utils';

const NODE_RADIUS = 25;
const NODE_OUTER_RADIUS = NODE_RADIUS + 10;

function reducer(state, {type, position, id }) {
  switch(type) {
    case 'beginArrow':
      const arrow = {
        id: state.currentArrowId + 1,
        initialPosition: position,
        currentPosition: position,
      };

      return { ...state, drawing: arrow };
    case 'continueArrow':
      if (state.drawing) {
        const currentArrow = state.drawing;
        currentArrow.currentPosition = position;
        return { ...state, drawing: currentArrow };
      }

      return state;
    case 'endArrow':
      if (state.drawing) {
        const currentArrow = state.drawing;
        const startNode = state.nodes.find(n => closeTo(n.position, currentArrow.initialPosition, NODE_OUTER_RADIUS));
        const endNode = state.nodes.find(n => closeTo(n.position, currentArrow.currentPosition, NODE_OUTER_RADIUS));

        if (startNode && endNode) {
          const newArrow = { id: currentArrow.id, startNodeId: startNode.id, endNodeId: endNode.id };
          return { ...state, currentArrowId: newArrow.id, arrows: [...state.arrows, newArrow], drawing: null };
        }

        return { ...state, drawing: null };
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
  const [{ nodes, arrows, drawing }, dispatch] = useReducer(reducer, initialState);

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
            <Node key={`state-${id}`} position={position} radius={NODE_RADIUS} number={id} setPosition={position => moveNode(id, position)} />)}
          {arrows.map(({ id, startNodeId, endNodeId }) => {
            const startNodeCenter = nodes.find(n => n.id === startNodeId).position;
            const endNodeCenter = nodes.find(n => n.id === endNodeId).position;
            const initialPosition = getClosestPointOnCircle(startNodeCenter, endNodeCenter, NODE_OUTER_RADIUS);
            const currentPosition = getClosestPointOnCircle(endNodeCenter, startNodeCenter, NODE_OUTER_RADIUS);
            return <NodeArrow key={`arrow-${id}`} initialPosition={initialPosition} currentPosition={currentPosition} />;
          })}
          {drawing && 
            <NodeArrow key={`drawing-${drawing.id}`} initialPosition={drawing.initialPosition} currentPosition={drawing.currentPosition} />}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
