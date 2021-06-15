export type NodeVariant = 'accept' | 'default';

export interface Position {
  x: number;
  y: number;
}

export interface Vector { 
  x: number;
  y: number;
}

export interface NodeType {
  id: number;
  nodeType?: NodeVariant;
  position: Position;
}

export interface BasicArrowType {
  id: number;
  initialPosition: Position;
  currentPosition: Position;
  startNode?: NodeType;
}

export interface LoopArrowType extends BasicArrowType {
  relativeAnchor: Position;
  kind: 'loop';
}

export interface NodeArrowType extends BasicArrowType {
  endNode: NodeType;
  kind: 'node';
}

export interface DrawingArrowType extends BasicArrowType {
  kind: 'freeDrawing';
}

export type ArrowType = LoopArrowType | NodeArrowType | DrawingArrowType;

export interface AppState {
  arrows: ArrowType[];
  currentArrowId: number;
  currentNodeId: number;
  drawing?: ArrowType | null;
  errorMsg?: string | null;
  nodes: NodeType[];
}