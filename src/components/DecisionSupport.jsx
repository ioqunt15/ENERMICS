import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Cpu, Zap } from 'lucide-react';
import { TRANSLATIONS, getLocalizedAdvices } from '../utils/i18n';

export default function DecisionSupport({ plantType, stats, scenario, lang = 'ko' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  let status = 'info';
  let title = t.dssNormal;
  const advices = getLocalizedAdvices(plantType, scenario, stats, lang);
  let modelAccuracy = '98.2%';

  // Determine status color and title based on scenario
  if (plantType === 'solar') {
    const isHot = stats.moduleTemp > 45;
    const isLowRad = stats.horizontalIrradiance < 200;
    
    if (scenario === 'heatwave' || isHot) {
      status = 'warning';
      title = t.dssHot;
      modelAccuracy = '97.4%';
    } else if (scenario === 'cloudy' || isLowRad) {
      status = 'info';
      title = t.dssFluctuate;
      modelAccuracy = '95.8%';
    } else if (scenario === 'storm') {
      status = 'danger';
      title = t.dssStorm;
      modelAccuracy = '99.1%';
    } else {
      status = 'success';
      title = t.dssNormal;
      modelAccuracy = '98.5%';
    }
  } else {
    // Wind
    if (scenario === 'storm') {
      status = 'danger';
      title = t.dssWindStorm;
      modelAccuracy = '99.5%';
    } else if (scenario === 'heatwave') {
      status = 'warning';
      title = t.dssWindCalm;
      modelAccuracy = '97.2%';
    } else {
      status = 'success';
      title = t.dssWindNormal;
      modelAccuracy = '98.1%';
    }
  }

  // Accent styling rules based on warning severity
  let statusColor = '#1a75ff';
  let statusBg = 'rgba(26, 117, 255, 0.08)';
  let statusBorder = 'rgba(26, 117, 255, 0.25)';
  let Icon = Cpu;

  if (status === 'success') {
    statusColor = '#0c8';
    statusBg = 'rgba(0, 204, 136, 0.08)';
    statusBorder = 'rgba(0, 204, 136, 0.25)';
    Icon = CheckCircle;
  } else if (status === 'warning') {
    statusColor = '#ff7a00';
    statusBg = 'rgba(255, 122, 0, 0.08)';
    statusBorder = 'rgba(255, 122, 0, 0.25)';
    Icon = AlertTriangle;
  } else if (status === 'danger') {
    statusColor = '#ff1744';
    statusBg = 'rgba(255, 23, 68, 0.08)';
    statusBorder = 'rgba(255, 23, 68, 0.25)';
    Icon = ShieldAlert;
  }

  return (
    <div className="glass-card" style={{
      border: `1px solid ${statusBorder}`,
      background: 'rgba(5, 8, 13, 0.9)',
      padding: '12px 14px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flexShrink: 0
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold' }}>
          <Cpu size={13} color="var(--accent-color)" />
          <span style={{ wordBreak: 'keep-all' }}>{t.dssTitle}</span>
        </div>
        <div className="numeric" style={{ fontSize: '9px', color: 'var(--color-text-darker)', whiteSpace: 'nowrap' }}>
          {t.dssConfidence}: <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{modelAccuracy}</span>
        </div>
      </div>

      {/* Warning status block */}
      <div style={{
        background: statusBg,
        borderLeft: `3px solid ${statusColor}`,
        padding: '8px 10px',
        borderRadius: '0 4px 4px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Icon size={16} color={statusColor} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: statusColor, wordBreak: 'keep-all' }}>
          {title}
        </span>
      </div>

      {/* Localized advice list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
        {advices.map((advice, idx) => (
          <div key={idx} style={{
            fontSize: '10.5px',
            lineHeight: '1.4',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <span style={{ color: statusColor, flexShrink: 0, marginTop: '2.5px' }}><Zap size={8} /></span>
            <span style={{ wordBreak: 'keep-all' }}>{advice}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
