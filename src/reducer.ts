import { NODE_CLICK_RADIUS, NODE_LOOP_RADIUS_START, NODE_LOOP_RADIUS_END } from './constants';
import { withinCircle, isArrowBetweenNodes } from './utils';
import { NodeArrowType, LoopArrowType, DrawingArrowType, NodeVariant, Position, NodeType, ArrowType, AppState } from './types';

interface Action {
  errorMsg?: string;
  id?: number;
  nodeType?: NodeVariant;
  position?: Position;
  type?: string;
}

const withinLoopRadius = (nodePosition: Position, point: Position) => 
  withinCircle(nodePosition, point, NODE_LOOP_RADIUS_END) && 
  !withinCircle(nodePosition, point, NODE_LOOP_RADIUS_START);

export const reducer = (state: AppState, { errorMsg, id, position, nodeType, type }: Action): AppState => {
    if (errorMsg) {
      state.errorMsg = errorMsg;
    }
  
    switch(type) {
      case 'beginArrow':
        return { ...state, ...handleBeginArrow(state.nodes, state.currentArrowId, position) };
      case 'continueArrow':
        return { ...state, ...handleContinueArrow(state.nodes, state.drawing, position) };
      case 'endArrow':
        return { ...state, ...handleEndArrow(state.arrows, state.drawing) };
      case 'removeArrow':
        return { ...state, ...handleRemoveArrow(state.arrows, id) };
      case 'createNode':
        return { ...state, ...handleCreateNode(state.nodes, state.currentNodeId, nodeType, position) };
      case 'moveNode':
        return { ...state, ...handleMoveNode(state.nodes, id, position) };
      case 'addError': 
        return { ...state, errorMsg };
      case 'removeError': {
        return { ...state, errorMsg: null };
      }
      default:
        throw new Error();
    }
  };

const handleBeginArrow = (nodes: NodeType[], currentArrowId: number, position?: Position) => {
  if (!position) {
    throw new Error('cannot begin a new arrow with no position');
  }

  const newArrow = {
    id: currentArrowId + 1,
    initialPosition: position,
    currentPosition: position,
    startNode: nodes.find(n => withinCircle(n.position, position, NODE_CLICK_RADIUS)),
    kind: 'freeDrawing' as const,
  };

  return { drawing: newArrow };
};

const handleContinueArrow = (nodes: NodeType[], drawing?: ArrowType | null, position?: Position) => {
  if (!drawing) {
    throw new Error('cannot continue an arrow when no arrow is being drawn');
  } else if (!position) {
    throw new Error('cannot continue an arrow with no position');
  }

  const arrow = drawing;
  arrow.currentPosition = position;

  if (arrow.startNode) {
    const endNode = nodes.find(n => withinCircle(n.position, position, NODE_CLICK_RADIUS));
    if (endNode && arrow.startNode !== endNode) {
      (arrow as NodeArrowType).endNode = endNode;
      (arrow as NodeArrowType).kind = 'node';
    } else if (withinLoopRadius(arrow.startNode.position, position)) {
      (arrow as LoopArrowType).relativeAnchor = {
        x: arrow.currentPosition.x - arrow.startNode.position.x,
        y: arrow.currentPosition.y - arrow.startNode.position.y,
      };
      (arrow as LoopArrowType).kind = 'loop';
    } else {
      (arrow as DrawingArrowType).kind = 'freeDrawing';
    }
  }

  return { drawing: arrow };
};

const handleEndArrow = (arrows: ArrowType[], drawing?: ArrowType | null) => {
  if (!drawing) {
    throw new Error('cannot end an arrow when no arrow is being drawn');
  }

  const arrow = drawing;

  if (arrow.kind === 'freeDrawing') {
    return { drawing: null, errorMsg: 'arrow must connect two states' };
  } else if (arrow.kind === 'node' && arrow.startNode && isArrowBetweenNodes(arrows, arrow.startNode.id, arrow.endNode.id)) {
    return { drawing: null, errorMsg: `there is already an arrow connecting state ${arrow.startNode.id} and state ${arrow.endNode.id}` };
  }
  return { currentArrowId: arrow.id, arrows: [...arrows, arrow], drawing: null };
};

const handleRemoveArrow = (arrows: ArrowType[], arrowId?: number) => {
  if (arrowId == null) {
    throw new Error('cannot remove an arrow without an id');
  }
  return { arrows: [ ...arrows.filter(a => a.id !== arrowId) ]};
}

const handleCreateNode = (nodes: NodeType[], currentNodeId: number, nodeType?: NodeVariant, position?: Position) => {
  if (!nodeType) {
    throw new Error('cannot create a node without a node type');
  } else if (!position) {
    throw new Error('cannot create a node without a position');
  }

  const newNode = { position, id: currentNodeId + 1, nodeType };
  return { nodes: [...nodes, newNode ], currentNodeId: newNode.id };
};

const handleMoveNode = (nodes: NodeType[], nodeId?: number, position?: Position) => {
  if (nodeId == null) {
    throw new Error('cannot move a node without an id')
  } else if (!position) {
    throw new Error('cannot move a node without a new position');
  }

  const node = nodes.find(n => n.id === nodeId);
  if (!node) {
    throw new Error(`attempting to move node ${nodeId} which does not exist`);
  }

  node.position = position;
  return { nodes: [ ...nodes.filter(n => n !== node), node ] };
};
