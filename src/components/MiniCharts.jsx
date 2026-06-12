import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom SVG Line/Area Chart for Short-term Forecasts with dynamic width calculation
 */
export function ShortTermChart({ data = [], type = 'solar', activeVar = 'generation' }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [width, setWidth] = useState(500); // Default fallback width
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Dynamically observe container width to stretch chart from left to right
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 50) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (data.length === 0) return <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', padding: '20px' }}>데이터가 없습니다.</div>;

  // Layout parameters
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;
  const height = 145;
  const marginX = 18; // Horizontal margin to prevent Y-axis text overlap and edge clipping

  const getValue = (item, isForecast = false) => {
    switch (activeVar) {
      case 'horizontalRad': return item.horizontalRad;
      case 'inclinedRad': return item.inclinedRad;
      case 'panelTemp': return item.panelTemp;
      case 'windSpeed80m': return item.windSpeed80m;
      case 'windSpeed10m': return item.windSpeed10m;
      case 'temp': return item.temp;
      case 'rain': return item.rain;
      case 'generation':
      default:
        return isForecast ? item.forecast : item.actual;
    }
  };

  let maxValue = 10;
  switch (activeVar) {
    case 'horizontalRad':
    case 'inclinedRad':
      maxValue = 1100;
      break;
    case 'panelTemp':
      maxValue = 70;
      break;
    case 'temp':
      maxValue = 40;
      break;
    case 'rain':
      maxValue = 40;
      break;
    case 'windSpeed80m':
    case 'windSpeed10m':
      maxValue = 30;
      break;
    case 'generation':
    default:
      maxValue = type === 'solar' ? 100 : 40; // Yeongam wind capacity is 40MW
      break;
  }

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Position calculation with side margins
  const getX = (index) => paddingLeft + marginX + (index / (data.length - 1)) * (chartWidth - 2 * marginX);
  const getY = (val) => height - paddingBottom - (Math.min(maxValue, Math.max(0, val)) / maxValue) * chartHeight;

  const pointsForecast = data.map((item, idx) => ({ x: getX(idx), y: getY(getValue(item, true)) }));
  const pointsActual = data.map((item, idx) => ({ x: getX(idx), y: getY(getValue(item, false)) }));

  const getLinePath = (pts) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  };

  const getAreaPath = (pts) => {
    if (pts.length === 0) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${getLinePath(pts)} L ${last.x} ${height - paddingBottom} L ${first.x} ${height - paddingBottom} Z`;
  };

  const gridLevels = 3;
  const gridLines = Array.from({ length: gridLevels + 1 }, (_, i) => {
    const val = (maxValue / gridLevels) * i;
    return {
      y: getY(val),
      label: val.toFixed(0)
    };
  });

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentage relative to internal width accounting for padding and marginX
    const internalLeft = (paddingLeft + marginX) / width * rect.width;
    const internalWidth = (chartWidth - 2 * marginX) / width * rect.width;
    const pct = (mouseX - internalLeft) / internalWidth;
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(pct * (data.length - 1))));
    
    setHoverIndex(idx);
    const svgX = getX(idx);
    setTooltipPos({
      x: svgX > width - 120 ? svgX - 125 : svgX + 12,
      y: Math.max(6, mouseY - 35)
    });
  };

  const forecastColor = '#1a75ff';
  let actualColor = type === 'solar' ? '#ff7a00' : '#0c8';
  let unit = 'MW';

  switch (activeVar) {
    case 'horizontalRad':
    case 'inclinedRad':
      unit = 'W/㎡';
      actualColor = '#ffea00';
      break;
    case 'panelTemp':
    case 'temp':
      unit = '℃';
      actualColor = '#ff3b30';
      break;
    case 'rain':
      unit = 'mm';
      actualColor = '#00acc1';
      break;
    case 'windSpeed80m':
    case 'windSpeed10m':
      unit = 'm/s';
      actualColor = '#0c8';
      break;
    default:
      unit = 'MW';
      break;
  }

  const getVarName = () => {
    switch (activeVar) {
      case 'horizontalRad': return '수평면 일사량';
      case 'inclinedRad': return '패널면 일사량';
      case 'panelTemp': return '패널 온도';
      case 'temp': return '기온';
      case 'rain': return '강수량';
      case 'windSpeed80m': return '80m 풍속';
      case 'windSpeed10m': return '10m 풍속';
      default: return '발전 출력';
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        style={{ cursor: 'crosshair', overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a75ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a75ff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="chartGradOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff7a00" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="chartGradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0c8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 6}
              y={line.y + 3}
              fill="rgba(255, 255, 255, 0.45)"
              fontSize="8.5"
              textAnchor="end"
              className="numeric"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data.map((item, idx) => {
          if (idx % 4 !== 0) return null;
          return (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 4}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="8.5"
              textAnchor="middle"
              className="numeric"
            >
              {item.time}
            </text>
          );
        })}

        {/* Curve drawing */}
        {activeVar === 'generation' ? (
          <>
            <path d={getAreaPath(pointsForecast)} fill="url(#chartGradBlue)" />
            <path d={getLinePath(pointsForecast)} fill="none" stroke={forecastColor} strokeWidth="1.8" />
            
            <path d={getAreaPath(pointsActual)} fill={type === 'solar' ? 'url(#chartGradOrange)' : 'url(#chartGradGreen)'} />
            <path d={getLinePath(pointsActual)} fill="none" stroke={actualColor} strokeWidth="1.5" strokeDasharray="3,2" />
          </>
        ) : (
          <>
            <path 
              d={getAreaPath(pointsForecast)} 
              fill={activeVar === 'temp' ? 'rgba(255, 59, 48, 0.06)' : 'url(#chartGradBlue)'} 
            />
            <path 
              d={getLinePath(pointsForecast)} 
              fill="none" 
              stroke={activeVar === 'temp' ? '#ff3b30' : forecastColor} 
              strokeWidth="2" 
            />
          </>
        )}

        {/* Cursor tracking */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={paddingTop}
              x2={getX(hoverIndex)}
              y2={height - paddingBottom}
              stroke="rgba(26, 117, 255, 0.35)"
              strokeWidth="1.2"
            />
            {activeVar === 'generation' ? (
              <>
                <circle cx={getX(hoverIndex)} cy={getY(getValue(data[hoverIndex], true))} r="3.5" fill={forecastColor} />
                <circle cx={getX(hoverIndex)} cy={getY(getValue(data[hoverIndex], false))} r="3.5" fill={actualColor} />
              </>
            ) : (
              <circle 
                cx={getX(hoverIndex)} 
                cy={getY(getValue(data[hoverIndex], true))} 
                r="4" 
                fill={activeVar === 'temp' ? '#ff3b30' : forecastColor} 
              />
            )}
          </g>
        )}
      </svg>

      {/* Floating tooltip */}
      {hoverIndex !== null && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            padding: '6px 10px',
            fontSize: '10px',
            zIndex: 15,
            pointerEvents: 'none',
            border: '1px solid rgba(26, 117, 255, 0.25)',
            background: 'rgba(3, 8, 16, 0.94)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            width: '120px',
            borderRadius: '4px'
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2px', fontWeight: 'bold' }}>
            시간: {data[hoverIndex].time}
          </div>
          {activeVar === 'generation' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: forecastColor }}>
                <span>예측량:</span>
                <span className="numeric" style={{ fontWeight: 'bold' }}>{data[hoverIndex].forecast} {unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: actualColor }}>
                <span>실측량:</span>
                <span className="numeric" style={{ fontWeight: 'bold' }}>{data[hoverIndex].actual} {unit}</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: activeVar === 'temp' ? '#ff3b30' : forecastColor }}>
              <span>{getVarName()}:</span>
              <span className="numeric" style={{ fontWeight: 'bold' }}>
                {getValue(data[hoverIndex])} {unit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Custom SVG bar chart for Medium/Long Term Trends with dynamic width and margins
 */
export function TrendChart({ data = [], type = 'solar', viewType = 'medium' }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(500);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 50) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (data.length === 0) return <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', padding: '15px' }}>데이터가 없습니다.</div>;

  const paddingLeft = 45; // Increased padding to prevent Y-axis text cut-off
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;
  const height = 110;
  const marginX = 22; // Safe side margin to group columns gracefully away from borders

  const maxForecast = Math.max(...data.map(d => d.forecast));
  const maxActual = Math.max(...data.map(d => d.actual));
  const maxValue = Math.max(1, Math.ceil(Math.max(maxForecast, maxActual) * 1.15));

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Position calculation with side margins
  const getX = (index) => paddingLeft + marginX + (index / (data.length - 1)) * (chartWidth - 2 * marginX);
  const getY = (val) => height - paddingBottom - (val / maxValue) * chartHeight;

  const accentColor = type === 'solar' ? '#ff7a00' : '#0c8';

  const gridLevels = 2;
  const gridLines = Array.from({ length: gridLevels + 1 }, (_, i) => {
    const val = Math.round((maxValue / gridLevels) * i);
    return { y: getY(val), label: val };
  });

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 6}
              y={line.y + 3}
              fill="rgba(255, 255, 255, 0.45)"
              fontSize="8.5"
              textAnchor="end"
              className="numeric"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* Grouped Columns with optimized thickness and gaps */}
        {data.map((item, idx) => {
          const x = getX(idx);
          const barWidth = viewType === 'long' ? 8 : 14; // Thicker bars for better visual presence
          const yForecast = getY(item.forecast);
          const yActual = getY(item.actual);
          const zeroY = height - paddingBottom;
          
          return (
            <g key={idx}>
              {/* Forecast (Blue) - aligned to the left of x */}
              <rect
                x={x - barWidth}
                y={yForecast}
                width={barWidth}
                height={Math.max(1, zeroY - yForecast)}
                fill="rgba(26, 117, 255, 0.45)"
                stroke="rgba(26, 117, 255, 0.7)"
                strokeWidth="0.8"
                rx="1"
              />
              {/* Actual (Orange/Green) - aligned to the right of x */}
              <rect
                x={x}
                y={yActual}
                width={barWidth}
                height={Math.max(1, zeroY - yActual)}
                fill={type === 'solar' ? 'rgba(255, 122, 0, 0.45)' : 'rgba(0, 204, 136, 0.45)'}
                stroke={accentColor}
                strokeWidth="0.8"
                rx="1"
              />
            </g>
          );
        })}

        {/* X labels */}
        {data.map((item, idx) => {
          if (viewType === 'medium' && idx % 2 !== 0) return null;
          return (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 4}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="8.5"
              textAnchor="middle"
            >
              {item.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
