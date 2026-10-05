/**
 * EXACT TIE-BREAKING RULES (from Section 7 of Smart Escape Specification):
 *
 * Priority 1: Lowest total cost.
 * Priority 2: If exit costs are equal: choose lexicographically smallest EXIT ID (e.g. "E1" < "E2").
 * Priority 3: If paths to the SAME exit have equal cost: choose lexicographically smallest NODE ID SEQUENCE
 *             (e.g. ["R1", "C1", "C2", "E1"] < ["R1", "C1", "C3", "E1"]).
 *
 * This implementation is completely deterministic and independent of object insertion order,
 * JSON ordering, or priority queue implementation details.
 */

export interface CandidateRoute {
  destinationExitId: string;
  nodeSequence: string[];
  edgeSequence: string[];
  totalCost: number;
}

/**
 * Deterministically compares two node ID sequences element-by-element lexicographically.
 * Returns negative if seqA is smaller, positive if seqB is smaller, 0 if identical.
 */
export function compareNodeSequences(seqA: string[], seqB: string[]): number {
  const minLen = Math.min(seqA.length, seqB.length);
  for (let i = 0; i < minLen; i++) {
    const cmp = seqA[i].localeCompare(seqB[i]);
    if (cmp !== 0) {
      return cmp;
    }
  }
  return seqA.length - seqB.length;
}

/**
 * Deterministically compares two candidate evacuation paths using the 3 strict priority tiers.
 */
export function comparePaths(a: CandidateRoute, b: CandidateRoute): number {
  // Priority 1: Lowest total cost
  if (a.totalCost !== b.totalCost) {
    return a.totalCost - b.totalCost;
  }

  // Priority 2: If exit costs are equal: choose lexicographically smallest EXIT ID
  const exitCmp = a.destinationExitId.localeCompare(b.destinationExitId);
  if (exitCmp !== 0) {
    return exitCmp;
  }

  // Priority 3: If paths to the SAME exit have equal cost: choose lexicographically smallest NODE ID SEQUENCE
  return compareNodeSequences(a.nodeSequence, b.nodeSequence);
}
