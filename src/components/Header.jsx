import React, { useState, useEffect } from 'react';
import { Sun, Wind, Activity, Clock } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function Header({ 
  currentPlant, 
  setCurrentPlant,
  lang,
  setLang
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    
    // Day name localizations
    const dayNames = {
      ko: ['일', '월', '화', '수', '목', '금', '토'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      vi: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    };
    
    const dayName = dayNames[lang]?.[date.getDay()] || dayNames.ko[date.getDay()];
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    
    if (lang === 'en') {
      return `${y}-${m}-${d} (${dayName}) ${hh}:${mm}:${ss}`;
    } else if (lang === 'vi') {
      return `${d}/${m}/${y} (${dayName}) ${hh}:${mm}:${ss}`;
    }
    return `${y}년 ${m}월 ${d}일 (${dayName}) ${hh}:${mm}:${ss}`;
  };

  return (
    <header className="glass-card" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: 'var(--header-height)',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      background: 'rgba(3, 11, 20, 0.9)',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.55)',
      zIndex: 10,
      flexWrap: 'nowrap'
    }}>
      {/* Brand area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          color: '#030c16',
          background: '#f7fbfff2',
          padding: '4px 8px',
          fontSize: '13px',
          fontWeight: 900,
          letterSpacing: '0.01em',
          borderRadius: '2px',
          display: 'inline-flex',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          ENERMICS
        </div>
        <div style={{ minWidth: '110px' }}>
          <span style={{
            letterSpacing: '0.08em',
            color: '#e0eeffe6',
            fontSize: '8.5px',
            fontWeight: 800,
            display: 'block',
            lineHeight: '1.1',
            whiteSpace: 'nowrap'
          }}>
            {t.brandSub}
          </span>
          <span style={{
            color: 'var(--color-text-darker)',
            fontSize: '7.5px',
            fontWeight: 700,
            display: 'block',
            marginTop: '1px',
            whiteSpace: 'nowrap'
          }}>
            {t.brandDesc}
          </span>
        </div>
      </div>

      {/* Switcher tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.5)',
          padding: '2px',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <button 
            onClick={() => setCurrentPlant('solar')}
            className={`tab-btn ${currentPlant === 'solar' ? 'active-solar' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'transparent',
              color: currentPlant === 'solar' ? 'var(--color-orange)' : 'var(--color-text-muted)',
              whiteSpace: 'nowrap'
            }}
          >
            <Sun size={11} />
            {t.solarTab}
          </button>
          
          <button 
            onClick={() => setCurrentPlant('wind')}
            className={`tab-btn ${currentPlant === 'wind' ? 'active-wind' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'transparent',
              color: currentPlant === 'wind' ? 'var(--color-emerald)' : 'var(--color-text-muted)',
              whiteSpace: 'nowrap'
            }}
          >
            <Wind size={11} />
            {t.windTab}
          </button>
        </div>
      </div>

      {/* Language selector & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        
        {/* Language selector */}
        <div className="language-selector" style={{ display: 'flex', gap: '3px' }}>
          <button 
            onClick={() => setLang('ko')} 
            className={`lang-btn ${lang === 'ko' ? 'active' : ''}`}
          >
            KO
          </button>
          <button 
            onClick={() => setLang('en')} 
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('vi')} 
            className={`lang-btn ${lang === 'vi' ? 'active' : ''}`}
          >
            VI
          </button>
        </div>

        {/* AI Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '9px',
          color: 'var(--color-cyan)',
          background: 'rgba(26, 117, 255, 0.08)',
          padding: '4px 6px',
          borderRadius: '3px',
          border: '1px solid rgba(26, 117, 255, 0.2)',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}>
          <Activity size={10} className="pulse-slow" />
          {t.aiStatus}
        </div>

        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: 'var(--color-text-main)',
          fontSize: '11px',
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}>
          <Clock size={11} color="var(--accent-color)" />
          <span className="numeric">{formatDate(time)}</span>
        </div>
      </div>

      {/* Style overrides for languages and tab switches */}
      <style dangerouslySetInnerHTML={{__html: `
        .tab-btn.active-solar {
          background: rgba(255, 122, 0, 0.12) !important;
          box-shadow: inset 0 0 6px rgba(255, 122, 0, 0.2);
          border: 1px solid rgba(255, 122, 0, 0.3) !important;
        }
        .tab-btn.active-wind {
          background: rgba(0, 204, 136, 0.12) !important;
          box-shadow: inset 0 0 6px rgba(0, 204, 136, 0.2);
          border: 1px solid rgba(0, 204, 136, 0.3) !important;
        }
        .lang-btn {
          color: rgba(218, 234, 251, 0.6);
          cursor: pointer;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          padding: 2px 6px;
          font-size: 9px;
          font-weight: 800;
          transition: all 0.2s;
        }
        .lang-btn:hover {
          color: #ffffff;
          border-color: rgba(26, 117, 255, 0.5);
        }
        .lang-btn.active {
          color: #ffffff;
          background: rgba(26, 117, 255, 0.3);
          border-color: var(--accent-color);
          box-shadow: 0 0 6px rgba(26, 117, 255, 0.4);
        }
      `}} />
    </header>
  );
}
