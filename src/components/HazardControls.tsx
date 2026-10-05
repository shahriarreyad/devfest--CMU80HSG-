import React, { useState } from 'react';
import type { BuildingData } from '../types/building';
import {
  Flame,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface HazardControlsProps {
  building: BuildingData;
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
  closedExits: Set<string>;
  onToggleNode: (nodeId: string) => void;
  onToggleEdge: (edgeId: string) => void;
  onToggleExit: (exitId: string) => void;
}

export const HazardControls: React.FC<HazardControlsProps> = ({
  building,
  blockedNodes,
  blockedEdges,
  closedExits,
  onToggleNode,
  onToggleEdge,
  onToggleExit,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'nodes' | 'corridors' | 'exits'>('nodes');
  const [searchQuery, setSearchQuery] = useState('');

  // Node categories
  const nonExitNodes = building.nodes.filter((n) => n.type !== 'exit');
  const exitNodes = building.nodes.filter((n) => n.type === 'exit');

  // Filtered nodes
  const filteredNodes = nonExitNodes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return n.id.toLowerCase().includes(q) || n.label.toLowerCase().includes(q);
  });

  // Filtered corridors
  const filteredEdges = building.edges.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.from.toLowerCase().includes(q) ||
      e.to.toLowerCase().includes(q)
    );
  });

  // Filtered exits
  const filteredExits = exitNodes.filter((e) => {
    const q = searchQuery.toLowerCase();
    return e.id.toLowerCase().includes(q) || e.label.toLowerCase().includes(q);
  });

  const totalBlockedNodes = blockedNodes.size;
  const totalBlockedEdges = blockedEdges.size;
  const totalClosedExits = closedExits.size;
  const totalHazards = totalBlockedNodes + totalBlockedEdges + totalClosedExits;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        flex: 1,
        minHeight: '260px',
      }}
    >
      {/* Title & Total Active Hazards Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: totalHazards > 0 ? 'var(--danger-surface)' : 'var(--bg-surface-3)',
              color: totalHazards > 0 ? 'var(--danger)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={16} />
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {t.hazardControlTitle}
          </span>
        </div>

        {totalHazards > 0 && (
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '12px',
              backgroundColor: 'var(--danger-surface)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              fontWeight: 700,
            }}
          >
            {totalHazards} ACTIVE
          </span>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-surface-2)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setActiveTab('nodes')}
          style={{
            flex: 1,
            padding: '0.45rem 0.4rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'nodes' ? 'var(--bg-surface-3)' : 'transparent',
            color: activeTab === 'nodes' ? 'var(--accent-light)' : 'var(--text-muted)',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <span>{t.nodesTab}</span>
          {totalBlockedNodes > 0 && (
            <span
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalBlockedNodes}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('corridors')}
          style={{
            flex: 1,
            padding: '0.45rem 0.4rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'corridors' ? 'var(--bg-surface-3)' : 'transparent',
            color: activeTab === 'corridors' ? 'var(--accent-light)' : 'var(--text-muted)',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <span>{t.corridorsTab}</span>
          {totalBlockedEdges > 0 && (
            <span
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalBlockedEdges}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('exits')}
          style={{
            flex: 1,
            padding: '0.45rem 0.4rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'exits' ? 'var(--bg-surface-3)' : 'transparent',
            color: activeTab === 'exits' ? 'var(--accent-light)' : 'var(--text-muted)',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <span>{t.exitsTab}</span>
          {totalClosedExits > 0 && (
            <span
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalClosedExits}
            </span>
          )}
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-surface-2)',
          padding: '0.45rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <Search size={14} color="var(--text-muted)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '0.8rem',
            width: '100%',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 4px' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Control Items Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.5rem',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '2px',
        }}
      >
        {/* TAB 1: NODES (ROOMS & JUNCTIONS) */}
        {activeTab === 'nodes' &&
          filteredNodes.map((node) => {
            const isBlocked = blockedNodes.has(node.id);
            return (
              <button
                key={node.id}
                onClick={() => onToggleNode(node.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isBlocked ? 'var(--danger-surface)' : 'var(--bg-surface-2)',
                  border: `1px solid ${isBlocked ? 'var(--danger-border)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isBlocked ? 'var(--danger)' : 'var(--accent-light)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isBlocked ? 'var(--danger-border)' : 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isBlocked ? 'var(--danger)' : '#fff' }}>
                    {node.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      backgroundColor: isBlocked ? 'var(--danger)' : 'var(--bg-surface-3)',
                      color: isBlocked ? '#fff' : 'var(--success)',
                    }}
                  >
                    {isBlocked ? t.statusBlocked : t.statusOpen}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                >
                  {node.label}
                </span>
              </button>
            );
          })}

        {/* TAB 2: CORRIDORS (EDGES) */}
        {activeTab === 'corridors' &&
          filteredEdges.map((edge) => {
            const isBlocked = blockedEdges.has(edge.id);
            return (
              <button
                key={edge.id}
                onClick={() => onToggleEdge(edge.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isBlocked ? 'var(--danger-surface)' : 'var(--bg-surface-2)',
                  border: `1px solid ${isBlocked ? 'var(--danger-border)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isBlocked ? 'var(--danger)' : 'var(--accent-light)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isBlocked ? 'var(--danger-border)' : 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isBlocked ? 'var(--danger)' : '#fff' }}>
                    {edge.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      backgroundColor: isBlocked ? 'var(--danger)' : 'var(--bg-surface-3)',
                      color: isBlocked ? '#fff' : 'var(--success)',
                    }}
                  >
                    {isBlocked ? t.statusBlocked : t.statusOpen}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{edge.from}</span>
                  <ArrowRight size={10} color="var(--text-muted)" />
                  <span>{edge.to}</span>
                  <span style={{ color: 'var(--accent-light)', marginLeft: 'auto', fontWeight: 700 }}>
                    ({edge.cost})
                  </span>
                </span>
              </button>
            );
          })}

        {/* TAB 3: EXITS */}
        {activeTab === 'exits' &&
          filteredExits.map((exit) => {
            const isClosed = closedExits.has(exit.id);
            return (
              <button
                key={exit.id}
                onClick={() => onToggleExit(exit.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isClosed ? 'var(--danger-surface)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${isClosed ? 'var(--danger-border)' : 'rgba(16, 185, 129, 0.3)'}`,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isClosed ? 'var(--danger)' : 'var(--success)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isClosed ? 'var(--danger-border)' : 'rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isClosed ? 'var(--danger)' : 'var(--success)' }}>
                    {exit.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      backgroundColor: isClosed ? 'var(--danger)' : 'var(--success)',
                      color: '#fff',
                    }}
                  >
                    {isClosed ? t.statusClosed : t.statusOpen}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                >
                  {exit.label}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
};
