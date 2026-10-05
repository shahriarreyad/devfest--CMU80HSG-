import { useState, useMemo, useCallback } from 'react';
import type {
  BuildingData,
  InitialState,
  RouteResult,
} from '../types/building';
import { buildAdjacencyList, getAvailableStarts } from '../utils/graph';
import { calculateShortestRoute } from '../utils/dijkstra';

export interface AuditLogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'hazard' | 'route' | 'reset';
}

export function useSimulation(initialBuilding: BuildingData | null = null) {
  const [building, setBuilding] = useState<BuildingData | null>(initialBuilding);
  
  // Stored deep copy of initial_state
  const [originalInitialState, setOriginalInitialState] = useState<InitialState | null>(
    initialBuilding ? JSON.parse(JSON.stringify(initialBuilding.initial_state)) : null
  );

  // Active hazard state
  const [blockedNodes, setBlockedNodes] = useState<Set<string>>(() => {
    return initialBuilding?.initial_state?.blocked_nodes
      ? new Set(initialBuilding.initial_state.blocked_nodes)
      : new Set();
  });

  const [blockedEdges, setBlockedEdges] = useState<Set<string>>(() => {
    return initialBuilding?.initial_state?.blocked_edges
      ? new Set(initialBuilding.initial_state.blocked_edges)
      : new Set();
  });

  const [closedExits, setClosedExits] = useState<Set<string>>(() => {
    return initialBuilding?.initial_state?.closed_exits
      ? new Set(initialBuilding.initial_state.closed_exits)
      : new Set();
  });

  // Selected start location (unblocked room or junction only)
  const [selectedStartId, setSelectedStartId] = useState<string | null>(() => {
    if (!initialBuilding) return null;
    const available = getAvailableStarts(
      initialBuilding,
      new Set(initialBuilding.initial_state.blocked_nodes)
    );
    return available.length > 0 ? available[0].id : null;
  });

  // Micro-interaction notification: "Route updated"
  const [routeUpdatedIndicator, setRouteUpdatedIndicator] = useState(false);

  // Activity audit log
  const [activityLog, setActivityLog] = useState<AuditLogEntry[]>([]);

  const addLog = useCallback((message: string, type: AuditLogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLog((prev) => [
      { id: Math.random().toString(36).substring(2, 9), time, message, type },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const triggerUpdateIndicator = useCallback(() => {
    setRouteUpdatedIndicator(true);
    setTimeout(() => {
      setRouteUpdatedIndicator(false);
    }, 2200);
  }, []);

  // Adjacency list is memoized per building
  const adjacencyList = useMemo(() => {
    if (!building) return new Map();
    return buildAdjacencyList(building.nodes, building.edges);
  }, [building]);

  // Current route calculation
  const routeResult: RouteResult = useMemo(() => {
    if (!building) {
      return {
        status: 'IDLE',
        destinationExitId: null,
        nodeSequence: [],
        edgeSequence: [],
        totalCost: 0,
        corridorCount: 0,
      };
    }

    return calculateShortestRoute(
      building,
      adjacencyList,
      selectedStartId,
      blockedNodes,
      blockedEdges,
      closedExits
    );
  }, [building, adjacencyList, selectedStartId, blockedNodes, blockedEdges, closedExits]);

  // Load a new building
  const loadBuilding = useCallback(
    (newBuilding: BuildingData) => {
      const backup: InitialState = JSON.parse(JSON.stringify(newBuilding.initial_state));
      setBuilding(newBuilding);
      setOriginalInitialState(backup);

      const initialBlocked = new Set(backup.blocked_nodes || []);
      const initialEdges = new Set(backup.blocked_edges || []);
      const initialExits = new Set(backup.closed_exits || []);

      setBlockedNodes(initialBlocked);
      setBlockedEdges(initialEdges);
      setClosedExits(initialExits);

      // Select first available unblocked room/junction
      const starts = getAvailableStarts(newBuilding, initialBlocked);
      const firstStart = starts.length > 0 ? starts[0].id : null;
      setSelectedStartId(firstStart);

      addLog(`Loaded building "${newBuilding.building}" with ${newBuilding.nodes.length} nodes and ${newBuilding.edges.length} corridors`, 'info');
      triggerUpdateIndicator();
    },
    [addLog, triggerUpdateIndicator]
  );

  // Toggle Room/Junction Blocked State
  const toggleNode = useCallback(
    (nodeId: string) => {
      if (!building) return;
      const target = building.nodes.find((n) => n.id === nodeId);
      if (!target) return;

      if (target.type === 'exit') {
        // Exits are handled via closedExits
        toggleExit(nodeId);
        return;
      }

      setBlockedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
          addLog(`Unblocked node ${nodeId} (${target.label})`, 'hazard');
        } else {
          next.add(nodeId);
          addLog(`Blocked node ${nodeId} (${target.label})`, 'hazard');
        }
        return next;
      });

      triggerUpdateIndicator();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [building, addLog, triggerUpdateIndicator]
  );

  // Toggle Corridor Blocked State
  const toggleEdge = useCallback(
    (edgeId: string) => {
      if (!building) return;
      const edge = building.edges.find((e) => e.id === edgeId);
      const desc = edge ? `${edge.from} ↔ ${edge.to}` : edgeId;

      setBlockedEdges((prev) => {
        const next = new Set(prev);
        if (next.has(edgeId)) {
          next.delete(edgeId);
          addLog(`Unblocked corridor ${edgeId} (${desc})`, 'hazard');
        } else {
          next.add(edgeId);
          addLog(`Blocked corridor ${edgeId} (${desc})`, 'hazard');
        }
        return next;
      });

      triggerUpdateIndicator();
    },
    [building, addLog, triggerUpdateIndicator]
  );

  // Toggle Exit Closed/Open State
  const toggleExit = useCallback(
    (exitId: string) => {
      if (!building) return;
      const target = building.nodes.find((n) => n.id === exitId);
      const label = target?.label || exitId;

      setClosedExits((prev) => {
        const next = new Set(prev);
        if (next.has(exitId)) {
          next.delete(exitId);
          addLog(`Reopened exit ${exitId} (${label})`, 'hazard');
        } else {
          next.add(exitId);
          addLog(`Closed exit ${exitId} (${label})`, 'hazard');
        }
        return next;
      });

      triggerUpdateIndicator();
    },
    [building, addLog, triggerUpdateIndicator]
  );

  // Reset to original initial_state from imported JSON
  const resetSimulation = useCallback(() => {
    if (!originalInitialState) return;

    setBlockedNodes(new Set(originalInitialState.blocked_nodes || []));
    setBlockedEdges(new Set(originalInitialState.blocked_edges || []));
    setClosedExits(new Set(originalInitialState.closed_exits || []));

    addLog('Simulation reset to original initial_state', 'reset');
    triggerUpdateIndicator();
  }, [originalInitialState, addLog, triggerUpdateIndicator]);

  const clearLog = useCallback(() => {
    setActivityLog([]);
  }, []);

  return {
    building,
    originalInitialState,
    blockedNodes,
    blockedEdges,
    closedExits,
    selectedStartId,
    setSelectedStartId,
    routeResult,
    routeUpdatedIndicator,
    activityLog,
    loadBuilding,
    toggleNode,
    toggleEdge,
    toggleExit,
    resetSimulation,
    clearLog,
  };
}
