import './App.css';
import { useReducer } from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import { Node } from './Node';
import DrawingArrow from './DrawingArrow';
import NodeArrow from './NodeArrow';
import NodeLoop from './NodeLoop';
import NodeMenu from './NodeMenu';
import ErrorMessage from './ErrorMessage';
import { reducer } from './reducer';
import { isArrowBetweenNodes } from './utils';
import { STAGE_HEIGHT, STAGE_WIDTH, ERROR_POSITION } from './constants';
import { AppState, NodeType, ArrowType, Position, NodeVariant } from './types';

const initialState: AppState = {
  arrows: [],
  currentArrowId: -1,
  nodes: [],
  currentNodeId: -1,
};

function App() {
  const [{ nodes, arrows, drawing, currentNodeId, errorMsg }, dispatch] = useReducer(reducer, initialState);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => 
    dispatch({ type: 'beginArrow', position: e.target?.getStage()?.getPointerPosition() ?? undefined });
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => 
    drawing && dispatch({ type: 'continueArrow', position: e.target?.getStage()?.getPointerPosition() ?? undefined });
  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) =>
    drawing && dispatch({ type: 'endArrow', position: e.target?.getStage()?.getPointerPosition() ?? undefined });
  const removeArrow = (id: number, errorMsg: string) => dispatch({ type: 'removeArrow', id, errorMsg });
  const moveNode = (id: number, position: Position) => dispatch({ type: 'moveNode', id, position });
  const createNode = (nodeType: NodeVariant, position?: Position) => dispatch({ type: 'createNode', position, nodeType });
  const addError = (errorMsg: string) => dispatch({ type: 'addError', errorMsg });
  const removeError = () => dispatch({ type: 'removeError' });

  const getNodeArrow = (arrow: ArrowType) => {
    if (arrow.startNode) {
      if (arrow.kind === 'loop') {
        return (
          <NodeLoop 
            key={`arrow-${arrow.id}`}
            node={arrow.startNode}
            relativeAnchor={arrow.relativeAnchor}
            removeArrow={(errorMsg: string) => removeArrow(arrow.id, errorMsg)}
            addError={addError}
          />
        )
      } else if (arrow.kind === 'node') {
        return (
          <NodeArrow 
            key={`arrow-${arrow.id}`}
            startNode={arrow.startNode} 
            endNode={arrow.endNode} 
            removeArrow={(errorMsg: string) => removeArrow(arrow.id, errorMsg)}
            addError={addError}
            curved={isArrowBetweenNodes(drawing ? [...arrows, drawing] : arrows, arrow.endNode.id, arrow.startNode.id)}
          />
        )
      }
    }
  }

  const getDrawingArrow = (arrow?: ArrowType | null) => {
    if (!arrow) {
      return null;
    }
  
    if (arrow.startNode) {
      if (arrow.kind === 'loop') {
        return (
          <NodeLoop
            incomplete
            node={arrow.startNode}
            relativeAnchor={arrow.relativeAnchor}
          />
        )
      } else if (arrow.kind === 'node') {
        return (
          <NodeArrow 
            incomplete
            startNode={arrow.startNode} 
            endNode={arrow.endNode} 
            curved={isArrowBetweenNodes(arrows, arrow.endNode.id, arrow.startNode.id)}
          />
        )
      }
    }
  
    return <DrawingArrow start={arrow.initialPosition} end={arrow.currentPosition} />;
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
          {nodes.map(({ id, position, nodeType }: NodeType) => 
            <Node
              key={`state-${id}`}
              focusOnCreation={id === currentNodeId}
              position={position} 
              id={id} 
              type={nodeType}
              setPosition={position => moveNode(id, position)} 
            />)
          }
          {arrows.map(a => getNodeArrow(a))}
          {getDrawingArrow(drawing)}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
