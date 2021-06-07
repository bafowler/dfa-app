import { NODE_CLICK_RADIUS, NODE_LOOP_RADIUS_START, NODE_LOOP_RADIUS_END } from './constants';
import { withinCircle, isArrowBetweenNodes } from './utils';

const withinLoopRadius = (nodePosition, point) => 
  withinCircle(nodePosition, point, NODE_LOOP_RADIUS_END) && 
  !withinCircle(nodePosition, point, NODE_LOOP_RADIUS_START);

export const reducer = (state, { type, position, id, nodeType, errorMsg }) => {
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

const handleBeginArrow = (nodes, currentArrowId, position) => {
  const newArrow = {
    id: currentArrowId + 1,
    initialPosition: position,
    currentPosition: position,
    startNode: nodes.find(n => withinCircle(n.position, position, NODE_CLICK_RADIUS)),
  };

  return { drawing: newArrow };
};

const handleContinueArrow = (nodes, drawing, position) => {
  const currentArrow = drawing;
  currentArrow.currentPosition = position;

  if (currentArrow.startNode) {
    const endNode = nodes.find(n => withinCircle(n.position, position, NODE_CLICK_RADIUS));
    if (currentArrow.startNode !== endNode) {
      currentArrow.endNode = endNode;
    } 

    if (withinLoopRadius(currentArrow.startNode.position, position)) {
      currentArrow.endNode = currentArrow.startNode;
      currentArrow.relativeAnchor = {
        x: currentArrow.currentPosition.x - currentArrow.startNode.position.x,
        y: currentArrow.currentPosition.y - currentArrow.startNode.position.y,
      };
    }
  }

  return { drawing: currentArrow };
};

const handleEndArrow = (arrows, drawing) => {
  const currentArrow = drawing;
  const { startNode, endNode } = currentArrow;

  if (startNode === undefined || endNode === undefined) {
    return { drawing: null, errorMsg: 'arrow must connect two states' };
  } 
  if (isArrowBetweenNodes(arrows, startNode.id, endNode.id)) {
    return { drawing: null, errorMsg: `there is already an arrow connecting state ${startNode.id} and state ${endNode.id}` };
  }
  return { currentArrowId: currentArrow.id, arrows: [...arrows, currentArrow], drawing: null };
};

const handleRemoveArrow = (arrows, arrowId) => ({ arrows: [ ...arrows.filter(a => a.id !== arrowId) ]});

const handleCreateNode = (nodes, currentNodeId, nodeType, position) => {
  const newNode = { position, id: currentNodeId + 1, nodeType };
  return { nodes: [...nodes, newNode ], currentNodeId: newNode.id };
};

const handleMoveNode = (nodes, nodeId, position) => {
  const node = nodes.find(n => n.id === nodeId);
  node.position = position;
  return { nodes: [ ...nodes.filter(n => n !== node), node ] };
};
