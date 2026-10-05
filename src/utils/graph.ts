import type { BuildingData, NodeData, EdgeData } from '../types/building';

export interface GraphNeighbor {
  neighborId: string;
  edgeId: string;
  cost: number;
}

export type AdjacencyList = Map<string, GraphNeighbor[]>;

/**
 * Builds an undirected adjacency list from the raw building nodes and edges.
 * Edges are treated as bidirectional connections (A <-> B).
 */
export function buildAdjacencyList(nodes: NodeData[], edges: EdgeData[]): AdjacencyList {
  const adj: AdjacencyList = new Map();

  for (const node of nodes) {
    adj.set(node.id, []);
  }

  for (const edge of edges) {
    const listFrom = adj.get(edge.from);
    const listTo = adj.get(edge.to);

    if (listFrom && listTo) {
      listFrom.push({
        neighborId: edge.to,
        edgeId: edge.id,
        cost: edge.cost,
      });
      listTo.push({
        neighborId: edge.from,
        edgeId: edge.id,
        cost: edge.cost,
      });
    }
  }

  return adj;
}

/**
 * Returns a list of start candidate nodes: only unblocked rooms and junctions.
 * Exits can never be starting locations.
 */
export function getAvailableStarts(
  building: BuildingData,
  blockedNodes: Set<string>
): NodeData[] {
  return building.nodes.filter(
    (n) => (n.type === 'room' || n.type === 'junction') && !blockedNodes.has(n.id)
  );
}
