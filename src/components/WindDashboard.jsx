import React, { useState } from 'react';
import { ShortTermChart, TrendChart } from './MiniCharts';
import AnimatedRadarMap from './AnimatedRadarMap';
import SatelliteCoordMap from './SatelliteCoordMap';
import DecisionSupport from './DecisionSupport';
import { Wind, Fan } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

export default function WindDashboard({ realtimeStats, forecastData, scenario, lang = 'ko' }) {
  const [shortTermVar, setShortTermVar] = useState('generation');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  return (
    <div className="dashboard-grid">
      
      {/* [패널 1] 기상 & 위성 융합 분석 영상 (좌측) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'hidden' }}>
        {/* 상단: WebGL(2D) 기반 발전소 좌표 지도 */}
        <SatelliteCoordMap currentPlant="wind" lang={lang} />

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
              {t.radarTitleWind}
            </h3>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <AnimatedRadarMap plantType="wind" lang={lang} />
          </div>
        </div>
      </section>

      {/* [패널 2] 실시간 관측 정보 (중앙) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
        {/* 상단: 의사결정 지원 시스템 제언 패널 */}
        <DecisionSupport plantType="wind" stats={realtimeStats} scenario={scenario} lang={lang} />

        {/* 하단: 호기별 터빈 매트릭스 패널 */}
        <div className="glass-card" style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, wordBreak: 'keep-all' }}>{t.scadaTitle}</h3>
            <span className="numeric" style={{ fontSize: '11px', color: 'var(--color-emerald)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {t.totalGenLabel}: {realtimeStats.totalGeneration} MW
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {realtimeStats.turbines.map((tItem, idx) => {
              const isCutOut = tItem.generation === 0 && scenario === 'storm';
              const isCalm = tItem.generation === 0 && scenario === 'heatwave';
              
              return (
                <div 
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '8px 10px',
                    background: isCutOut ? 'rgba(255, 23, 68, 0.06)' : 'rgba(0,0,0,0.15)',
                    border: isCutOut 
                      ? '1px solid rgba(255, 23, 68, 0.25)' 
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Fan 
                        size={16} 
                        color={isCutOut ? '#ff1744' : isCalm ? 'var(--color-text-darker)' : 'var(--color-emerald)'} 
                        style={{
                          animation: tItem.generation > 0 
                            ? `spin ${Math.max(0.6, 5 - (tItem.generation / 400))}s linear infinite` 
                            : 'none'
                        }}
                      />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: 'bold' }}>{tItem.id}</h4>
                      <span style={{ fontSize: '8px', color: 'var(--color-text-darker)', wordBreak: 'keep-all' }}>{t.windDirLabel}: {tItem.windDir}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', textAlign: 'right', alignItems: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      <div>{t.outTemp}: <span className="numeric">{tItem.hubTemp}℃</span></div>
                      <div>{t.inTemp}: <span className="numeric">{tItem.nacelleTemp}℃</span></div>
                    </div>
                    
                    <div style={{ minWidth: '60px' }}>
                      <div className="numeric" style={{ fontSize: '10px', color: 'var(--color-cyan)', fontWeight: 'bold' }}>
                        {tItem.windSpeed} m/s
                      </div>
                      {isCutOut ? (
                        <span style={{
                          fontSize: '8px',
                          color: '#ff1744',
                          background: 'rgba(255, 23, 68, 0.12)',
                          padding: '1px 3px',
                          borderRadius: '2px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          wordBreak: 'keep-all'
                        }}>
                          {t.turbineCutOut}
                        </span>
                      ) : (
                        <div className="numeric" style={{ fontSize: '12px', color: '#ffea00', fontWeight: 'bold' }}>
                          {tItem.generation} <span style={{ fontSize: '8px' }}>kW</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
                className={`var-wind-btn ${shortTermVar === 'generation' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartGen}
              </button>
              <button 
                onClick={() => setShortTermVar('windSpeed80m')}
                className={`var-wind-btn ${shortTermVar === 'windSpeed80m' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartWind80m}
              </button>
              <button 
                onClick={() => setShortTermVar('windSpeed10m')}
                className={`var-wind-btn ${shortTermVar === 'windSpeed10m' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartWind10m}
              </button>
              <button 
                onClick={() => setShortTermVar('temp')}
                className={`var-wind-btn ${shortTermVar === 'temp' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartTemp}
              </button>
              <button 
                onClick={() => setShortTermVar('rain')}
                className={`var-wind-btn ${shortTermVar === 'rain' ? 'active' : ''}`}
                style={{ wordBreak: 'keep-all' }}
              >
                {t.chartRain}
              </button>
            </div>
          </div>
          <div style={{ height: '150px' }}>
            <ShortTermChart 
              data={forecastData.shortTerm} 
              type="wind" 
              activeVar={shortTermVar} 
            />
          </div>
        </div>

        {/* 중기 예측 차트 (일별) */}
        <div className="glass-card" style={{ padding: '12px 14px', width: '100%' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', wordBreak: 'keep-all' }}>{t.mediumTermTitle}</h3>
          <div style={{ height: '120px' }}>
            <TrendChart data={forecastData.mediumTerm} type="wind" viewType="medium" />
          </div>
        </div>

        {/* 장기 예측 차트 (월별) */}
        <div className="glass-card" style={{ padding: '12px 14px', width: '100%' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', wordBreak: 'keep-all' }}>{t.longTermTitle}</h3>
          <div style={{ height: '120px' }}>
            <TrendChart data={forecastData.longTerm} type="wind" viewType="long" />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .var-wind-btn {
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
        .var-wind-btn:hover {
          border-color: rgba(0, 204, 136, 0.5);
          color: #ffffff;
        }
        .var-wind-btn.active {
          border-color: var(--color-emerald);
          background: rgba(0, 204, 136, 0.15);
          color: #ffffff;
          font-weight: bold;
          box-shadow: 0 0 6px rgba(0, 204, 136, 0.2);
        }
      `}} />
    </div>
  );
}
