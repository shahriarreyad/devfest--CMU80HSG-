import React, { useState, useMemo, useRef } from 'react';
import type {
  BuildingData,
  NodeData,
  RouteResult,
} from '../types/building';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface InteractiveMapProps {
  building: BuildingData;
  routeResult: RouteResult;
  selectedStartId: string | null;
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
  closedExits: Set<string>;
  onSelectStart: (nodeId: string) => void;
  onToggleNode: (nodeId: string) => void;
  onToggleEdge: (edgeId: string) => void;
  onToggleExit: (exitId: string) => void;
  walkthroughStepIndex?: number | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  building,
  routeResult,
  selectedStartId,
  blockedNodes,
  blockedEdges,
  closedExits,
  onSelectStart,
  onToggleNode,
  onToggleEdge,
  onToggleExit,
  walkthroughStepIndex = null,
}) => {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Hover states
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [blockedClickNotice, setBlockedClickNotice] = useState<string | null>(null);

  // Compute bounding box with comfortable padding
  const bounds = useMemo(() => {
    if (!building.nodes.length) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of building.nodes) {
      if (node.x < minX) minX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.x > maxX) maxX = node.x;
      if (node.y > maxY) maxY = node.y;
    }

    const padX = Math.max(90, (maxX - minX) * 0.12);
    const padY = Math.max(90, (maxY - minY) * 0.12);

    const bMinX = minX - padX;
    const bMinY = minY - padY;
    const width = Math.max(400, maxX - minX + padX * 2);
    const height = Math.max(300, maxY - minY + padY * 2);

    return { minX: bMinX, minY: bMinY, maxX: bMinX + width, maxY: bMinY + height, width, height };
  }, [building.nodes]);

  // Lookup for quick access to coordinates
  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeData>();
    for (const n of building.nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [building.nodes]);

  // Set of active route nodes and edges for instant styling
  const activeRouteNodeSet = useMemo(() => {
    if (walkthroughStepIndex !== null && walkthroughStepIndex >= 0) {
      return new Set(routeResult.nodeSequence.slice(0, walkthroughStepIndex + 1));
    }
    return new Set(routeResult.nodeSequence);
  }, [routeResult.nodeSequence, walkthroughStepIndex]);

  const activeRouteEdgeSet = useMemo(() => {
    if (walkthroughStepIndex !== null && walkthroughStepIndex >= 0) {
      return new Set(routeResult.edgeSequence.slice(0, walkthroughStepIndex));
    }
    return new Set(routeResult.edgeSequence);
  }, [routeResult.edgeSequence, walkthroughStepIndex]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(3, +(z * 1.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, +(z * 0.8).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click pan
    // If clicking on SVG canvas (not a node/button)
    const target = e.target as HTMLElement;
    if (target.tagName === 'svg' || target.getAttribute('data-canvas') === 'true') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Node click handler
  const handleNodeClick = (node: NodeData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      onToggleNode(node.id);
      return;
    }

    if (node.type === 'exit') {
      // Clicking exit toggles open / closed
      onToggleExit(node.id);
      return;
    }

    // Room or Junction
    const isBlocked = blockedNodes.has(node.id);
    if (isBlocked) {
      // Show gentle notice
      setBlockedClickNotice(`Node ${node.id} (${node.label}) is blocked. Unblock it in Hazard Controls or Shift-Click to use as start.`);
      setTimeout(() => setBlockedClickNotice(null), 3200);
      return;
    }

    // Set as starting location
    onSelectStart(node.id);
  };

  // Export SVG handler
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${building.building.toLowerCase().replace(/\s+/g, '_')}_evacuation_map.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '480px',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Map Header Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 20,
          backgroundColor: 'rgba(14, 20, 36, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button
          onClick={handleZoomIn}
          title={t.zoomIn}
          style={{
            padding: '6px',
            borderRadius: '4px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ZoomIn size={16} />
        </button>

        <button
          onClick={handleZoomOut}
          title={t.zoomOut}
          style={{
            padding: '6px',
            borderRadius: '4px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ZoomOut size={16} />
        </button>

        <button
          onClick={handleResetZoom}
          title={t.resetZoom}
          style={{
            padding: '6px',
            borderRadius: '4px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Maximize2 size={16} />
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

        <button
          onClick={handleExportSvg}
          title={t.exportMap}
          style={{
            padding: '6px',
            borderRadius: '4px',
            color: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Download size={16} />
        </button>
      </div>

      {/* Blocked Node Click Notification */}
      {blockedClickNotice && (
        <div
          className="animate-fadeInDown"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            backgroundColor: 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            padding: '0.55rem 1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{blockedClickNotice}</span>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        data-canvas="true"
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          cursor: isPanning ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        onMouseDown={handleMouseDown}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern
            id="spatialGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255, 255, 255, 0.035)"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="1" fill="rgba(255, 255, 255, 0.06)" />
          </pattern>

          {/* Glow Filters */}
          <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="destinationGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="blockedGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for Active Route */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Pan and Zoom Group */}
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transformOrigin: 'center center', transition: isPanning ? 'none' : 'transform 0.15s ease-out' }}
        >
          {/* Spatial Grid Background */}
          <rect
            data-canvas="true"
            x={bounds.minX - 2000}
            y={bounds.minY - 2000}
            width={bounds.width + 4000}
            height={bounds.height + 4000}
            fill="url(#spatialGrid)"
          />

          {/* LAYER 1: EDGES (CORRIDORS) */}
          <g id="edges-layer">
            {building.edges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const isEdgeBlocked = blockedEdges.has(edge.id);
              const isFromBlocked = blockedNodes.has(edge.from);
              const isToBlocked = blockedNodes.has(edge.to);
              const isClosedFrom = closedExits.has(edge.from);
              const isClosedTo = closedExits.has(edge.to);

              const isIncidentToHazard = isFromBlocked || isToBlocked || isClosedFrom || isClosedTo;
              const isEffectivelyBlocked = isEdgeBlocked || isIncidentToHazard;

              const isActiveRoute = activeRouteEdgeSet.has(edge.id);
              const isHovered = hoveredEdgeId === edge.id;

              // Coordinates
              const x1 = fromNode.x;
              const y1 = fromNode.y;
              const x2 = toNode.x;
              const y2 = toNode.y;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              let strokeColor = 'rgba(255, 255, 255, 0.16)';
              let strokeWidth = 3;
              let strokeDash: string | undefined = undefined;

              if (isEdgeBlocked) {
                strokeColor = 'var(--danger)';
                strokeWidth = 2.5;
                strokeDash = '6 4';
              } else if (isIncidentToHazard) {
                strokeColor = 'rgba(239, 68, 68, 0.4)';
                strokeWidth = 2;
                strokeDash = '4 4';
              } else if (isActiveRoute) {
                strokeColor = '#06b6d4';
                strokeWidth = 5.5;
              } else if (isHovered) {
                strokeColor = 'var(--accent-light)';
                strokeWidth = 4;
              }

              return (
                <g
                  key={edge.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                  onClick={() => onToggleEdge(edge.id)}
                >
                  {/* Invisible thick line for easy hover & click */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="transparent"
                    strokeWidth="20"
                  />

                  {/* Active route glow underlay */}
                  {isActiveRoute && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeWidth="11"
                      strokeLinecap="round"
                      filter="url(#routeGlow)"
                    />
                  )}

                  {/* Base Corridor Line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                  />

                  {/* Animated Route Flow Traveling Stroke */}
                  {isActiveRoute && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="route-active-line"
                    />
                  )}

                  {/* Edge Cost Badge (Positioned visibly at midpoint) */}
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    style={{ pointerEvents: 'none' }}
                  >
                    <rect
                      x="-14"
                      y="-11"
                      width="28"
                      height="22"
                      rx="6"
                      fill={
                        isActiveRoute
                          ? '#0e2a38'
                          : isEffectivelyBlocked
                          ? '#2a1114'
                          : 'var(--bg-surface-2)'
                      }
                      stroke={
                        isActiveRoute
                          ? '#06b6d4'
                          : isEffectivelyBlocked
                          ? 'var(--danger-border)'
                          : 'var(--border-subtle)'
                      }
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={
                        isActiveRoute
                          ? '#38bdf8'
                          : isEffectivelyBlocked
                          ? '#f87171'
                          : 'var(--text-secondary)'
                      }
                      fontSize="10"
                      fontWeight="700"
                      letterSpacing="0.02em"
                    >
                      {edge.cost}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* LAYER 2: NODES */}
          <g id="nodes-layer">
            {building.nodes.map((node) => {
              const isStart = selectedStartId === node.id;
              const isBlocked = blockedNodes.has(node.id);
              const isClosed = closedExits.has(node.id);
              const isChosenExit = routeResult.destinationExitId === node.id && routeResult.status === 'AVAILABLE';
              const isInActiveRoute = activeRouteNodeSet.has(node.id);
              const isHovered = hoveredNodeId === node.id;

              const isExit = node.type === 'exit';
              const isRoom = node.type === 'room';
              const isJunction = node.type === 'junction';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{
                    cursor: isExit ? 'pointer' : isBlocked ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => handleNodeClick(node, e)}
                >
                  {/* Selected Start Expanding Pulse Ring */}
                  {isStart && !isBlocked && (
                    <circle
                      r="36"
                      fill="none"
                      stroke="var(--accent-light)"
                      strokeWidth="2"
                      opacity="0.6"
                      className="status-dot-pulse"
                    />
                  )}

                  {/* Destination Exit Pulse Ring */}
                  {isChosenExit && (
                    <circle
                      r="40"
                      fill="none"
                      stroke="var(--success)"
                      strokeWidth="2.5"
                      opacity="0.8"
                      filter="url(#destinationGlow)"
                      className="status-dot-pulse"
                    />
                  )}

                  {/* --- NODE TYPE: ROOM (Rounded Rectangle) --- */}
                  {isRoom && (
                    <g
                      transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
                      style={{ transition: 'transform 0.15s ease' }}
                    >
                      <rect
                        x="-38"
                        y="-26"
                        width="76"
                        height="52"
                        rx="10"
                        fill={
                          isBlocked
                            ? 'rgba(239, 68, 68, 0.18)'
                            : isStart
                            ? '#272a5a'
                            : isInActiveRoute
                            ? '#132c3f'
                            : 'var(--bg-surface-2)'
                        }
                        stroke={
                          isBlocked
                            ? 'var(--danger)'
                            : isStart
                            ? 'var(--accent-light)'
                            : isInActiveRoute
                            ? 'var(--cyan-primary)'
                            : 'var(--border-medium)'
                        }
                        strokeWidth={isStart || isInActiveRoute || isBlocked ? 2.5 : 1.5}
                        filter={
                          isStart
                            ? 'url(#routeGlow)'
                            : isBlocked
                            ? 'url(#blockedGlow)'
                            : undefined
                        }
                      />

                      {/* Small Room Indicator Icon */}
                      <g transform="translate(0, -9)">
                        <text
                          textAnchor="middle"
                          fill={
                            isBlocked
                              ? '#fca5a5'
                              : isStart
                              ? '#c7d2fe'
                              : isInActiveRoute
                              ? '#7dd3fc'
                              : 'var(--text-muted)'
                          }
                          fontSize="9"
                          fontWeight="700"
                          letterSpacing="0.04em"
                        >
                          ROOM
                        </text>
                      </g>

                      {/* Node ID */}
                      <text
                        x="0"
                        y="8"
                        textAnchor="middle"
                        fill={isBlocked ? '#ef4444' : '#ffffff'}
                        fontSize="12"
                        fontWeight="800"
                        letterSpacing="0.02em"
                      >
                        {node.id}
                      </text>

                      {/* Blocked Badge Overlay */}
                      {isBlocked && (
                        <g transform="translate(24, -18)">
                          <circle r="8" fill="var(--danger)" />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="9"
                            fontWeight="900"
                          >
                            ✕
                          </text>
                        </g>
                      )}

                      {/* Start Badge Overlay */}
                      {isStart && !isBlocked && (
                        <g transform="translate(24, -18)">
                          <circle r="8" fill="var(--accent-primary)" />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="8"
                            fontWeight="900"
                          >
                            ★
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* --- NODE TYPE: JUNCTION (Circle) --- */}
                  {isJunction && (
                    <g
                      transform={isHovered ? 'scale(1.08)' : 'scale(1)'}
                      style={{ transition: 'transform 0.15s ease' }}
                    >
                      <circle
                        r="24"
                        fill={
                          isBlocked
                            ? 'rgba(239, 68, 68, 0.18)'
                            : isStart
                            ? '#272a5a'
                            : isInActiveRoute
                            ? '#132c3f'
                            : 'var(--bg-surface-2)'
                        }
                        stroke={
                          isBlocked
                            ? 'var(--danger)'
                            : isStart
                            ? 'var(--accent-light)'
                            : isInActiveRoute
                            ? 'var(--cyan-primary)'
                            : 'var(--border-medium)'
                        }
                        strokeWidth={isStart || isInActiveRoute || isBlocked ? 2.5 : 1.5}
                        filter={
                          isStart
                            ? 'url(#routeGlow)'
                            : isBlocked
                            ? 'url(#blockedGlow)'
                            : undefined
                        }
                      />

                      {/* Junction Hub Center Dot */}
                      <circle
                        r="3"
                        cy="-8"
                        fill={
                          isBlocked
                            ? 'var(--danger)'
                            : isStart
                            ? 'var(--accent-light)'
                            : isInActiveRoute
                            ? 'var(--cyan-primary)'
                            : 'var(--text-muted)'
                        }
                      />

                      {/* Node ID */}
                      <text
                        x="0"
                        y="6"
                        textAnchor="middle"
                        fill={isBlocked ? '#ef4444' : '#ffffff'}
                        fontSize="11"
                        fontWeight="800"
                        letterSpacing="0.02em"
                      >
                        {node.id}
                      </text>

                      {/* Blocked Badge Overlay */}
                      {isBlocked && (
                        <g transform="translate(16, -14)">
                          <circle r="7" fill="var(--danger)" />
                          <text
                            x="0"
                            y="2.5"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="8"
                            fontWeight="900"
                          >
                            ✕
                          </text>
                        </g>
                      )}

                      {/* Start Badge Overlay */}
                      {isStart && !isBlocked && (
                        <g transform="translate(16, -14)">
                          <circle r="7" fill="var(--accent-primary)" />
                          <text
                            x="0"
                            y="2.5"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="7"
                            fontWeight="900"
                          >
                            ★
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* --- NODE TYPE: EXIT (Door / Exit Portal) --- */}
                  {isExit && (
                    <g
                      transform={isHovered ? 'scale(1.06)' : 'scale(1)'}
                      style={{ transition: 'transform 0.15s ease' }}
                    >
                      <rect
                        x="-34"
                        y="-26"
                        width="68"
                        height="52"
                        rx="8"
                        fill={
                          isClosed
                            ? 'rgba(239, 68, 68, 0.14)'
                            : isChosenExit
                            ? '#0f3825'
                            : '#0c2419'
                        }
                        stroke={
                          isClosed
                            ? 'var(--danger)'
                            : isChosenExit
                            ? 'var(--success)'
                            : '#22c55e'
                        }
                        strokeWidth={isChosenExit ? 3 : 2}
                        filter={isChosenExit ? 'url(#destinationGlow)' : undefined}
                      />

                      {/* Exit Label Top Banner */}
                      <rect
                        x="-34"
                        y="-26"
                        width="68"
                        height="18"
                        rx="7"
                        fill={
                          isClosed
                            ? 'var(--danger)'
                            : isChosenExit
                            ? 'var(--success)'
                            : 'rgba(34, 197, 94, 0.4)'
                        }
                      />

                      <text
                        x="0"
                        y="-13"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="800"
                        letterSpacing="0.06em"
                      >
                        {isClosed ? 'CLOSED' : 'EXIT'}
                      </text>

                      {/* Exit ID */}
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill={isClosed ? '#f87171' : '#ffffff'}
                        fontSize="12"
                        fontWeight="800"
                        letterSpacing="0.02em"
                      >
                        {node.id}
                      </text>

                      {/* Chosen Destination Success Checkmark Badge */}
                      {isChosenExit && (
                        <g transform="translate(24, -18)">
                          <circle r="9" fill="var(--success)" stroke="#fff" strokeWidth="1" />
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="9"
                            fontWeight="900"
                          >
                            ✓
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Secondary Label (Displayed Below Node) */}
                  <text
                    x="0"
                    y={isRoom ? 38 : isJunction ? 34 : 38}
                    textAnchor="middle"
                    fill={isBlocked || isClosed ? 'var(--text-disabled)' : 'var(--text-secondary)'}
                    fontSize="9.5"
                    fontWeight="500"
                    letterSpacing="0.01em"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};
