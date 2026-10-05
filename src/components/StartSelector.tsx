import React from 'react';
import type { BuildingData } from '../types/building';
import { MapPin } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface StartSelectorProps {
  building: BuildingData;
  selectedStartId: string | null;
  blockedNodes: Set<string>;
  onSelectStart: (nodeId: string) => void;
}

export const StartSelector: React.FC<StartSelectorProps> = ({
  building,
  selectedStartId,
  blockedNodes,
  onSelectStart,
}) => {
  const { t } = useTranslation();

  // Filter only rooms and junctions (exits are NEVER start candidates)
  const candidateNodes = building.nodes.filter(
    (n) => n.type === 'room' || n.type === 'junction'
  );

  const rooms = candidateNodes.filter((n) => n.type === 'room');
  const junctions = candidateNodes.filter((n) => n.type === 'junction');

  const selectedNode = building.nodes.find((n) => n.id === selectedStartId);
  const isSelectedBlocked = selectedStartId ? blockedNodes.has(selectedStartId) : false;

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
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin size={16} />
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
            {t.selectStartTitle}
          </span>
        </div>

        {selectedNode && (
          <span
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '12px',
              backgroundColor: isSelectedBlocked ? 'var(--danger-surface)' : 'var(--accent-glow)',
              color: isSelectedBlocked ? 'var(--danger)' : 'var(--accent-light)',
              fontWeight: 700,
              border: `1px solid ${isSelectedBlocked ? 'var(--danger-border)' : 'rgba(99, 102, 241, 0.3)'}`,
            }}
          >
            {isSelectedBlocked ? t.statusBlocked : `${selectedNode.type.toUpperCase()}: ${selectedNode.id}`}
          </span>
        )}
      </div>

      {/* Select Dropdown */}
      <div style={{ position: 'relative' }}>
        <select
          value={selectedStartId || ''}
          onChange={(e) => onSelectStart(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            backgroundColor: isSelectedBlocked ? 'var(--danger-surface)' : 'var(--bg-surface-2)',
            border: `1px solid ${isSelectedBlocked ? 'var(--danger-border)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background-color 0.15s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-light)')}
          onBlur={(e) =>
            (e.target.style.borderColor = isSelectedBlocked
              ? 'var(--danger-border)'
              : 'var(--border-medium)')
          }
        >
          <option value="" disabled>
            {t.selectStartPlaceholder}
          </option>

          {/* Rooms Group */}
          {rooms.length > 0 && (
            <optgroup label={t.roomLabel + 's'}>
              {rooms.map((room) => {
                const isBlocked = blockedNodes.has(room.id);
                return (
                  <option
                    key={room.id}
                    value={room.id}
                    disabled={isBlocked}
                    style={{
                      backgroundColor: 'var(--bg-surface-2)',
                      color: isBlocked ? 'var(--text-disabled)' : 'var(--text-main)',
                    }}
                  >
                    {room.id} — {room.label} {isBlocked ? `[${t.statusBlocked}]` : ''}
                  </option>
                );
              })}
            </optgroup>
          )}

          {/* Junctions Group */}
          {junctions.length > 0 && (
            <optgroup label={t.junctionLabel + 's'}>
              {junctions.map((jnc) => {
                const isBlocked = blockedNodes.has(jnc.id);
                return (
                  <option
                    key={jnc.id}
                    value={jnc.id}
                    disabled={isBlocked}
                    style={{
                      backgroundColor: 'var(--bg-surface-2)',
                      color: isBlocked ? 'var(--text-disabled)' : 'var(--text-main)',
                    }}
                  >
                    {jnc.id} — {jnc.label} {isBlocked ? `[${t.statusBlocked}]` : ''}
                  </option>
                );
              })}
            </optgroup>
          )}
        </select>

        {/* Dropdown Chevron */}
        <div
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}
        >
          ▼
        </div>
      </div>

      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span>ℹ</span>
        <span>{t.clickMapHint}</span>
      </p>
    </div>
  );
};
