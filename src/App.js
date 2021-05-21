import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import { Node, NODE_OUTER_RADIUS } from './Node';
import NodeArrow from './NodeArrow';
import NodeMenu from './NodeMenu';
import { withinCircle, getClosestPointOnCircle } from './utils';

function reducer(state, {type, position, id, nodeType }) {
  switch(type) {
    case 'beginArrow':
      const newArrow = {
        id: state.currentArrowId + 1,
        initialPosition: position,
        currentPosition: position,
      };

      return { ...state, drawing: newArrow };
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
        const startNode = state.nodes.find(n => withinCircle(n.position, currentArrow.initialPosition, NODE_OUTER_RADIUS));
        const endNode = state.nodes.find(n => withinCircle(n.position, currentArrow.currentPosition, NODE_OUTER_RADIUS));

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
    case 'createNode':
      const newNode = { position, id: state.currentNodeId + 1, nodeType };

      return { ...state, nodes: [...state.nodes, newNode ], currentNodeId: newNode.id };
    default:
      throw new Error();
  }
}

const initialState = {
  arrows: [],
  currentArrowId: -1,
  drawing: null,
  nodes: [],
  currentNodeId: -1,
};

function App() {
  const [{ nodes, arrows, drawing, currentNodeId }, dispatch] = useReducer(reducer, initialState);

  const handleMouseDown = e => 
    dispatch({ type: 'beginArrow', position: e.target.getStage().getPointerPosition() });

  const handleMouseMove = e =>
    dispatch({ type: 'continueArrow', position: e.target.getStage().getPointerPosition() });

  const handleMouseUp = e =>
    dispatch({ type: 'endArrow', position: e.target.getStage().getPointerPosition() });

  const moveNode = (id, position) => dispatch({ type: 'moveNode', id, position });

  const createNode = (position, nodeType) => dispatch({ type: 'createNode', position, nodeType });

  return (
    <div className="App">
      <Stage 
        className="stage" 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={1000} 
        height={600}
      >
        <Layer>
          <NodeMenu createNode={createNode} />
          {nodes.map(({ id, position, nodeType }) => 
            <Node 
              focusOnCreation={id === currentNodeId}
              key={`state-${id}`}
              position={position} 
              isDraggable
              number={id} 
              type={nodeType}
              setPosition={position => moveNode(id, position)} 
            />)
          }
          {arrows.map(({ id, startNodeId, endNodeId }) => {
            const startNodeCenter = nodes.find(n => n.id === startNodeId).position;
            const endNodeCenter = nodes.find(n => n.id === endNodeId).position;
            const initialPosition = getClosestPointOnCircle(startNodeCenter, endNodeCenter, NODE_OUTER_RADIUS);
            const currentPosition = getClosestPointOnCircle(endNodeCenter, startNodeCenter, NODE_OUTER_RADIUS);
            return <NodeArrow key={`arrow-${id}`} initialPosition={initialPosition} currentPosition={currentPosition} />;
          })}
          {drawing && 
            <NodeArrow initialPosition={drawing.initialPosition} currentPosition={drawing.currentPosition} />}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
