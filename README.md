# SMART ESCAPE
## Interactive Evacuation Route Simulator

> **A competition-ready, browser-based emergency-control dashboard designed for real-time evacuation route calculation, dynamic hazard simulation, and deterministic multi-tier tie-breaking.**

Built strictly following the official **Smart Escape** specification and **AI DevFest** rulebook.

---

## 🌟 Key Features

1. **100% Offline & In-Browser**: Zero backend, zero external routing APIs, no databases, no serverless functions.
2. **Generic & Data-Driven**: Handles arbitrary unseen building datasets (2–60 nodes, 1–150 undirected edges, rooms, junctions, exits, disconnected graphs, arbitrary positive edge costs).
3. **Exact Dijkstra Routing Engine**:
   - Computes cheapest path using undirected corridor costs (never coordinate distances).
   - Dynamic exclusion of blocked nodes, blocked corridors, and closed exits.
   - Incident edges of blocked nodes are automatically rendered unusable.
4. **Deterministic Multi-Tier Tie-Breaking**:
   - **Priority 1**: Lowest total path cost.
   - **Priority 2**: Lexicographically smallest Exit ID (e.g., `E1` < `E2`).
   - **Priority 3**: Lexicographically smallest Node ID sequence (e.g., `[R1, C1, C2, E1]` < `[R1, C1, C3, E1]`).
   - Completely independent of JSON order or object key enumeration.
5. **Interactive Floor Plan (SVG)**:
   - Visual distinction between **Rooms** (rounded cards), **Junctions** (circular hubs), and **Exits** (exit doors).
   - Display of edge costs visibly positioned at corridor midpoints.
   - Zoom (+/-), Fit-to-View, and Drag-Pan controls for comfortable inspection of large floor plans.
   - Animated route flow pulse travelling along the active evacuation corridor.
   - Click an unblocked room or junction on the map to select it as the evacuation start point.
   - Export Map to standalone SVG file.
6. **Full Dynamic Hazard Simulation**:
   - Instant toggling of Rooms/Junctions (Open/Blocked), Corridors (Open/Blocked), and Exits (Open/Closed).
   - Recalculates routes instantaneously (<1ms) without page reloads or file re-imports.
7. **Strict State Restoration (Reset)**:
   - Deep copy of imported `initial_state` is preserved.
   - Clicking Reset restores the **exact hazards** defined in the imported file.
8. **Comprehensive Client-Side Validation**:
   - Non-crashing validation modal with human-readable, bulleted error messages.
   - Validates node IDs, edge endpoints, self-loops, duplicate edges, positive integer costs, and initial state references.
9. **Bilingual UI (English & Bangla)**:
   - Seamless one-click switching between English and Bangla (বাংলা).
   - Preserves all simulation state, selected starts, and active hazards.
10. **Bonus Capabilities**:
    - Step-by-step route walkthrough navigator (Next/Previous step through the route).
    - Simulation activity audit log with timestamped event tracking.
    - SVG map export.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Icons**: Lucide React
- **Graphics**: Pure SVG with CSS animations and filter effects
- **Code Quality**: Oxlint (0 warnings, 0 errors)
- **Testing**: Automated self-test runner (`npm test`)

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Then open `http://localhost:5173` in Google Chrome.

### Running Automated Self-Tests

```bash
npm test
```

Runs 14 automated verification tests verifying:
- Official Section 24 Baseline scenario (`R1 -> C1 -> C2 -> E1`, Cost: 7).
- Blocking junction `C2` detouring to `E2` (`R1 -> C1 -> C3 -> C4 -> E2`, Cost: 11).
- Closing exits `E1` and `E2` producing `NO_ROUTE`.
- Starting at room `R2` reaching `E2` (`R2 -> C3 -> C4 -> E2`, Cost: 7).
- Blocking selected start node producing `START_BLOCKED`.
- Priority 2 tie-breaking between equal-cost exits.
- Priority 3 tie-breaking between equal-cost paths to the same exit.
- Corridor-only blocking leaving incident nodes accessible.
- Disconnected graphs.
- Schema validator rejecting self-loops, negative costs, unknown IDs, and duplicate corridors.
- Reset restoration restoring initial hazards.

### Production Build

```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── AuditLogDrawer.tsx      # Simulation activity audit log drawer
│   ├── EmptyState.tsx          # Initial empty state & sample quick-loaders
│   ├── HazardControls.tsx      # Interactive hazard control center
│   ├── Header.tsx              # Application header & system status
│   ├── InteractiveMap.tsx      # SVG map renderer with zoom/pan & animations
│   ├── Legend.tsx              # Map visual language legend
│   ├── RouteResultCard.tsx     # Route status, stats, and step walkthrough
│   ├── StartSelector.tsx       # Origin dropdown & status indicators
│   └── ValidationModal.tsx     # Formatted validation error dialog
├── data/
│   └── sampleBuildings.ts      # Spec sample & complex test datasets
├── hooks/
│   └── useSimulation.ts        # Reactive simulation engine & hazard state
├── i18n/
│   ├── context.ts              # Language React context definition
│   ├── LanguageProvider.tsx    # I18n provider component
│   ├── translations.ts         # English and Bangla dictionaries
│   └── useTranslation.ts       # Hook for accessing translations
├── styles/
│   ├── animations.css          # SVG flow, pulse, and entrance keyframes
│   └── theme.css               # Design system colors, cards, and responsive queries
├── types/
│   └── building.ts             # TypeScript definitions for Smart Escape schema
├── utils/
│   ├── dijkstra.ts             # Dijkstra shortest path implementation
│   ├── graph.ts                # Adjacency list and graph helpers
│   ├── testSimulation.ts       # Self-test runner
│   ├── tieBreaker.ts           # Deterministic 3-priority tie-breaking
│   └── validator.ts            # Client-side JSON schema validator
├── App.tsx                     # Main dashboard coordinator
└── main.tsx                    # Application entrypoint
```

---

## 🔬 Mathematical Routing & Tie-Breaking Specification

Given an undirected graph $G = (V, E)$ with edge weights $w(e) \in \mathbb{Z}^+$:

1. **Hazard Filtering**:
   - $V' = V \setminus (\text{blocked\_nodes} \cup \text{closed\_exits})$
   - $E' = \{ (u, v) \in E \mid u \in V', v \in V', e \notin \text{blocked\_edges} \}$
2. **Shortest Path Computation**:
   - Dijkstra's algorithm searches from source node $s \in V'$ to all reachable open exits $T = \{ t \in V' \mid \text{type}(t) = \text{'exit'} \}$.
   - Priority queue state: $(\text{cost}, \text{nodeSequence})$.
   - When relaxation finds a path of strictly lower cost, it updates the distance.
   - When relaxation finds a path of **equal cost**, it replaces the predecessor if the candidate node sequence is lexicographically smaller:
     $$\text{seq}_{\text{new}} \prec_{\text{lex}} \text{seq}_{\text{current}}$$
3. **Exit Selection Comparison**:
   For any two candidate exit paths $P_1$ and $P_2$:
   - $\text{Cost}(P_1) < \text{Cost}(P_2) \implies P_1 \text{ chosen}$
   - $\text{Cost}(P_1) = \text{Cost}(P_2) \land \text{ExitId}(P_1) \prec_{\text{lex}} \text{ExitId}(P_2) \implies P_1 \text{ chosen}$
   - $\text{Cost}(P_1) = \text{Cost}(P_2) \land \text{ExitId}(P_1) = \text{ExitId}(P_2) \land \text{Seq}(P_1) \prec_{\text{lex}} \text{Seq}(P_2) \implies P_1 \text{ chosen}$

---

## 🛡️ License

MIT License. Designed for AI DevFest 2026.
