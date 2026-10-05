import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

export const Legend: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.65rem 1rem',
        backgroundColor: 'var(--bg-surface-1)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
      }}
    >
      <span
        style={{
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
        }}
      >
        {t.legendTitle}:
      </span>

      {/* Start Node */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            backgroundColor: '#272a5a',
            border: '2px solid var(--accent-light)',
          }}
        />
        <span>{t.legendStartNode}</span>
      </div>

      {/* Room */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '14px',
            height: '10px',
            borderRadius: '2px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1.5px solid var(--border-medium)',
          }}
        />
        <span>{t.legendRoom}</span>
      </div>

      {/* Junction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1.5px solid var(--border-medium)',
          }}
        />
        <span>{t.legendJunction}</span>
      </div>

      {/* Open Exit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '12px',
            height: '10px',
            borderRadius: '2px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1.5px solid var(--success)',
          }}
        />
        <span>{t.legendOpenExit}</span>
      </div>

      {/* Closed Exit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '12px',
            height: '10px',
            borderRadius: '2px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1.5px solid var(--danger)',
          }}
        />
        <span>{t.legendClosedExit}</span>
      </div>

      {/* Active Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '18px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: '#06b6d4',
            boxShadow: '0 0 6px #06b6d4',
          }}
        />
        <span>{t.legendActiveRoute}</span>
      </div>

      {/* Blocked Node */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            border: '1.5px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ✕
        </div>
        <span>{t.legendBlockedNode}</span>
      </div>

      {/* Blocked Corridor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div
          style={{
            width: '18px',
            height: '0',
            borderTop: '2px dashed var(--danger)',
          }}
        />
        <span>{t.legendBlockedCorridor}</span>
      </div>
    </div>
  );
};
