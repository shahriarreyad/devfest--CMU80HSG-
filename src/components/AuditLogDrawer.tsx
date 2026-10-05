import React from 'react';
import type { AuditLogEntry } from '../hooks/useSimulation';
import { History, X, Trash2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  onClear: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClear,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '380px',
        maxHeight: '450px',
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className="animate-fadeInUp"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <History size={16} color="var(--accent-light)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
            {t.auditLogTitle}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface-3)',
              color: 'var(--text-secondary)',
            }}
          >
            {logs.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {logs.length > 0 && (
            <button
              onClick={onClear}
              title={t.clearLog}
              style={{
                padding: '4px',
                borderRadius: '4px',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Log Entries */}
      <div
        style={{
          padding: '0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '360px',
        }}
      >
        {logs.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No simulation activity recorded yet.
          </div>
        ) : (
          logs.map((log) => {
            let badgeColor = 'var(--text-secondary)';

            if (log.type === 'hazard') {
              badgeColor = 'var(--danger)';
            } else if (log.type === 'reset') {
              badgeColor = 'var(--warning)';
            } else if (log.type === 'route') {
              badgeColor = 'var(--cyan-primary)';
            }

            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.5rem 0.65rem',
                  backgroundColor: 'var(--bg-surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: badgeColor,
                    marginTop: '5px',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    marginTop: '1px',
                  }}
                >
                  {log.time}
                </span>
                <span style={{ color: '#fff', flex: 1, wordBreak: 'break-word', lineHeight: 1.4 }}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
