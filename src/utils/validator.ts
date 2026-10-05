import type { ValidationResult, NodeType } from '../types/building';

const VALID_NODE_TYPES: Set<NodeType> = new Set(['room', 'junction', 'exit']);

/**
 * Validates a parsed JSON object against the strict Smart Escape building schema.
 * Accumulates all detected issues so users get clear, actionable feedback.
 */
export function validateBuilding(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      isValid: false,
      errors: ['Building data must be a valid JSON object.'],
    };
  }

  const raw = data as Record<string, unknown>;

  // 1. building name
  if (typeof raw.building !== 'string' || raw.building.trim().length === 0) {
    errors.push('Field "building" must be a non-empty string.');
  }

  // 2. nodes array
  if (!Array.isArray(raw.nodes) || raw.nodes.length === 0) {
    errors.push('Field "nodes" must be a non-empty array.');
  }

  // Node validation
  const nodeMap = new Map<string, { type: string }>();
  let roomOrJunctionCount = 0;
  let exitCount = 0;

  if (Array.isArray(raw.nodes)) {
    raw.nodes.forEach((node: unknown, index: number) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) {
        errors.push(`Node at index ${index} must be an object.`);
        return;
      }

      const n = node as Record<string, unknown>;
      const nodeId = typeof n.id === 'string' ? n.id.trim() : '';

      if (!nodeId) {
        errors.push(`Node at index ${index} is missing a non-empty string "id".`);
      } else if (nodeMap.has(nodeId)) {
        errors.push(`Duplicate node ID "${nodeId}" detected.`);
      } else {
        nodeMap.set(nodeId, { type: String(n.type) });
      }

      if (typeof n.label !== 'string' || n.label.trim().length === 0) {
        errors.push(`Node "${nodeId || index}" must have a non-empty string "label".`);
      }

      const nodeType = n.type as NodeType;
      if (!VALID_NODE_TYPES.has(nodeType)) {
        errors.push(
          `Node "${nodeId || index}" has invalid type "${String(n.type)}". Expected "room", "junction", or "exit".`
        );
      } else {
        if (nodeType === 'room' || nodeType === 'junction') {
          roomOrJunctionCount++;
        } else if (nodeType === 'exit') {
          exitCount++;
        }
      }

      if (typeof n.x !== 'number' || !Number.isFinite(n.x)) {
        errors.push(`Node "${nodeId || index}" x-coordinate must be a finite number.`);
      }
      if (typeof n.y !== 'number' || !Number.isFinite(n.y)) {
        errors.push(`Node "${nodeId || index}" y-coordinate must be a finite number.`);
      }
    });

    if (raw.nodes.length > 0) {
      if (roomOrJunctionCount === 0) {
        errors.push('The building must contain at least one "room" or "junction".');
      }
      if (exitCount === 0) {
        errors.push('The building must contain at least one "exit".');
      }
    }
  }

  // 3. edges array
  if (!Array.isArray(raw.edges)) {
    errors.push('Field "edges" must be an array.');
  }

  const edgeMap = new Map<string, { from: string; to: string }>();
  const undirectedPairSet = new Set<string>();

  if (Array.isArray(raw.edges)) {
    raw.edges.forEach((edge: unknown, index: number) => {
      if (!edge || typeof edge !== 'object' || Array.isArray(edge)) {
        errors.push(`Edge at index ${index} must be an object.`);
        return;
      }

      const e = edge as Record<string, unknown>;
      const edgeId = typeof e.id === 'string' ? e.id.trim() : '';

      if (!edgeId) {
        errors.push(`Edge at index ${index} is missing a non-empty string "id".`);
      } else if (edgeMap.has(edgeId)) {
        errors.push(`Duplicate edge ID "${edgeId}" detected.`);
      }

      const from = typeof e.from === 'string' ? e.from.trim() : '';
      const to = typeof e.to === 'string' ? e.to.trim() : '';

      if (!from) {
        errors.push(`Edge "${edgeId || index}" is missing a valid "from" node ID.`);
      } else if (!nodeMap.has(from)) {
        errors.push(`Edge "${edgeId || index}" references unknown "from" node "${from}".`);
      }

      if (!to) {
        errors.push(`Edge "${edgeId || index}" is missing a valid "to" node ID.`);
      } else if (!nodeMap.has(to)) {
        errors.push(`Edge "${edgeId || index}" references unknown "to" node "${to}".`);
      }

      if (from && to && from === to) {
        errors.push(`Edge "${edgeId || index}" has a self-loop (from and to both reference "${from}").`);
      }

      if (from && to && from !== to) {
        const pairKey = from < to ? `${from}__${to}` : `${to}__${from}`;
        if (undirectedPairSet.has(pairKey)) {
          errors.push(
            `Duplicate corridor connection detected between "${from}" and "${to}" (edge "${edgeId || index}").`
          );
        } else {
          undirectedPairSet.add(pairKey);
        }
      }

      if (typeof e.cost !== 'number' || !Number.isInteger(e.cost) || e.cost <= 0) {
        errors.push(
          `Edge "${edgeId || index}" has invalid cost "${String(e.cost)}". Cost must be a positive integer.`
        );
      }

      if (edgeId) {
        edgeMap.set(edgeId, { from, to });
      }
    });
  }

  // 4. initial_state object
  if (!raw.initial_state || typeof raw.initial_state !== 'object' || Array.isArray(raw.initial_state)) {
    errors.push('Field "initial_state" must be a valid object.');
  } else {
    const init = raw.initial_state as Record<string, unknown>;

    // blocked_nodes
    if (!Array.isArray(init.blocked_nodes)) {
      errors.push('initial_state.blocked_nodes must be an array.');
    } else {
      init.blocked_nodes.forEach((id: unknown) => {
        if (typeof id !== 'string') {
          errors.push(`Blocked node ID must be a string, received "${String(id)}".`);
          return;
        }
        const trimmed = id.trim();
        const nodeInfo = nodeMap.get(trimmed);
        if (!nodeInfo) {
          errors.push(`initial_state.blocked_nodes references unknown node ID "${trimmed}".`);
        } else if (nodeInfo.type === 'exit') {
          errors.push(
            `initial_state.blocked_nodes contains exit node "${trimmed}". Exits must be specified in closed_exits.`
          );
        }
      });
    }

    // blocked_edges
    if (!Array.isArray(init.blocked_edges)) {
      errors.push('initial_state.blocked_edges must be an array.');
    } else {
      init.blocked_edges.forEach((id: unknown) => {
        if (typeof id !== 'string') {
          errors.push(`Blocked edge ID must be a string, received "${String(id)}".`);
          return;
        }
        const trimmed = id.trim();
        if (!edgeMap.has(trimmed)) {
          errors.push(`initial_state.blocked_edges references unknown edge ID "${trimmed}".`);
        }
      });
    }

    // closed_exits
    if (!Array.isArray(init.closed_exits)) {
      errors.push('initial_state.closed_exits must be an array.');
    } else {
      init.closed_exits.forEach((id: unknown) => {
        if (typeof id !== 'string') {
          errors.push(`Closed exit ID must be a string, received "${String(id)}".`);
          return;
        }
        const trimmed = id.trim();
        const nodeInfo = nodeMap.get(trimmed);
        if (!nodeInfo) {
          errors.push(`initial_state.closed_exits references unknown node ID "${trimmed}".`);
        } else if (nodeInfo.type !== 'exit') {
          errors.push(
            `initial_state.closed_exits contains non-exit node "${trimmed}" of type "${nodeInfo.type}". Only exits can be in closed_exits.`
          );
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
