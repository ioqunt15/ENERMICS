import React, { useState } from 'react';
import { ShortTermChart, TrendChart } from './MiniCharts';
import AnimatedRadarMap from './AnimatedRadarMap';
import SatelliteCoordMap from './SatelliteCoordMap';
import DecisionSupport from './DecisionSupport';
import { Sun, Cloud } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function SolarDashboard({ realtimeStats, forecastData, scenario, lang = 'ko' }) {
  const [shortTermVar, setShortTermVar] = useState('generation');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <div className="dashboard-grid">
      
      {/* [패널 1] 기상 & 위성 융합 분석 영상 (좌측) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'hidden' }}>
        {/* 상단: WebGL(2D) 기반 발전소 좌표 지도 */}
        <SatelliteCoordMap currentPlant="solar" lang={lang} />

        {/* 하단: 기상 & 위성 융합 분석 영상 (높이 고정 및 가림 방지) */}
        <div className="glass-card" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          minHeight: 0
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'keep-all' }}>
              <span className="indicator-dot active" style={{ backgroundColor: 'var(--accent-color)' }}></span>
              {t.radarTitle}
            </h3>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <AnimatedRadarMap plantType="solar" lang={lang} />
          </div>
        </div>
      </section>

      {/* [패널 2] 실시간 관측 정보 (중앙) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
        {/* 상단: 의사결정 지원 시스템 제언 패널 */}
        <DecisionSupport plantType="solar" stats={realtimeStats} scenario={scenario} lang={lang} />

        {/* 하단: 실시간 관측 정보 수치 패널 */}
        <div className="glass-card" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, wordBreak: 'keep-all' }}>{t.obsTitle}</h3>
            <span className="numeric" style={{ fontSize: '9px', color: 'var(--color-text-darker)', whiteSpace: 'nowrap' }}>
              {t.kmaSync}: KST {new Date().toLocaleTimeString().slice(0, 5)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'flex-start' }}>
            {/* Solaseado site */}
            <div className="glass-card" style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,122,0,0.08)' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--color-orange)', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'keep-all' }}>
                <Sun size={11} /> {t.solarObsStation}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.genLabel}</span>
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <span className="numeric" style={{ fontSize: '20px', color: '#ff4d4d', fontWeight: 'bold', textShadow: '0 0 8px rgba(255,77,77,0.3)' }}>
                      {Number(realtimeStats.generation).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '10px', color: '#ff4d4d', fontWeight: 'bold', marginLeft: '3px' }}>MW</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.tempLabel}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.airTemp).toFixed(1)} ℃</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.panelTempLabel}</span>
                  <span className="numeric" style={{ fontWeight: 'bold', color: 'var(--color-cyan)' }}>{Number(realtimeStats.moduleTemp).toFixed(1)} ℃</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.horizIrradiance}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.horizontalIrradiance).toFixed(1)} W/㎡</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.inclinedIrradiance}</span>
                  <span className="numeric" style={{ fontWeight: 'bold', color: 'var(--color-cyan)' }}>{Number(realtimeStats.inclinedIrradiance).toFixed(1)} W/㎡</span>
                </div>
              </div>
            </div>

            {/* KMA local station */}
            <div className="glass-card" style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(26,117,255,0.06)' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--accent-color)', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'keep-all' }}>
                <Cloud size={11} /> {t.kmaSatellite}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.kmaTemp}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.kma.temp).toFixed(1)} ℃</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.kmaPanelTemp}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.kma.moduleTemp).toFixed(1)} ℃</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.kmaIrradiance}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.kma.irradiance).toFixed(1)} W/㎡</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.humidityLabel}</span>
                  <span className="numeric" style={{ fontWeight: 'bold' }}>{Math.round(realtimeStats.kma.humidity)} %</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', wordBreak: 'keep-all' }}>{t.windSpeedLabel}</span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ color: 'var(--color-text-darker)', marginRight: '4px' }}>{realtimeStats.kma.windDir}</span>
                    <span className="numeric" style={{ fontWeight: 'bold' }}>{Number(realtimeStats.kma.windSpeed).toFixed(1)} m/s</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '9px', color: 'var(--color-text-darker)', textAlign: 'center', padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', wordBreak: 'keep-all' }}>
            {t.inverterEff}
          </div>
        </div>
      </section>

      {/* [패널 3] 차트 (우측, 크기 및 CSS 조율) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflowY: 'auto', paddingRight: '2px' }}>
        
        {/* 단기 예측 차트 */}
        <div className="glass-card" style={{ padding: '12px 14px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, wordBreak: 'keep-all' }}>{t.shortTermTitle}</h3>
            
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShortTermVar('generation')}
                className={`var-btn ${shortTermVar === 'generation' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartGen}
              </button>
              <button 
                onClick={() => setShortTermVar('horizontalRad')}
                className={`var-btn ${shortTermVar === 'horizontalRad' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartHoriz}
              </button>
              <button 
                onClick={() => setShortTermVar('inclinedRad')}
                className={`var-btn ${shortTermVar === 'inclinedRad' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartIncl}
              </button>
              <button 
                onClick={() => setShortTermVar('panelTemp')}
                className={`var-btn ${shortTermVar === 'panelTemp' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartPanel}
              </button>
              <button 
                onClick={() => setShortTermVar('temp')}
                className={`var-btn ${shortTermVar === 'temp' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartTemp}
              </button>
              <button 
                onClick={() => setShortTermVar('rain')}
                className={`var-btn ${shortTermVar === 'rain' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartRain}
              </button>
            </div>
          </div>
          <div style={{ height: '150px' }}>
            <ShortTermChart 
              data={forecastData.shortTerm} 
              type="solar" 
              activeVar={shortTermVar} 
            />
          </div>
        </div>

        {/* 중기 예측 차트 (일별) */}
        <div className="glass-card" style={{ padding: '12px 14px', width: '100%' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', wordBreak: 'keep-all' }}>{t.mediumTermTitle}</h3>
          <div style={{ height: '120px' }}>
            <TrendChart data={forecastData.mediumTerm} type="solar" viewType="medium" />
          </div>
        </div>

        {/* 장기 예측 차트 (월별) */}
        <div className="glass-card" style={{ padding: '12px 14px', width: '100%' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', wordBreak: 'keep-all' }}>{t.longTermTitle}</h3>
          <div style={{ height: '120px' }}>
            <TrendChart data={forecastData.longTerm} type="solar" viewType="long" />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .var-btn {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255,255,255,0.02);
          color: var(--color-text-muted);
          font-size: 9px;
          font-weight: 500;
          padding: 3px 6px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .var-btn:hover {
          border-color: rgba(26,117,255,0.5);
          color: #ffffff;
        }
        .var-btn.active {
          border-color: var(--accent-color);
          background: rgba(26, 117, 255, 0.15);
          color: #ffffff;
          font-weight: bold;
          box-shadow: 0 0 6px rgba(26, 117, 255, 0.2);
        }
      `}} />
    </div>
  );
}
