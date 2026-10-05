import React, { useRef } from 'react';
import {
  Shield,
  RotateCcw,
  Upload,
  Globe,
  Download,
  Building as BuildingIcon,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import type { RouteStatus } from '../types/building';
import { OFFICIAL_SAMPLE_BUILDING, MULTI_WING_COMPLEX } from '../data/sampleBuildings';

interface HeaderProps {
  buildingName?: string;
  routeStatus: RouteStatus;
  hasActiveHazards: boolean;
  onImportFile: (file: File) => void;
  onLoadPreset: (preset: typeof OFFICIAL_SAMPLE_BUILDING) => void;
  onReset: () => void;
  canReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  buildingName,
  routeStatus,
  hasActiveHazards,
  onImportFile,
  onLoadPreset,
  onReset,
  canReset,
}) => {
  const { t, language, toggleLanguage } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      // Reset input value so re-importing the same file triggers change
      e.target.value = '';
    }
  };

  // Determine system status label and color
  let statusText = t.systemReady;
  let statusDotColor = 'var(--success)';

  if (routeStatus === 'START_BLOCKED') {
    statusText = t.startBlockedStatus;
    statusDotColor = 'var(--danger)';
  } else if (routeStatus === 'NO_ROUTE') {
    statusText = t.noRouteStatus;
    statusDotColor = 'var(--warning)';
  } else if (routeStatus === 'AVAILABLE') {
    statusText = t.routingActive;
    statusDotColor = 'var(--cyan-primary)';
  } else if (hasActiveHazards) {
    statusText = t.hazardSimulated;
    statusDotColor = 'var(--warning)';
  }

  const handleDownloadSample = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(OFFICIAL_SAMPLE_BUILDING, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'smart-escape-sample.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
        backgroundColor: 'var(--bg-surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 50,
        position: 'relative',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <Shield size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.appTitle}
            </h1>
            {buildingName && (
              <div
                className="animate-fadeInDown"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-surface-3)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-light)',
                  fontWeight: 600,
                }}
              >
                <BuildingIcon size={13} />
                <span>{buildingName}</span>
              </div>
            )}
          </div>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Middle Status Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: 'var(--text-secondary)',
        }}
      >
        <span
          className="status-dot-pulse"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusDotColor,
            boxShadow: `0 0 10px ${statusDotColor}`,
          }}
        />
        <span>{statusText}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          style={{ display: 'none' }}
        />

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: '#fff',
            fontSize: '0.84rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          title="Import any arbitrary building JSON file"
        >
          <Upload size={15} />
          <span>{t.importButton}</span>
        </button>

        {/* Load Preset Samples */}
        <button
          onClick={() => onLoadPreset(OFFICIAL_SAMPLE_BUILDING)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
            e.currentTarget.style.borderColor = 'var(--border-medium)';
          }}
          title="Load official Section 24 spec sample dataset"
        >
          <span>{t.loadSample}</span>
        </button>

        <button
          onClick={() => onLoadPreset(MULTI_WING_COMPLEX)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-3)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          title="Load 16-node multi-wing hospital complex dataset"
        >
          <span>{t.loadComplex}</span>
        </button>

        {/* Download Sample JSON */}
        <button
          onClick={handleDownloadSample}
          aria-label={t.downloadSample}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.55rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title={t.downloadSample}
        >
          <Download size={16} />
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={!canReset}
          title={t.resetTooltip}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-medium)',
            color: canReset ? 'var(--warning)' : 'var(--text-disabled)',
            fontSize: '0.82rem',
            fontWeight: 600,
            opacity: canReset ? 1 : 0.6,
            cursor: canReset ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (canReset) e.currentTarget.style.backgroundColor = 'var(--warning-surface)';
          }}
          onMouseLeave={(e) => {
            if (canReset) e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
          }}
        >
          <RotateCcw size={14} />
          <span>{t.resetButton}</span>
        </button>

        {/* Language Switcher EN | বাংলা */}
        <button
          onClick={toggleLanguage}
          aria-label="Switch Language"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface-3)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
        >
          <Globe size={14} color="var(--accent-light)" />
          <span style={{ color: language === 'en' ? 'var(--accent-light)' : 'var(--text-muted)' }}>
            EN
          </span>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{ color: language === 'bn' ? 'var(--accent-light)' : 'var(--text-muted)' }}>
            বাংলা
          </span>
        </button>
      </div>
    </header>
  );
};
