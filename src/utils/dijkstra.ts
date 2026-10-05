import type { BuildingData, RouteResult } from '../types/building';
import type { AdjacencyList } from './graph';
import { compareNodeSequences, comparePaths } from './tieBreaker';
import type { CandidateRoute } from './tieBreaker';

interface SearchState {
  nodeId: string;
  cost: number;
  nodeSequence: string[];
  edgeSequence: string[];
}

/**
 * Calculates the optimal evacuation route according to the Smart Escape specification.
 *
 * Exact rules enforced:
 * 1. Blocked nodes cannot be entered or crossed (all incident edges are unusable).
 * 2. Blocked edges cannot be traversed.
 * 3. Closed exits cannot be destinations and cannot be traversed as intermediate nodes.
 * 4. Ties between multiple paths or exits are resolved using 3 deterministic priorities:
 *    - Priority 1: Lowest total cost
 *    - Priority 2: Smallest lexicographical Exit ID
 *    - Priority 3: Smallest lexicographical node sequence to the same exit
 */
export function calculateShortestRoute(
  building: BuildingData,
  adj: AdjacencyList,
  startId: string | null,
  blockedNodes: Set<string>,
  blockedEdges: Set<string>,
  closedExits: Set<string>
): RouteResult {
  // If no start node is selected
  if (!startId) {
    return {
      status: 'IDLE',
      destinationExitId: null,
      nodeSequence: [],
      edgeSequence: [],
      totalCost: 0,
      corridorCount: 0,
    };
  }

  const startNode = building.nodes.find((n) => n.id === startId);
  if (!startNode || startNode.type === 'exit') {
    return {
      status: 'INVALID_START',
      destinationExitId: null,
      nodeSequence: [],
      edgeSequence: [],
      totalCost: 0,
      corridorCount: 0,
    };
  }

  // If start node is currently blocked
  if (blockedNodes.has(startId)) {
    return {
      status: 'START_BLOCKED',
      destinationExitId: null,
      nodeSequence: [startId],
      edgeSequence: [],
      totalCost: 0,
      corridorCount: 0,
    };
  }

  // Identify all valid OPEN exits
  const openExits = new Set<string>();
  for (const node of building.nodes) {
    if (node.type === 'exit' && !closedExits.has(node.id)) {
      openExits.add(node.id);
    }
  }

  if (openExits.size === 0) {
    return {
      status: 'NO_ROUTE',
      destinationExitId: null,
      nodeSequence: [],
      edgeSequence: [],
      totalCost: 0,
      corridorCount: 0,
    };
  }

  // Best path recorded for each node
  const bestCost = new Map<string, number>();
  const bestPath = new Map<string, string[]>();
  const bestEdges = new Map<string, string[]>();

  // Priority queue states: sorted by cost ASC, then nodeSequence lexicographically ASC
  const queue: SearchState[] = [];

  function enqueue(state: SearchState) {
    queue.push(state);
    // Deterministic sort: cost ASC, then lexicographical sequence ASC
    queue.sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return compareNodeSequences(a.nodeSequence, b.nodeSequence);
    });
  }

  // Initialize start node
  bestCost.set(startId, 0);
  bestPath.set(startId, [startId]);
  bestEdges.set(startId, []);

  enqueue({
    nodeId: startId,
    cost: 0,
    nodeSequence: [startId],
    edgeSequence: [],
  });

  const candidateExitRoutes: CandidateRoute[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { nodeId, cost, nodeSequence, edgeSequence } = current;

    // If we've already found a strictly better path or a lexicographically earlier path with same cost
    const recordedCost = bestCost.get(nodeId);
    if (recordedCost !== undefined && recordedCost < cost) {
      continue;
    }
    const recordedPath = bestPath.get(nodeId);
    if (
      recordedCost === cost &&
      recordedPath &&
      compareNodeSequences(recordedPath, nodeSequence) < 0
    ) {
      continue;
    }

    // If an open exit is reached, evacuees have reached an exit door.
    // Open exits are destinations and do not expand further into the building.
    if (openExits.has(nodeId)) {
      candidateExitRoutes.push({
        destinationExitId: nodeId,
        nodeSequence,
        edgeSequence,
        totalCost: cost,
      });
      continue;
    }

    // Expand neighbors through usable corridors
    const neighbors = adj.get(nodeId) || [];
    for (const { neighborId, edgeId, cost: edgeCost } of neighbors) {
      // 1. Exclude blocked edges
      if (blockedEdges.has(edgeId)) continue;

      // 2. Exclude blocked nodes (rooms or junctions)
      if (blockedNodes.has(neighborId)) continue;

      // 3. Exclude closed exits
      if (closedExits.has(neighborId)) continue;

      const newCost = cost + edgeCost;
      const nextSequence = [...nodeSequence, neighborId];
      const nextEdges = [...edgeSequence, edgeId];

      const existingCost = bestCost.get(neighborId);
      const existingPath = bestPath.get(neighborId);

      let isBetter = false;

      if (existingCost === undefined || newCost < existingCost) {
        isBetter = true;
      } else if (newCost === existingCost && existingPath) {
        // Priority 3: Tie-break at equal cost using lexicographical sequence
        if (compareNodeSequences(nextSequence, existingPath) < 0) {
          isBetter = true;
        }
      }

      if (isBetter) {
        bestCost.set(neighborId, newCost);
        bestPath.set(neighborId, nextSequence);
        bestEdges.set(neighborId, nextEdges);

        enqueue({
          nodeId: neighborId,
          cost: newCost,
          nodeSequence: nextSequence,
          edgeSequence: nextEdges,
        });
      }
    }
  }

  // If no open exits are reachable
  if (candidateExitRoutes.length === 0) {
    return {
      status: 'NO_ROUTE',
      destinationExitId: null,
      nodeSequence: [],
      edgeSequence: [],
      totalCost: 0,
      corridorCount: 0,
    };
  }

  // Sort candidate exit routes by strict priorities:
  // Priority 1: lowest total cost
  // Priority 2: lexicographically smallest Exit ID
  // Priority 3: lexicographically smallest node sequence
  candidateExitRoutes.sort(comparePaths);

  const best = candidateExitRoutes[0];

  return {
    status: 'AVAILABLE',
    destinationExitId: best.destinationExitId,
    nodeSequence: best.nodeSequence,
    edgeSequence: best.edgeSequence,
    totalCost: best.totalCost,
    corridorCount: best.edgeSequence.length,
  };
}
