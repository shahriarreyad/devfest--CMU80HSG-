export type NodeType = 'room' | 'junction' | 'exit';

export interface NodeData {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  cost: number;
}

export interface InitialState {
  blocked_nodes: string[];
  blocked_edges: string[];
  closed_exits: string[];
}

export interface BuildingData {
  building: string;
  nodes: NodeData[];
  edges: EdgeData[];
  initial_state: InitialState;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SimulationState {
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
  closedExits: Set<string>;
  selectedStartId: string | null;
}

export type RouteStatus =
  | 'IDLE'
  | 'AVAILABLE'
  | 'NO_ROUTE'
  | 'START_BLOCKED'
  | 'INVALID_START';

export interface RouteResult {
  status: RouteStatus;
  destinationExitId: string | null;
  nodeSequence: string[];
  edgeSequence: string[];
  totalCost: number;
  corridorCount: number;
}
