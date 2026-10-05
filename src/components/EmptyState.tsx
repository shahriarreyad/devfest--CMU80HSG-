import React, { useRef } from 'react';
import { Shield, Upload, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { OFFICIAL_SAMPLE_BUILDING, MULTI_WING_COMPLEX } from '../data/sampleBuildings';

interface EmptyStateProps {
  onImportFile: (file: File) => void;
  onLoadPreset: (preset: typeof OFFICIAL_SAMPLE_BUILDING) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onImportFile, onLoadPreset }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        style={{ display: 'none' }}
      />

      <div
        className="animate-fadeInUp"
        style={{
          maxWidth: '560px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Floating Shield Icon */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4), 0 0 40px rgba(6, 182, 212, 0.25)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <Shield size={44} strokeWidth={2.2} />
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t.emptyStateTitle}
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginTop: '0.65rem',
              lineHeight: 1.6,
            }}
          >
            {t.emptyStateDesc}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
          }}
        >
          <Upload size={18} />
          <span>{t.emptyStateAction}</span>
        </button>

        {/* Quick Sample Load Section */}
        <div
          style={{
            marginTop: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-surface-1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t.emptyStateOrTry}
          </span>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => onLoadPreset(OFFICIAL_SAMPLE_BUILDING)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)';
                e.currentTarget.style.borderColor = 'var(--accent-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
            >
              <span>{t.loadSample}</span>
              <ArrowRight size={15} color="var(--accent-light)" />
            </button>

            <button
              onClick={() => onLoadPreset(MULTI_WING_COMPLEX)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)';
                e.currentTarget.style.borderColor = 'var(--cyan-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
            >
              <span>{t.loadComplex}</span>
              <ArrowRight size={15} color="var(--cyan-primary)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
