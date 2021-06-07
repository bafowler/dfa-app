import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import { Node } from './Node';
import DrawingArrow from './DrawingArrow';
import NodeArrow from './NodeArrow';
import NodeLoop from './NodeLoop';
import NodeMenu from './NodeMenu';
import ErrorMessage from './ErrorMessage';
import { reducer } from './reducer';
import { isArrowBetweenNodes } from './utils';
import { STAGE_HEIGHT, STAGE_WIDTH, ERROR_POSITION } from './constants';

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
    drawing && dispatch({ type: 'continueArrow', position: e.target.getStage().getPointerPosition() });
  const handleMouseUp = e =>
    drawing && dispatch({ type: 'endArrow', position: e.target.getStage().getPointerPosition() });
  const removeArrow = (id, errorMsg) => dispatch({ type: 'removeArrow', id, errorMsg });
  const moveNode = (id, position) => dispatch({ type: 'moveNode', id, position });
  const createNode = (position, nodeType) => dispatch({ type: 'createNode', position, nodeType });
  const addError = errorMsg => dispatch({ type: 'addError', errorMsg });
  const removeError = () => dispatch({ type: 'removeError' });

  const getNodeArrow = ({ id, startNode, endNode, relativeAnchor}) => {
    if (startNode === endNode) {
      return (
        <NodeLoop 
          key={`arrow-${id}`}
          node={startNode}
          relativeAnchor={relativeAnchor}
          removeArrow={errorMsg => removeArrow(id, errorMsg)}
          addError={addError}
        />
      )
    } else {
      return (
        <NodeArrow 
          key={`arrow-${id}`}
          startNode={startNode} 
          endNode={endNode} 
          removeArrow={errorMsg => removeArrow(id, errorMsg)}
          addError={addError}
          curved={isArrowBetweenNodes(drawing ? [...arrows, drawing] : arrows, endNode.id, startNode.id)}
        />
      )
    }
  }

  const getDrawingArrow = drawingArrow => {
    if (!drawingArrow) {
      return null;
    }
  
    const { startNode, endNode } = drawingArrow;
    if (startNode && endNode) {
      if (startNode === endNode) {
        return (
          <NodeLoop
            incomplete
            node={startNode}
            relativeAnchor={drawingArrow.relativeAnchor}
          />
        )
      } else {
        return (
          <NodeArrow 
            incomplete
            startNode={startNode} 
            endNode={endNode} 
            curved={isArrowBetweenNodes(arrows, endNode.id, startNode.id)}
          />
        )
      }
    }
  
    return <DrawingArrow start={drawingArrow.initialPosition} end={drawingArrow.currentPosition} />;
  };

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
          {arrows.map(a => getNodeArrow(a))}
          {getDrawingArrow(drawing, arrows)}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
