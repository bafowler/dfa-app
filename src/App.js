import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import { Node, NODE_OUTER_RADIUS } from './Node';
import NodeArrow from './NodeArrow';
import NodeMenu from './NodeMenu';
import ErrorMessage from './ErrorMessage';
import { reducer } from './reducer';
import { getClosestPointOnCircle, isArrowBetweenNodes } from './utils';

const STAGE_HEIGHT = 600;
const STAGE_WIDTH = 1000;
const ERROR_POSITION = {
  x: STAGE_WIDTH / 2,
  y: 40,
}

const initialState = {
  arrows: [],
  currentArrowId: -1,
  nodes: [],
  currentNodeId: -1,
};

function App() {
  const [{ nodes, arrows, drawing, currentNodeId, errorMsg }, dispatch] = useReducer(reducer, initialState);

  const handleMouseDown = e => 
    dispatch({ type: 'beginArrow', position: e.target.getStage().getPointerPosition() });
  const handleMouseMove = e =>
    dispatch({ type: 'continueArrow', position: e.target.getStage().getPointerPosition() });
  const handleMouseUp = e =>
    dispatch({ type: 'endArrow', position: e.target.getStage().getPointerPosition() });

  const removeArrow = (id, errorMsg) => dispatch({ type: 'removeArrow', id, errorMsg });
  const moveNode = (id, position) => dispatch({ type: 'moveNode', id, position });
  const createNode = (position, nodeType) => dispatch({ type: 'createNode', position, nodeType });
  const addError = errorMsg => dispatch({ type: 'addError', errorMsg });
  const removeError = () => dispatch({ type: 'removeError' });

  return (
    <div className="App">
      <Stage 
        className="stage" 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={STAGE_WIDTH} 
        height={STAGE_HEIGHT}
      >
        <Layer>
          <NodeMenu createNode={createNode} />
          {errorMsg && <ErrorMessage position={ERROR_POSITION} message={errorMsg} removeError={removeError} />}
          {nodes.map(({ id, position, nodeType }) => 
            <Node 
              key={`state-${id}`}
              focusOnCreation={id === currentNodeId}
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
            return (
              <NodeArrow 
                key={`arrow-${id}`}
                initialPosition={initialPosition} 
                currentPosition={currentPosition} 
                removeArrow={errorMsg => removeArrow(id, errorMsg)}
                addError={addError}
                curved={isArrowBetweenNodes(arrows, endNodeId, startNodeId)}
              />
            );
          })}
          {drawing && 
            <NodeArrow initialPosition={drawing.initialPosition} currentPosition={drawing.currentPosition} incomplete />}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
