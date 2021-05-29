import { NODE_CLICK_RADIUS } from './Node';
import { withinCircle, isArrowBetweenNodes } from './utils';

export const reducer = (state, { type, position, id, nodeType, errorMsg }) => {
    if (errorMsg) {
      state.errorMsg = errorMsg;
    }
  
    switch(type) {
      case 'beginArrow':
        return { ...state, ...handleBeginArrow(state.currentArrowId, position) };
      case 'continueArrow':
        return { ...state, ...handleContinueArrow(state.drawing, position) };
      case 'endArrow':
        return { ...state, ...handleEndArrow(state.nodes, state.arrows, state.drawing) };
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

const handleBeginArrow = (currentArrowId, position) => {
  const newArrow = {
    id: currentArrowId + 1,
    initialPosition: position,
    currentPosition: position,
  };

  return { drawing: newArrow };
};

const handleContinueArrow = (drawing, position) => {
  const currentArrow = drawing;
  currentArrow.currentPosition = position;

  return { drawing: currentArrow };
};

const handleEndArrow = (nodes, arrows, drawing) => {
  const currentArrow = drawing;
  const startNode = nodes.find(n => withinCircle(n.position, currentArrow.initialPosition, NODE_CLICK_RADIUS));
  const endNode = nodes.find(n => withinCircle(n.position, currentArrow.currentPosition, NODE_CLICK_RADIUS));

  if (startNode === undefined || endNode === undefined) {
    return { drawing: null, errorMsg: 'arrow must connect two states' };
  } else if (isArrowBetweenNodes(arrows, startNode.id, endNode.id)) {
    return { drawing: null, errorMsg: `there is already an arrow connecting state ${startNode.id} and state ${endNode.id}` };
  } else {
    const newArrow = { 
      id: currentArrow.id, 
      startNode: startNode, 
      endNode: endNode
    };

    return { currentArrowId: newArrow.id, arrows: [...arrows, newArrow], drawing: null };
  }
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
