import React, { useEffect, useState } from 'react';
import type { RouteResult, BuildingData } from '../types/building';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface RouteResultCardProps {
  routeResult: RouteResult;
  building: BuildingData;
  selectedStartId: string | null;
  routeUpdatedIndicator: boolean;
  walkthroughStepIndex: number | null;
  setWalkthroughStepIndex: (step: number | null) => void;
}

export const RouteResultCard: React.FC<RouteResultCardProps> = ({
  routeResult,
  building,
  selectedStartId,
  routeUpdatedIndicator,
  walkthroughStepIndex,
  setWalkthroughStepIndex,
}) => {
  const { t } = useTranslation();

  // Animated cost transition
  const [displayCost, setDisplayCost] = useState(routeResult.totalCost);

  useEffect(() => {
    if (routeResult.totalCost === displayCost) return;
    const diff = routeResult.totalCost - displayCost;
    const steps = 8;
    const increment = diff / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      if (stepCount >= steps) {
        setDisplayCost(routeResult.totalCost);
        clearInterval(timer);
      } else {
        setDisplayCost((prev) => Math.round(prev + increment));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [routeResult.totalCost, displayCost]);

  // Destination Exit Node Data
  const destinationNode = routeResult.destinationExitId
    ? building.nodes.find((n) => n.id === routeResult.destinationExitId)
    : null;

  // Start Node Data
  const startNode = selectedStartId
    ? building.nodes.find((n) => n.id === selectedStartId)
    : null;

  // Walkthrough navigation
  const totalSteps = routeResult.nodeSequence.length;
  const currentStep = walkthroughStepIndex !== null ? walkthroughStepIndex : totalSteps - 1;

  const handlePrevStep = () => {
    if (walkthroughStepIndex === null) {
      setWalkthroughStepIndex(Math.max(0, totalSteps - 2));
    } else {
      setWalkthroughStepIndex(Math.max(0, walkthroughStepIndex - 1));
    }
  };

  const handleNextStep = () => {
    if (walkthroughStepIndex === null) return;
    if (walkthroughStepIndex < totalSteps - 1) {
      setWalkthroughStepIndex(walkthroughStepIndex + 1);
    } else {
      setWalkthroughStepIndex(null); // Return to full route
    }
  };

  const handleResetWalkthrough = () => {
    setWalkthroughStepIndex(null);
  };

  // STATE A: ROUTE AVAILABLE
  if (routeResult.status === 'AVAILABLE') {
    return (
      <div
        className="animate-fadeInUp"
        style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid var(--cyan-glow)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 50%, #10b981 100%)',
          }}
        />

        {/* Header & Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={18} />
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#fff',
                textTransform: 'uppercase',
              }}
            >
              {t.routeAvailable}
            </span>
          </div>

          {/* Micro-interaction: Route Updated Tag */}
          {routeUpdatedIndicator && (
            <div
              className="animate-fadeInDown"
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                backgroundColor: 'var(--cyan-glow)',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid var(--cyan-primary)',
              }}
            >
              ✓ {t.routeUpdated}
            </div>
          )}
        </div>

        {/* Main Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            backgroundColor: 'var(--bg-surface-2)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Destination Exit */}
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}
            >
              {t.destinationExit}
            </span>
            <div
              style={{
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.4rem',
              }}
            >
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--success)',
                  letterSpacing: '0.02em',
                }}
              >
                {routeResult.destinationExitId}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {destinationNode?.label}
              </span>
            </div>
          </div>

          {/* Total Cost */}
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}
            >
              {t.totalCost}
            </span>
            <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  transition: 'color 0.2s',
                }}
              >
                {displayCost}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>cost</span>
            </div>
          </div>

          {/* Corridors Count */}
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}
            >
              {t.corridorCount}
            </span>
            <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                {routeResult.corridorCount}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t.corridorUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Route Node Sequence Visual Breadcrumbs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
              }}
            >
              {t.routeSequence}
            </span>

            {/* Walkthrough Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handlePrevStep}
                title={t.stepPrev}
                style={{
                  padding: '3px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', minWidth: '45px', textAlign: 'center' }}>
                {currentStep + 1} {t.stepOf} {totalSteps}
              </span>
              <button
                onClick={handleNextStep}
                title={t.stepNext}
                style={{
                  padding: '3px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={14} />
              </button>
              {walkthroughStepIndex !== null && (
                <button
                  onClick={handleResetWalkthrough}
                  title="Show Full Route"
                  style={{
                    padding: '3px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.4rem',
              padding: '0.65rem',
              backgroundColor: 'var(--bg-surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {routeResult.nodeSequence.map((nodeId, idx) => {
              const isStartNode = idx === 0;
              const isEndNode = idx === routeResult.nodeSequence.length - 1;
              const isHighlightedStep = walkthroughStepIndex !== null && idx === walkthroughStepIndex;

              return (
                <React.Fragment key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: isStartNode
                        ? 'rgba(99, 102, 241, 0.25)'
                        : isEndNode
                        ? 'rgba(16, 185, 129, 0.25)'
                        : isHighlightedStep
                        ? 'rgba(6, 182, 212, 0.35)'
                        : 'var(--bg-surface-3)',
                      border: `1px solid ${
                        isStartNode
                          ? 'var(--accent-light)'
                          : isEndNode
                          ? 'var(--success)'
                          : isHighlightedStep
                          ? 'var(--cyan-primary)'
                          : 'var(--border-subtle)'
                      }`,
                      color: isStartNode
                        ? 'var(--accent-light)'
                        : isEndNode
                        ? 'var(--success)'
                        : '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{nodeId}</span>
                  </div>
                  {idx < routeResult.nodeSequence.length - 1 && (
                    <ArrowRight size={13} color="var(--text-muted)" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // STATE B: STARTING LOCATION BLOCKED
  if (routeResult.status === 'START_BLOCKED') {
    return (
      <div
        className="animate-fadeInUp"
        style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md), 0 0 20px var(--danger-glow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--danger-surface)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)' }}>
              {t.startBlockedTitle}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {selectedStartId} ({startNode?.label})
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {t.startBlockedDesc}
        </p>
      </div>
    );
  }

  // STATE C: NO ROUTE AVAILABLE
  if (routeResult.status === 'NO_ROUTE') {
    return (
      <div
        className="animate-fadeInUp"
        style={{
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--warning-surface)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning)' }}>
              {t.noRouteTitle}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Origin: {selectedStartId} ({startNode?.label})
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {t.noRouteDesc}
        </p>
      </div>
    );
  }

  // STATE D: IDLE / NO START SELECTED
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <HelpCircle size={18} color="var(--accent-light)" />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {t.noStartSelectedTitle}
        </h3>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {t.noStartSelectedDesc}
      </p>
    </div>
  );
};
