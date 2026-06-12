import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SolarDashboard from './components/SolarDashboard';
import WindDashboard from './components/WindDashboard';
import { getSolarRealtimeStats, getWindRealtimeStats, getForecastData } from './utils/dataGenerator';
import { TRANSLATIONS } from './utils/i18n';

const SCENARIO_CYCLE = ['sunny', 'cloudy', 'storm', 'heatwave'];

export default function App() {
  const [lang, setLang] = useState('ko');
  const [currentPlant, setCurrentPlant] = useState('solar');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = SCENARIO_CYCLE[scenarioIndex];
  
  // Real-time stats
  const [solarStats, setSolarStats] = useState(null);
  const [windStats, setWindStats] = useState(null);
  const [forecasts, setForecasts] = useState({ solar: null, wind: null });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  // 1. Automatically cycle weather scenarios every 90 seconds to show case DSS alerts & map changes
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setScenarioIndex(prev => (prev + 1) % SCENARIO_CYCLE.length);
    }, 90000); // 90 seconds

    return () => clearInterval(cycleInterval);
  }, []);

  // 2. Load and refresh baseline metrics on scenario change
  useEffect(() => {
    const hour = new Date().getHours();
    
    setSolarStats(getSolarRealtimeStats(scenario, hour));
    setWindStats(getWindRealtimeStats(scenario));
    
    setForecasts({
      solar: getForecastData('solar', scenario),
      wind: getForecastData('wind', scenario)
    });
  }, [scenario]);

  // 3. Telemetry Ticker loop (updates every 4 seconds)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const hour = new Date().getHours();
      
      setSolarStats(prev => {
        if (!prev) return null;
        
        const driftGen = (Math.random() * 0.26 - 0.13);
        const driftTemp = (Math.random() * 0.08 - 0.04);
        
        let targetGen = prev.generation;
        if (prev.generation > 0) {
          targetGen = parseFloat(Math.max(0.0, Math.min(98.4, prev.generation + driftGen)).toFixed(2));
        }

        return {
          ...prev,
          generation: targetGen,
          moduleTemp: parseFloat((prev.moduleTemp + driftTemp).toFixed(1)),
          kma: {
            ...prev.kma,
            irradiance: parseFloat(Math.max(0.0, prev.kma.irradiance + (Math.random() * 4 - 2)).toFixed(1))
          }
        };
      });

      setWindStats(prev => {
        if (!prev) return null;
        
        const updatedTurbines = prev.turbines.map(t => {
          if (t.generation === 0) return t; // Cut-out stays 0
          
          const driftKw = Math.round(Math.random() * 16 - 8);
          const driftSpeed = (Math.random() * 0.16 - 0.08);
          
          return {
            ...t,
            generation: Math.max(0, Math.min(2000, t.generation + driftKw)),
            windSpeed: parseFloat(Math.max(0.1, t.windSpeed + driftSpeed).toFixed(1))
          };
        });

        const totalMw = parseFloat((updatedTurbines.reduce((sum, t) => sum + t.generation, 0) / 1000).toFixed(2));

        return {
          ...prev,
          turbines: updatedTurbines,
          totalGeneration: totalMw
        };
      });

    }, 4000);

    return () => clearInterval(telemetryInterval);
  }, []);

  const getScenarioName = (sc, language) => {
    const names = {
      ko: { sunny: '맑음', cloudy: '흐림 및 우천', storm: '태풍 경보 발효', heatwave: '극한 고온(폭염)' },
      en: { sunny: 'Sunny & Clear', cloudy: 'Cloudy & Rain', storm: 'Typhoon Warning', heatwave: 'Extreme Heatwave' },
      vi: { sunny: 'Nắng ấm', cloudy: 'Nhiều mây & Mưa', storm: 'Cảnh báo Bão', heatwave: 'Nắng nóng cực đoan' }
    };
    return names[language]?.[sc] || names.ko[sc];
  };

  if (!solarStats || !windStats || !forecasts.solar || !forecasts.wind) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#05080d',
        color: 'var(--accent-color)',
        fontWeight: 'bold',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div className="pulse-slow" style={{ textShadow: '0 0 10px rgba(26, 117, 255, 0.4)' }}>
          ⚡ ENERMICS METEOROLOGICAL ENGINE SYNCHRONIZING...
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#05080d' }}>
      {/* VHWIS overlay styling elements */}
      <div className="map-vignette"></div>
      <div className="scanline"></div>
      
      <div className="dashboard-container">
        <Header 
          currentPlant={currentPlant}
          setCurrentPlant={setCurrentPlant}
          lang={lang}
          setLang={setLang}
        />
        
        <main style={{ marginTop: '12px' }}>
          {currentPlant === 'solar' ? (
            <SolarDashboard 
              realtimeStats={solarStats}
              forecastData={forecasts.solar}
              scenario={scenario}
              lang={lang}
            />
          ) : (
            <WindDashboard 
              realtimeStats={windStats}
              forecastData={forecasts.wind}
              scenario={scenario}
              lang={lang}
            />
          )}
        </main>

        {/* Small cycling indicator badge */}
        <div style={{
          position: 'fixed',
          bottom: '8px',
          right: '12px',
          fontSize: '8px',
          color: 'var(--color-text-darker)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          padding: '2px 6px',
          borderRadius: '3px',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          {t.weatherCycleBadge}: <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{getScenarioName(scenario, lang)}</span> ({t.weatherCyclePeriod})
        </div>
      </div>
    </div>
  );
}
