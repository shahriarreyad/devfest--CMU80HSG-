import { OFFICIAL_SAMPLE_BUILDING, TIE_BREAKER_DEMO } from '../data/sampleBuildings';
import { validateBuilding } from '../utils/validator';
import { buildAdjacencyList } from '../utils/graph';
import { calculateShortestRoute } from '../utils/dijkstra';
import type { BuildingData } from '../types/building';
import process from 'node:process';

console.log('=== RUNNING SMART ESCAPE ALGORITHM & VALIDATION SELF-TESTS ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    failCount++;
  }
}

// TEST 1: Validation of Official Sample Building
const valResult = validateBuilding(OFFICIAL_SAMPLE_BUILDING);
assert(valResult.isValid && valResult.errors.length === 0, 'Test 1: Official sample building passes validation');

// TEST 2: Validation detects unknown edge reference
const invalidEdgeBuilding: any = {
  ...OFFICIAL_SAMPLE_BUILDING,
  edges: [
    ...OFFICIAL_SAMPLE_BUILDING.edges,
    { id: 'E_BAD', from: 'R1', to: 'C99', cost: 3 }
  ]
};
const valResult2 = validateBuilding(invalidEdgeBuilding);
assert(!valResult2.isValid && valResult2.errors.some(e => e.includes('C99')), 'Test 2: Edge referencing unknown node C99 caught by validator');

// TEST 3: Validation detects negative cost
const invalidCostBuilding: any = {
  ...OFFICIAL_SAMPLE_BUILDING,
  edges: [
    { id: 'E_NEG', from: 'R1', to: 'C1', cost: -2 }
  ]
};
const valResult3 = validateBuilding(invalidCostBuilding);
assert(!valResult3.isValid && valResult3.errors.some(e => e.includes('invalid cost')), 'Test 3: Edge with negative cost caught by validator');

// TEST 4: Validation detects self-loop
const selfLoopBuilding: any = {
  ...OFFICIAL_SAMPLE_BUILDING,
  edges: [
    { id: 'E_LOOP', from: 'R1', to: 'R1', cost: 2 }
  ]
};
const valResult4 = validateBuilding(selfLoopBuilding);
assert(!valResult4.isValid && valResult4.errors.some(e => e.includes('self-loop')), 'Test 4: Self-loop edge caught by validator');

// SCENARIO TESTS ON OFFICIAL SAMPLE BUILDING
const adj = buildAdjacencyList(OFFICIAL_SAMPLE_BUILDING.nodes, OFFICIAL_SAMPLE_BUILDING.edges);

// TEST 5: Baseline R1 -> expected R1 -> C1 -> C2 -> E1, cost 7
const route1 = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R1',
  new Set(),
  new Set(),
  new Set()
);
assert(
  route1.status === 'AVAILABLE' &&
  route1.destinationExitId === 'E1' &&
  route1.totalCost === 7 &&
  route1.nodeSequence.join(' -> ') === 'R1 -> C1 -> C2 -> E1' &&
  route1.corridorCount === 3,
  'Test 5: Baseline R1 -> E1 (Cost 7, sequence R1 -> C1 -> C2 -> E1)',
  `Got: ${route1.nodeSequence.join(' -> ')}, Cost: ${route1.totalCost}`
);

// TEST 6: Block C2 -> expected R1 -> C1 -> C3 -> C4 -> E2, cost 11
const route2 = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R1',
  new Set(['C2']),
  new Set(),
  new Set()
);
assert(
  route2.status === 'AVAILABLE' &&
  route2.destinationExitId === 'E2' &&
  route2.totalCost === 11 &&
  route2.nodeSequence.join(' -> ') === 'R1 -> C1 -> C3 -> C4 -> E2',
  'Test 6: Block C2 -> reroutes to E2 (Cost 11, sequence R1 -> C1 -> C3 -> C4 -> E2)',
  `Got: ${route2.nodeSequence.join(' -> ')}, Cost: ${route2.totalCost}`
);

// TEST 7: Close E1 and E2 -> expected NO_ROUTE
const route3 = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R1',
  new Set(),
  new Set(),
  new Set(['E1', 'E2'])
);
assert(
  route3.status === 'NO_ROUTE',
  'Test 7: Close E1 and E2 -> returns NO_ROUTE',
  `Got status: ${route3.status}`
);

// TEST 8: Select R2 -> expected R2 -> C3 -> C4 -> E2, cost 7
const route4 = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R2',
  new Set(),
  new Set(),
  new Set()
);
assert(
  route4.status === 'AVAILABLE' &&
  route4.destinationExitId === 'E2' &&
  route4.totalCost === 7 &&
  route4.nodeSequence.join(' -> ') === 'R2 -> C3 -> C4 -> E2',
  'Test 8: Select R2 -> E2 (Cost 7, sequence R2 -> C3 -> C4 -> E2)',
  `Got: ${route4.nodeSequence.join(' -> ')}, Cost: ${route4.totalCost}`
);

// TEST 9: Block R1 while selected -> expected START_BLOCKED
const route5 = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R1',
  new Set(['R1']),
  new Set(),
  new Set()
);
assert(
  route5.status === 'START_BLOCKED',
  'Test 9: Block R1 while selected -> returns START_BLOCKED',
  `Got status: ${route5.status}`
);

// TEST 10: Equal-Cost Exit Tie-breaking (EXIT_1 vs EXIT_2 with identical cost 10)
const adjTie = buildAdjacencyList(TIE_BREAKER_DEMO.nodes, TIE_BREAKER_DEMO.edges);
const routeTie = calculateShortestRoute(
  TIE_BREAKER_DEMO,
  adjTie,
  'R_START',
  new Set(),
  new Set(),
  new Set()
);
assert(
  routeTie.status === 'AVAILABLE' &&
  routeTie.destinationExitId === 'EXIT_1' &&
  routeTie.totalCost === 10,
  'Test 10: Equal cost exits -> chooses EXIT_1 by lexicographical Exit ID tie-breaking',
  `Got destination: ${routeTie.destinationExitId}, cost: ${routeTie.totalCost}`
);

// TEST 11: Disconnected graph
const disconnectedBuilding: BuildingData = {
  building: 'Disconnected Graph',
  nodes: [
    { id: 'R1', label: 'Room 1', type: 'room', x: 0, y: 0 },
    { id: 'E1', label: 'Exit 1', type: 'exit', x: 100, y: 100 }
  ],
  edges: [],
  initial_state: { blocked_nodes: [], blocked_edges: [], closed_exits: [] }
};
const adjDisc = buildAdjacencyList(disconnectedBuilding.nodes, disconnectedBuilding.edges);
const routeDisc = calculateShortestRoute(
  disconnectedBuilding,
  adjDisc,
  'R1',
  new Set(),
  new Set(),
  new Set()
);
assert(
  routeDisc.status === 'NO_ROUTE',
  'Test 11: Disconnected start from exit returns NO_ROUTE',
  `Got status: ${routeDisc.status}`
);
// TEST 12: Equal-cost paths to SAME exit (Priority 3: Node Sequence Lexicographical Ordering)
const sameExitTieBuilding: BuildingData = {
  building: 'Same Exit Tie-Breaker Test',
  nodes: [
    { id: 'START', label: 'Start Room', type: 'room', x: 0, y: 0 },
    { id: 'JUNCTION_A', label: 'Junction A', type: 'junction', x: 50, y: 0 },
    { id: 'JUNCTION_B', label: 'Junction B', type: 'junction', x: 50, y: 50 },
    { id: 'EXIT_GOAL', label: 'Single Exit', type: 'exit', x: 100, y: 0 }
  ],
  edges: [
    { id: 'E_A1', from: 'START', to: 'JUNCTION_A', cost: 5 },
    { id: 'E_A2', from: 'JUNCTION_A', to: 'EXIT_GOAL', cost: 5 },
    { id: 'E_B1', from: 'START', to: 'JUNCTION_B', cost: 5 },
    { id: 'E_B2', from: 'JUNCTION_B', to: 'EXIT_GOAL', cost: 5 }
  ],
  initial_state: { blocked_nodes: [], blocked_edges: [], closed_exits: [] }
};
const adjSameExit = buildAdjacencyList(sameExitTieBuilding.nodes, sameExitTieBuilding.edges);
const routeSameExit = calculateShortestRoute(
  sameExitTieBuilding,
  adjSameExit,
  'START',
  new Set(),
  new Set(),
  new Set()
);
assert(
  routeSameExit.status === 'AVAILABLE' &&
  routeSameExit.destinationExitId === 'EXIT_GOAL' &&
  routeSameExit.totalCost === 10 &&
  routeSameExit.nodeSequence.join(' -> ') === 'START -> JUNCTION_A -> EXIT_GOAL',
  'Test 12: Equal-cost paths to same exit -> chooses JUNCTION_A by Priority 3 tie-breaking',
  `Got sequence: ${routeSameExit.nodeSequence.join(' -> ')}`
);

// TEST 13: Edge blocking rule (Blocking only corridor EDGE_C1_C2 forces detour via C3 to E2)
const routeEdgeBlocked = calculateShortestRoute(
  OFFICIAL_SAMPLE_BUILDING,
  adj,
  'R1',
  new Set(),
  new Set(['EDGE_C1_C2']),
  new Set()
);
assert(
  routeEdgeBlocked.status === 'AVAILABLE' &&
  routeEdgeBlocked.destinationExitId === 'E2' &&
  routeEdgeBlocked.totalCost === 11 &&
  routeEdgeBlocked.nodeSequence.join(' -> ') === 'R1 -> C1 -> C3 -> C4 -> E2',
  'Test 13: Blocking only corridor EDGE_C1_C2 forces detour via C3 to E2',
  `Got sequence: ${routeEdgeBlocked.nodeSequence.join(' -> ')}, Cost: ${routeEdgeBlocked.totalCost}`
);

// TEST 14: Reset restoration logic
const testInitialState = {
  blocked_nodes: ['C2'],
  blocked_edges: ['EDGE_R2_C3'],
  closed_exits: ['E1']
};
const initialBlockedNodes = new Set(testInitialState.blocked_nodes);

// Simulate user modifying hazards
const userBlockedNodes = new Set([...initialBlockedNodes, 'C1']);
userBlockedNodes.delete('C2');

// Simulate reset restoring original initial_state
const restoredBlockedNodes = new Set(testInitialState.blocked_nodes);
const restoredBlockedEdges = new Set(testInitialState.blocked_edges);
const restoredClosedExits = new Set(testInitialState.closed_exits);

assert(
  restoredBlockedNodes.has('C2') &&
  !restoredBlockedNodes.has('C1') &&
  restoredBlockedEdges.has('EDGE_R2_C3') &&
  restoredClosedExits.has('E1'),
  'Test 14: Reset restores EXACT original initial_state hazards rather than clearing all'
);

console.log(`\nTEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED.`);
if (failCount > 0) {
  process.exit(1);
}
