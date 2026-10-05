import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface ValidationModalProps {
  errors: string[];
  onClose: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ errors, onClose }) => {
  const { t } = useTranslation();

  if (errors.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="validation-title"
    >
      <div
        className="animate-fadeInDown"
        style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px var(--danger-glow)',
          maxWidth: '620px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--danger-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2
                id="validation-title"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.02em',
                }}
              >
                {t.validationErrorTitle}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t.validationErrorSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Items List */}
        <div
          style={{
            padding: '1.5rem',
            maxHeight: '380px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {errors.map((error, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                lineHeight: 1.45,
                color: '#fecaca',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--danger)',
                  marginTop: '1px',
                }}
              >
                •
              </span>
              <span>{error}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-2)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
          >
            {t.validationClose}
          </button>
        </div>
      </div>
    </div>
  );
};
