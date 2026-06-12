import React, { useState, useEffect } from 'react';
import { Play, Pause, Eye, Radio, Sparkles, Navigation, Zap, Wind } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function AnimatedRadarMap({ plantType, lang = 'ko' }) {
  // Select default category based on plant type
  const [activeType, setActiveType] = useState(plantType === 'solar' ? 'irradiance' : 'windflow');
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(9);
  const [timestamps, setTimestamps] = useState([]);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // Generate 10 timestamps at 10-minute intervals dynamically
  useEffect(() => {
    const generateTimes = () => {
      const list = [];
      const now = new Date();
      const rounded = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        Math.floor(now.getMinutes() / 10) * 10,
        0
      );

      for (let i = 9; i >= 0; i--) {
        const targetTime = new Date(rounded.getTime() - i * 10 * 60 * 1000);
        const dateStr = `${targetTime.getFullYear()}.${String(targetTime.getMonth() + 1).padStart(2, '0')}.${String(targetTime.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(targetTime.getHours()).padStart(2, '0')}:${String(targetTime.getMinutes()).padStart(2, '0')}`;
        
        list.push({
          full: `${dateStr} ${timeStr} KST`,
          short: timeStr
        });
      }
      return list;
    };

    setTimestamps(generateTimes());
  }, []);

  // Update active type if plant type changes
  useEffect(() => {
    setActiveType(plantType === 'solar' ? 'irradiance' : 'windflow');
  }, [plantType]);

  // Image loop timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 10);
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (timestamps.length === 0) {
    return <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', padding: '20px' }}>{t.timelineSync}</div>;
  }

  // Construct local image paths served from public/ directory
  const getImagePath = () => {
    const num = activeIndex + 1;
    switch (activeType) {
      case 'infrared':
        return `/infrared/Satellite(Infrared)_${num}.png`;
      case 'irradiance':
        return `/Solar radiation AI/Satellite(Solar radiation AI)_${num}.png`;
      case 'groundtemp':
        return `/ground_temp/Satellite(ground temp)_${num}.png`;
      case 'radar':
        return `/precipitation_area/Satellite(precipitation area)_${num}.png`;
      case 'lightning':
        return `/Lightning strike/Lightning strike_${num}.png`;
      case 'windflow':
        return `/Wind speed (80m) prediction information/Wind speed (80m) prediction information_${num}.png`;
      default:
        return '';
    }
  };

  const getCategoryName = () => {
    switch (activeType) {
      case 'infrared': return t.infrared;
      case 'irradiance': return t.irradiance;
      case 'groundtemp': return t.groundtemp;
      case 'radar': return t.radar;
      case 'lightning': return t.lightning;
      case 'windflow': return t.windflow;
      default: return t.imageInfo;
    }
  };

  // Render 4 bottom buttons based on plant type
  const renderCategoryButtons = () => {
    if (plantType === 'solar') {
      const solarTypes = [
        { key: 'infrared', label: t.infrared, Icon: Eye },
        { key: 'irradiance', label: t.irradiance, Icon: Sparkles },
        { key: 'groundtemp', label: t.groundtemp, Icon: Navigation },
        { key: 'radar', label: t.radar, Icon: Radio }
      ];
      
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', flexShrink: 0 }}>
          {solarTypes.map(typeItem => (
            <button
              key={typeItem.key}
              onClick={() => setActiveType(typeItem.key)}
              className={`map-tab-btn ${activeType === typeItem.key ? 'active' : ''}`}
              style={buttonStyle(activeType === typeItem.key)}
            >
              <typeItem.Icon size={10} />
              <span style={{ wordBreak: 'keep-all' }}>{typeItem.label}</span>
            </button>
          ))}
        </div>
      );
    } else {
      const windTypes = [
        { key: 'infrared', label: t.infrared, Icon: Eye },
        { key: 'radar', label: t.radar, Icon: Radio },
        { key: 'lightning', label: t.lightning, Icon: Zap },
        { key: 'windflow', label: t.windflow, Icon: Wind }
      ];

      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', flexShrink: 0 }}>
          {windTypes.map(typeItem => (
            <button
              key={typeItem.key}
              onClick={() => setActiveType(typeItem.key)}
              className={`map-tab-btn ${activeType === typeItem.key ? 'active' : ''}`}
              style={buttonStyle(activeType === typeItem.key)}
            >
              <typeItem.Icon size={10} />
              <span style={{ wordBreak: 'keep-all' }}>{typeItem.label}</span>
            </button>
          ))}
        </div>
      );
    }
  };

  const buttonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '6px 2px',
    fontSize: '10px',
    fontWeight: isActive ? 'bold' : '500',
    background: isActive ? 'rgba(26,117,255,0.18)' : 'rgba(255,255,255,0.02)',
    border: isActive ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: '4px',
    color: isActive ? '#ffffff' : 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px', overflow: 'hidden' }}>
      
      {/* Top HUD */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.45)',
        padding: '5px 8px',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '11px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsPlaying(p => !p)}
            style={{
              background: 'rgba(26, 117, 255, 0.15)',
              border: '1px solid rgba(26, 117, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '4px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={9} fill="#ffffff" /> : <Play size={9} fill="#ffffff" />}
          </button>
          <span style={{ color: 'var(--color-cyan)', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            {isPlaying ? t.liveLoop : t.paused}
          </span>
        </div>
        <div style={{ color: '#ffffff', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '10.5px', whiteSpace: 'nowrap' }}>
          {timestamps[activeIndex].full}
        </div>
      </div>

      {/* Screen Frame containing Image (height restricted to prevent flex compression) */}
      <div style={{
        flex: '1 1 auto',
        minHeight: '120px',
        height: '190px',
        position: 'relative',
        background: '#04070d',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={getImagePath()}
          alt={getCategoryName()}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: '#05080c'
          }}
        />
        <div className="scanline" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08 }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(5, 15, 28, 0.85)',
          padding: '3px 6px',
          borderRadius: '3px',
          fontSize: '7.5px',
          fontFamily: 'monospace',
          border: '1px solid rgba(26, 117, 255, 0.2)',
          color: 'var(--accent-color)',
          whiteSpace: 'nowrap'
        }}>
          {getCategoryName().toUpperCase()} | {activeIndex + 1}/10
        </div>
      </div>

      {/* Timeline Selector (10 Slots) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: '3px',
        flexShrink: 0
      }}>
        {timestamps.map((tItem, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setIsPlaying(false);
              }}
              style={{
                background: isActive ? 'rgba(26, 117, 255, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                border: isActive ? '1px solid var(--accent-color)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '3px',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                padding: '3px 0',
                fontSize: '8px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.15s'
              }}
            >
              {tItem.short}
            </button>
          );
        })}
      </div>

      {/* Bottom Category Toggle Buttons */}
      {renderCategoryButtons()}
    </div>
  );
}
