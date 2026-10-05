import type { BuildingData } from '../types/building';

/**
 * Official Sample Building matching Section 24 specifications exactly.
 */
export const OFFICIAL_SAMPLE_BUILDING: BuildingData = {
  building: "Central Innovation Hub",
  nodes: [
    { id: "R1", label: "Conference Room Alpha", type: "room", x: 100, y: 140 },
    { id: "R2", label: "Operations Lab Beta", type: "room", x: 100, y: 340 },
    { id: "C1", label: "Junction North 1", type: "junction", x: 280, y: 140 },
    { id: "C2", label: "Junction North 2", type: "junction", x: 460, y: 140 },
    { id: "C3", label: "Junction South 1", type: "junction", x: 280, y: 340 },
    { id: "C4", label: "Junction South 2", type: "junction", x: 460, y: 340 },
    { id: "E1", label: "Primary Exit Gate 1", type: "exit", x: 640, y: 140 },
    { id: "E2", label: "Secondary Exit Gate 2", type: "exit", x: 640, y: 340 }
  ],
  edges: [
    { id: "EDGE_R1_C1", from: "R1", to: "C1", cost: 2 },
    { id: "EDGE_C1_C2", from: "C1", to: "C2", cost: 3 },
    { id: "EDGE_C2_E1", from: "C2", to: "E1", cost: 2 },
    { id: "EDGE_R2_C3", from: "R2", to: "C3", cost: 2 },
    { id: "EDGE_C3_C4", from: "C3", to: "C4", cost: 3 },
    { id: "EDGE_C4_E2", from: "C4", to: "E2", cost: 2 },
    { id: "EDGE_C1_C3", from: "C1", to: "C3", cost: 4 }
  ],
  initial_state: {
    blocked_nodes: [],
    blocked_edges: [],
    closed_exits: []
  }
};

/**
 * Complex Multi-Wing Medical Center (16 nodes, 21 edges, 3 exits)
 * Demonstrates routing across complex layouts, multiple cross-connections, and tie-breaking.
 */
export const MULTI_WING_COMPLEX: BuildingData = {
  building: "Metropolitan Emergency Medical Center",
  nodes: [
    { id: "ICU_1", label: "Intensive Care Unit", type: "room", x: 80, y: 100 },
    { id: "SURG_1", label: "Surgical Suite 1", type: "room", x: 80, y: 240 },
    { id: "PEDS_1", label: "Pediatrics Ward", type: "room", x: 80, y: 380 },
    { id: "RAD_1", label: "Radiology Center", type: "room", x: 80, y: 520 },
    
    { id: "J_N1", label: "Junction N-West", type: "junction", x: 240, y: 100 },
    { id: "J_M1", label: "Junction Mid-West", type: "junction", x: 240, y: 240 },
    { id: "J_S1", label: "Junction S-West", type: "junction", x: 240, y: 380 },
    { id: "J_B1", label: "Junction Basement West", type: "junction", x: 240, y: 520 },

    { id: "J_N2", label: "Junction N-East", type: "junction", x: 440, y: 100 },
    { id: "J_M2", label: "Junction Central Atrium", type: "junction", x: 440, y: 240 },
    { id: "J_S2", label: "Junction S-East", type: "junction", x: 440, y: 380 },
    { id: "J_B2", label: "Junction S-Concourse", type: "junction", x: 440, y: 520 },

    { id: "EXIT_N", label: "North Helipad Exit", type: "exit", x: 620, y: 100 },
    { id: "EXIT_E", label: "East Plaza Evacuation Gate", type: "exit", x: 620, y: 240 },
    { id: "EXIT_S", label: "South Ambulance Bay", type: "exit", x: 620, y: 450 }
  ],
  edges: [
    { id: "E_01", from: "ICU_1", to: "J_N1", cost: 2 },
    { id: "E_02", from: "SURG_1", to: "J_M1", cost: 2 },
    { id: "E_03", from: "PEDS_1", to: "J_S1", cost: 2 },
    { id: "E_04", from: "RAD_1", to: "J_B1", cost: 3 },

    { id: "E_05", from: "J_N1", to: "J_M1", cost: 3 },
    { id: "E_06", from: "J_M1", to: "J_S1", cost: 3 },
    { id: "E_07", from: "J_S1", to: "J_B1", cost: 3 },

    { id: "E_08", from: "J_N1", to: "J_N2", cost: 4 },
    { id: "E_09", from: "J_M1", to: "J_M2", cost: 3 },
    { id: "E_10", from: "J_S1", to: "J_S2", cost: 4 },
    { id: "E_11", from: "J_B1", to: "J_B2", cost: 5 },

    { id: "E_12", from: "J_N2", to: "J_M2", cost: 3 },
    { id: "E_13", from: "J_M2", to: "J_S2", cost: 3 },
    { id: "E_14", from: "J_S2", to: "J_B2", cost: 3 },

    { id: "E_15", from: "J_N2", to: "EXIT_N", cost: 2 },
    { id: "E_16", from: "J_M2", to: "EXIT_E", cost: 2 },
    { id: "E_17", from: "J_S2", to: "EXIT_S", cost: 2 },
    { id: "E_18", from: "J_B2", to: "EXIT_S", cost: 3 }
  ],
  initial_state: {
    blocked_nodes: [],
    blocked_edges: [],
    closed_exits: []
  }
};

/**
 * Equal-Cost Tie-Breaker Validation Building
 * Designed specifically to verify tie-breaking Priority 2 (Exit ID) and Priority 3 (Node sequence).
 */
export const TIE_BREAKER_DEMO: BuildingData = {
  building: "Dual Corridor Research Station (Tie-Breaker Benchmark)",
  nodes: [
    { id: "R_START", label: "Command Center", type: "room", x: 100, y: 220 },
    { id: "J_A", label: "WaypointA", type: "junction", x: 300, y: 120 },
    { id: "J_B", label: "WaypointB", type: "junction", x: 300, y: 320 },
    { id: "EXIT_1", label: "Escape Hatch 1", type: "exit", x: 500, y: 120 },
    { id: "EXIT_2", label: "Escape Hatch 2", type: "exit", x: 500, y: 320 }
  ],
  edges: [
    { id: "ED_1", from: "R_START", to: "J_A", cost: 5 },
    { id: "ED_2", from: "J_A", to: "EXIT_1", cost: 5 },
    { id: "ED_3", from: "R_START", to: "J_B", cost: 5 },
    { id: "ED_4", from: "J_B", to: "EXIT_2", cost: 5 }
  ],
  initial_state: {
    blocked_nodes: [],
    blocked_edges: [],
    closed_exits: []
  }
};
