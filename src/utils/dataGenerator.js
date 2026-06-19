/**
 * ENERMICS Solar & Wind Simulation Core
 * Mathematical models simulating realistic weather and energy generation.
 */

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getSolarTempLoss(moduleTemp) {
  if (moduleTemp <= 25) return 1.0;
  const excessTemp = moduleTemp - 25;
  const lossFraction = excessTemp * 0.004; // 0.4% loss per °C
  return Math.max(0.6, 1.0 - lossFraction);
}

function getWindTurbinePower(windSpeed) {
  const cutIn = 3.0;
  const ratedSpeed = 12.0;
  const cutOut = 25.0;
  const ratedPower = 2000; // kW

  if (windSpeed < cutIn || windSpeed > cutOut) {
    return 0;
  }
  
  if (windSpeed >= ratedSpeed) {
    return ratedPower;
  }

  const ratio = (windSpeed - cutIn) / (ratedSpeed - cutIn);
  const power = ratedPower * Math.pow(ratio, 3);
  return Math.max(0, power);
}

export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const SCENARIOS = {
  sunny: {
    name: '맑음 (맑은 날)',
    desc: '태양광 발전 최적화. 바람은 강하게 불어 풍성한 발전.',
    solarIrradianceBase: 850,
    solarTempBase: 22,
    windSpeedBase: 10.5,
    humidityBase: 35
  },
  cloudy: {
    name: '흐림 / 비',
    desc: '구름으로 인한 태양광 저하. 바람이 세차게 불어 우수한 발전.',
    solarIrradianceBase: 180,
    solarTempBase: 16,
    windSpeedBase: 11.5,
    humidityBase: 85
  },
  storm: {
    name: '태풍 / 폭풍우',
    desc: '폭풍우 상태. 풍력 터빈 안전 컷아웃(임계값 초과) 작동 및 태양광 거의 없음.',
    solarIrradianceBase: 40,
    solarTempBase: 15,
    windSpeedBase: 26.5,
    humidityBase: 95
  },
  heatwave: {
    name: '폭염 (극한 고온)',
    desc: '일사량은 최대이나 고온으로 인해 태양광 모듈 효율 저하 발생.',
    solarIrradianceBase: 980,
    solarTempBase: 36,
    windSpeedBase: 1.8,
    humidityBase: 50
  }
};

export function getSolarRealtimeStats(scenarioKey, hour = 13) {
  const sc = SCENARIOS[scenarioKey] || SCENARIOS.sunny;
  const isDaylight = hour >= 6 && hour <= 19;
  const solarAngle = isDaylight ? Math.sin((hour - 6) / 13 * Math.PI) : 0;
  
  const horizontalIrradiance = Math.round(sc.solarIrradianceBase * solarAngle);
  const inclinedIrradiance = Math.round(horizontalIrradiance * 1.15);
  
  const airTemp = sc.solarTempBase + (solarAngle * 5) + (Math.random() * 1.2 - 0.6);
  const moduleTemp = airTemp + (solarAngle * (scenarioKey === 'heatwave' ? 32 : 25)) + (Math.random() * 2 - 1);
  
  const tempLoss = getSolarTempLoss(moduleTemp);
  const maxCapacity = 98.4; // Solaseado exact capacity is 98.4 MW
  const baseGen = (inclinedIrradiance / 1000) * maxCapacity * tempLoss;
  const generation = isDaylight ? Math.max(0, Math.min(maxCapacity, baseGen)) : 0.0;
  
  const kmaTemp = airTemp + (Math.random() * 1.5 - 0.7);
  const kmaModuleTemp = moduleTemp - (Math.random() * 2);
  const kmaIrradiance = Math.max(0, horizontalIrradiance + (Math.random() * 40 - 20));
  const humidity = Math.max(10, Math.min(100, sc.humidityBase + (Math.random() * 6 - 3)));
  const windSpeed = Math.max(0.1, sc.windSpeedBase + (Math.random() * 1.5 - 0.7));
  
  return {
    generation: parseFloat(generation.toFixed(2)),
    airTemp: parseFloat(airTemp.toFixed(1)),
    moduleTemp: parseFloat(moduleTemp.toFixed(1)),
    horizontalIrradiance: parseFloat(horizontalIrradiance.toFixed(1)),
    inclinedIrradiance: parseFloat(inclinedIrradiance.toFixed(1)),
    kma: {
      temp: parseFloat(kmaTemp.toFixed(1)),
      moduleTemp: parseFloat(kmaModuleTemp.toFixed(1)),
      irradiance: parseFloat(kmaIrradiance.toFixed(1)),
      humidity: Math.round(humidity),
      windDir: windSpeed > 4 ? 'WNW' : 'WSW',
      windSpeed: parseFloat(windSpeed.toFixed(1))
    }
  };
}

export function getWindRealtimeStats(scenarioKey) {
  const sc = SCENARIOS[scenarioKey] || SCENARIOS.sunny;
  const turbines = [];
  let totalGenerationkW = 0;
  
  // 20 Turbines in Yeongam
  for (let i = 1; i <= 20; i++) {
    let windOffset = Math.sin(i * 1.5) * 0.8;
    if (scenarioKey === 'storm') {
      windOffset = Math.sin(i * 2.1) * 3.2;
    }
    const turbineWind = Math.max(0.0, sc.windSpeedBase + windOffset + (Math.random() * 1.0 - 0.5));
    const power = getWindTurbinePower(turbineWind);
    totalGenerationkW += power;
    
    const hubTemp = sc.solarTempBase - 3 + (Math.random() * 1.0 - 0.5);
    const nacelleTemp = hubTemp + (power / 500) * 4 + (Math.random() * 0.8 - 0.4);
    
    // Only return first 6 to draw on UI, but total calculation is for all 20 turbines
    if (i <= 6) {
      turbines.push({
        id: `${i}호기`,
        generation: parseFloat((power).toFixed(1)),
        windSpeed: parseFloat(turbineWind.toFixed(1)),
        windDir: scenarioKey === 'storm' ? 'NNE' : 'NW',
        hubTemp: parseFloat(hubTemp.toFixed(1)),
        nacelleTemp: parseFloat(nacelleTemp.toFixed(1))
      });
    }
  }
  
  return {
    turbines,
    totalGeneration: parseFloat((totalGenerationkW / 1000).toFixed(2)) // Convert to MW
  };
}

export function getForecastData(plantType, scenarioKey) {
  const sc = SCENARIOS[scenarioKey] || SCENARIOS.sunny;
  const shortTerm = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < 24; i++) {
    const forecastHour = (currentHour + i) % 24;
    const hourLabel = `${String(forecastHour).padStart(2, '0')}:00`;
    const actualAvailable = i === 0;
    
    let genForecast = 0;
    let genActual = 0;
    
    // Core physical parameters
    let temp = sc.solarTempBase + Math.sin((forecastHour - 6) / 12 * Math.PI) * 4;
    let rain = 0;
    if (scenarioKey === 'cloudy') {
      rain = Math.max(0, Math.sin(i * 0.8) * 1.5 + 0.8);
    } else if (scenarioKey === 'storm') {
      rain = Math.max(0, Math.sin(i * 1.2) * 8 + 8.5);
    }
    
    // Solar variables
    let horizontalRad = 0;
    let inclinedRad = 0;
    let panelTemp = 0;

    // Wind variables
    let windSpeed80m = 0;
    let windSpeed10m = 0;

    if (plantType === 'solar') {
      const isDay = forecastHour >= 6 && forecastHour <= 19;
      const angle = isDay ? Math.sin((forecastHour - 6) / 13 * Math.PI) : 0;
      
      horizontalRad = Math.round(sc.solarIrradianceBase * angle);
      inclinedRad = Math.round(horizontalRad * 1.15);
      
      panelTemp = temp + angle * (scenarioKey === 'heatwave' ? 32 : 21);
      const tempLoss = getSolarTempLoss(panelTemp);
      const maxCapacity = 98.4;
      
      genForecast = parseFloat(( (inclinedRad / 1000) * maxCapacity * tempLoss ).toFixed(2));
      const noise = 1 + (Math.sin(i * 1.9) * (scenarioKey === 'cloudy' ? 0.35 : 0.08));
      genActual = parseFloat(Math.max(0, genForecast * noise).toFixed(2));
      
      if (!isDay) {
        horizontalRad = 0;
        inclinedRad = 0;
        panelTemp = temp;
        genForecast = 0;
        genActual = 0;
      }
    } else {
      // Wind
      const cycle = Math.sin(i * 0.4) * (scenarioKey === 'storm' ? 4.5 : 1.8);
      windSpeed80m = parseFloat(Math.max(0.2, sc.windSpeedBase + cycle + Math.sin(i * 0.08) * 1.2).toFixed(1));
      windSpeed10m = parseFloat((windSpeed80m * 0.75).toFixed(1)); // 10m is lower
      
      // 20 Turbines in Yeongam
      const tPowerForecast = getWindTurbinePower(windSpeed80m) * 20 / 1000;
      genForecast = parseFloat(tPowerForecast.toFixed(2));
      
      const actualWind = Math.max(0, windSpeed80m + (Math.sin(i * 2.7) * 0.8));
      genActual = parseFloat((getWindTurbinePower(actualWind) * 20 / 1000).toFixed(2));
    }
    
    shortTerm.push({
      time: hourLabel,
      forecast: genForecast,
      actual: actualAvailable ? genActual : null,
      actualAvailable,
      
      // Solar variables
      horizontalRad,
      inclinedRad,
      panelTemp: parseFloat(panelTemp.toFixed(1)),
      
      // Wind variables
      windSpeed80m,
      windSpeed10m,
      
      // Shared variables
      temp: parseFloat(temp.toFixed(1)),
      rain: parseFloat(rain.toFixed(1))
    });
  }
  
  // 10 Days medium term
  const mediumTerm = [];
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayLabel = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}(${days[d.getDay()]})`;
    
    let avgGenForecast = 0;
    let avgGenActual = 0;
    
    const seed = scenarioKey.charCodeAt(0) + i;
    const rand = seededRandom(seed);
    
    if (plantType === 'solar') {
      const weatherMult = scenarioKey === 'sunny' ? 0.95 : scenarioKey === 'heatwave' ? 0.85 : scenarioKey === 'cloudy' ? 0.28 : 0.08;
      avgGenForecast = 35 + (rand * 15) * weatherMult;
      avgGenActual = avgGenForecast + (seededRandom(seed + 5) * 4 - 2);
    } else {
      let weatherMult = 0.25;
      let baseVal = 8.0;
      let randScale = 12.0;

      if (scenarioKey === 'sunny') {
        baseVal = 20.0;
        randScale = 10.0;
        weatherMult = 1.0;
      } else if (scenarioKey === 'cloudy') {
        baseVal = 24.0;
        randScale = 8.0;
        weatherMult = 1.0;
      } else if (scenarioKey === 'storm') {
        baseVal = 12.5;
        randScale = 0.0;
        weatherMult = 0.0;
      } else if (scenarioKey === 'heatwave') {
        baseVal = 1.5;
        randScale = 2.0;
        weatherMult = 1.0;
      }

      avgGenForecast = baseVal + (rand * randScale) * weatherMult;
      if (scenarioKey === 'storm') {
        avgGenForecast = 12.5;
        avgGenActual = 3.2; // cutouts
      } else {
        avgGenActual = avgGenForecast + (seededRandom(seed + 5) * 1.5 - 0.7);
      }
    }
    
    mediumTerm.push({
      time: dayLabel,
      forecast: parseFloat(Math.max(0, avgGenForecast).toFixed(1)),
      actual: i === 0 ? parseFloat(Math.max(0, avgGenActual).toFixed(1)) : null,
      actualAvailable: i === 0
    });
  }
  
  // 12 Months long term
  const longTerm = [];
  const currentMonthNum = today.getMonth();
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  for (let i = 0; i < 12; i++) {
    const mIndex = (currentMonthNum + i) % 12;
    const monthLabel = monthNames[mIndex];
    
    let forecastMWh = 0;
    let actualMWh = 0;
    
    if (plantType === 'solar') {
      const seasonalSolar = 0.4 + Math.sin((mIndex - 1) / 12 * Math.PI) * 0.6;
      forecastMWh = 12000 * seasonalSolar + (Math.sin(i * 1.1) * 800);
      actualMWh = forecastMWh + (Math.sin(i * 3.5) * 400 - 200);
    } else {
      const seasonalWind = 0.5 + Math.cos((mIndex - 1) / 12 * Math.PI * 2) * 0.5;
      forecastMWh = 18000 * seasonalWind + (Math.sin(i * 1.5) * 1200);
      actualMWh = forecastMWh + (Math.sin(i * 4.2) * 800 - 400);
    }
    
    longTerm.push({
      time: monthLabel,
      forecast: Math.round(Math.max(0, forecastMWh)),
      actual: i === 0 ? Math.round(Math.max(0, actualMWh)) : null,
      actualAvailable: i === 0
    });
  }
  
  return {
    shortTerm,
    mediumTerm,
    longTerm
  };
}
