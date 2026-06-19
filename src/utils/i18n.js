/**
 * ENERMICS Internationalization (i18n) Dictionary
 * Supported Languages: ko (Korean), en (English), vi (Vietnamese)
 */

export const TRANSLATIONS = {
  ko: {
    brandSub: 'Environment and Energy Meteorological Information Convergence Solution',
    brandDesc: '신재생에너지 생산성 예측 솔루션',
    aiStatus: 'AI 예측 보정망 가동 중',
    solarTab: '솔라시도 태양광',
    windTab: '영암 풍력발전',
    gisTitle: '발전소 GIS 실좌표 관측 지점 (MapLibre WebGL)',
    radarTitle: '기상 & 위성 융합 영상 분석',
    radarTitleWind: '풍속 벡터 & 기상 분석 영상',
    dssTitle: 'AI 의사결정 제언 패널 (DSS)',
    dssConfidence: '예측 신뢰도',
    obsTitle: '실시간 관측 및 KMA 정보',
    obsUpdate: '연동',
    genLabel: '현재 발전량',
    tempLabel: '대기 온도',
    panelTempLabel: '패널 온도',
    horizIrradiance: '수평면 일사량',
    inclinedIrradiance: '패널면 일사량',
    kmaSatellite: '기상청 기상 위성 정보',
    kmaTemp: '대기 기온',
    kmaPanelTemp: '예측 패널 온도',
    kmaIrradiance: '기상청 일사량',
    humidityLabel: '상대 습도',
    windSpeedLabel: '실시간 풍속',
    gridFreq: '계통 주파수',
    convEff: '전력 변환 효율',
    shortTermTitle: '기상 & 발전량 예측 정보 (단기)',
    mediumTermTitle: '기상 & 발전량 예측 정보 (중기 - 일별)',
    longTermTitle: '기상 & 발전량 예측 정보 (장기 - 월별)',
    
    // Categories
    infrared: '적외영상',
    irradiance: '일사량 AI',
    groundtemp: '지면온도',
    radar: '강수영역',
    lightning: '낙뢰영상',
    windflow: '풍속(80m) 정보',
    
    // Wind
    totalGenLabel: '총 출력',
    scadaTitle: '호기별 실시간 관측 (SCADA)',
    outTemp: '외기',
    inTemp: '내기',
    cutout: '제어 컷아웃',
    
    // Chart Toggles
    chartGen: '발전량',
    chartHoriz: '수평면일사량',
    chartIncl: '패널면일사량',
    chartPanel: '패널온도',
    chartTemp: '기온',
    chartRain: '강수량',
    chartWind80m: '풍속(80m)',
    chartWind10m: '풍속(10m)',
    
    // DSS Status
    dssNormal: '정상 작동 중',
    dssHot: '패널 고온 효율 손실 발생',
    dssFluctuate: '일사량 변동성 감지',
    dssStorm: '폭풍우에 따른 발전 출력 단절',
    dssWindNormal: '풍력 발전 정상 운전',
    dssWindStorm: '강풍에 따른 터빈 컷아웃 경보',
    dssWindCalm: '풍속 부족 발전 대기 상태',
    
    // Map Details & Popups
    solarName: '솔라시도 태양광 발전소',
    solarLoc: '전라남도 해남군 산이면 상공리 1165',
    solarCap: '98.4 MW',
    solarEss: '306.4 MWh',
    solarArea: '1,580,000 ㎡ (약 48만평)',
    solarDesc: '국내 최대 규모 태양광 및 ESS 복합 에너지 단지.',
    windName: '영암 풍력 발전소',
    windLoc: '전라남도 영암군 금정면 연소리 산340',
    windCap: '40.0 MW (2.0 MW × 20기)',
    windEss: '없음 (계통 연계형)',
    windArea: '약 120,000 ㎡',
    windDesc: '영암 활성산 일대의 우수한 바람 자원을 활용하여 조성된 친환경 풍력 발전단지.',
    addressLabel: '주소',
    capacityLabel: '설비 용량',
    essLabel: 'ESS 연계',
    featureLabel: '특징',
    coordsLabel: '좌표',
    areaLabel: '면적',
    popupCapacity: '용량',

    // AnimatedRadarMap HUD & Controls
    timelineSync: '타임라인 동기화 중...',
    liveLoop: '실시간 루프 중',
    paused: '일시정지',
    imageInfo: '영상 정보',

    // Weather cycling badge
    weatherCycleBadge: '현재 기상 상태',
    weatherCyclePeriod: '데이터 고정',

    // Dashboard UI Additions
    kmaSync: '연동',
    solarObsStation: '솔라시도 관측소 수치',
    windDirLabel: '풍향',
    turbineCutOut: '제어 컷아웃',
    inverterEff: '계통 주파수: 60.02 Hz | 전력 변환 효율: 98.4%',
    resetView: '전체 영역 보기'
  },
  en: {
    brandSub: 'Environment and Energy Meteorological Information Convergence Solution',
    brandDesc: 'Renewable Generation Forecasting Solution',
    aiStatus: 'AI Prediction Network Active',
    solarTab: 'Solaseado Solar',
    windTab: 'Yeongam Wind',
    gisTitle: 'Plant GIS Coordinates Map (MapLibre WebGL)',
    radarTitle: 'Weather & Satellite Fusion Imagery',
    radarTitleWind: 'Wind Vector & Weather Imagery',
    dssTitle: 'AI Decision Support Panel (DSS)',
    dssConfidence: 'Accuracy',
    obsTitle: 'Realtime Observation & KMA Info',
    obsUpdate: 'Sync',
    genLabel: 'Active Generation',
    tempLabel: 'Ambient Temp',
    panelTempLabel: 'Panel Temp',
    horizIrradiance: 'Horiz. Irradiance',
    inclinedIrradiance: 'Incl. Irradiance',
    kmaSatellite: 'KMA Satellite Info',
    kmaTemp: 'KMA Air Temp',
    kmaPanelTemp: 'Est. Panel Temp',
    kmaIrradiance: 'KMA Irradiance',
    humidityLabel: 'Humidity',
    windSpeedLabel: 'Wind Speed',
    gridFreq: 'Grid Frequency',
    convEff: 'Inverter Efficiency',
    shortTermTitle: 'Weather & Generation Forecast (Short)',
    mediumTermTitle: 'Weather & Generation Forecast (Medium - Daily)',
    longTermTitle: 'Weather & Generation Forecast (Long - Monthly)',
    
    // Categories
    infrared: 'Infrared',
    irradiance: 'Solar AI',
    groundtemp: 'Ground Temp',
    radar: 'Radar Scan',
    lightning: 'Lightning',
    windflow: 'Wind (80m)',
    
    // Wind
    totalGenLabel: 'Total Output',
    scadaTitle: 'Turbine SCADA Live Matrix',
    outTemp: 'Out',
    inTemp: 'In',
    cutout: 'Cut-out',
    
    // Chart Toggles
    chartGen: 'Power',
    chartHoriz: 'Horiz. Rad',
    chartIncl: 'Incl. Rad',
    chartPanel: 'Panel Temp',
    chartTemp: 'Air Temp',
    chartRain: 'Rainfall',
    chartWind80m: 'Wind(80m)',
    chartWind10m: 'Wind(10m)',
    
    // DSS Status
    dssNormal: 'Normal Operation',
    dssHot: 'Panel Overheating Loss',
    dssFluctuate: 'Radiation Fluctuation',
    dssStorm: 'Power Outage Alert (Storm)',
    dssWindNormal: 'Turbine Normal Operation',
    dssWindStorm: 'High Wind Cut-out Alert',
    dssWindCalm: 'Low Wind Standby Mode',
    
    // Map Details & Popups
    solarName: 'Solaseado Solar Power Plant',
    solarLoc: '1165 Sanggong-ri, Sani-myeon, Haenam-gun, Jeollanam-do',
    solarCap: '98.4 MW',
    solarEss: '306.4 MWh',
    solarArea: '1,580,000 ㎡ (approx. 400 acres)',
    solarDesc: "Korea's largest combined solar power and ESS energy complex.",
    windName: 'Yeongam Wind Power Plant',
    windLoc: 'San 340, Yeonso-ri, Geumjeong-myeon, Yeongam-gun, Jeollanam-do',
    windCap: '40.0 MW (2.0 MW × 20 units)',
    windEss: 'None (Grid-connected)',
    windArea: 'approx. 120,000 ㎡',
    windDesc: 'Eco-friendly wind farm built on Hwaseongsan Mountain using rich wind resources.',
    addressLabel: 'Address',
    capacityLabel: 'Capacity',
    essLabel: 'ESS',
    featureLabel: 'Features',
    coordsLabel: 'Coords',
    areaLabel: 'Area',
    popupCapacity: 'Capacity',

    // AnimatedRadarMap HUD & Controls
    timelineSync: 'Syncing timeline...',
    liveLoop: 'Live Looping',
    paused: 'Paused',
    imageInfo: 'Imagery Info',

    // Weather cycling badge
    weatherCycleBadge: 'Current Weather State',
    weatherCyclePeriod: 'Stable Data',

    // Dashboard UI Additions
    kmaSync: 'Sync',
    solarObsStation: 'Solaseado Solar Telemetry',
    windDirLabel: 'Wind Dir',
    turbineCutOut: 'Safety Cut-out',
    inverterEff: 'Grid Freq: 60.02 Hz | Inverter Eff: 98.4%',
    resetView: 'Reset Map View'
  },
  vi: {
    brandSub: 'Environment and Energy Meteorological Information Convergence Solution',
    brandDesc: 'Giải pháp dự báo sản lượng năng lượng tái tạo',
    aiStatus: 'Mạng lưới hiệu chuẩn AI Active',
    solarTab: 'Điện mặt trời Solaseado',
    windTab: 'Điện gió Yeongam',
    gisTitle: 'Bản đồ Tọa độ GIS Nhà máy (MapLibre WebGL)',
    radarTitle: 'Phân tích tích hợp khí tượng & vệ tinh',
    radarTitleWind: 'Trực quan hóa vector gió & khí tượng',
    dssTitle: 'Bảng Hỗ trợ Quyết định AI (DSS)',
    dssConfidence: 'Độ tin cậy',
    obsTitle: 'Quan trắc thời gian thực & KMA',
    obsUpdate: 'Đồng bộ',
    genLabel: 'Sản lượng hiện tại',
    tempLabel: 'Nhiệt độ khí quyển',
    panelTempLabel: 'Nhiệt độ tấm pin',
    horizIrradiance: 'Bức xạ mặt phẳng ngang',
    inclinedIrradiance: 'Bức xạ mặt phẳng nghiêng',
    kmaSatellite: 'Thông tin vệ tinh khí tượng KMA',
    kmaTemp: 'Nhiệt độ khí KMA',
    kmaPanelTemp: 'Nhiệt độ tấm dự kiến',
    kmaIrradiance: 'Bức xạ khí tượng KMA',
    humidityLabel: 'Độ ẩm tương đối',
    windSpeedLabel: 'Tốc độ gió',
    gridFreq: 'Tần số lưới điện',
    convEff: 'Hiệu suất biến tần',
    shortTermTitle: 'Dự báo thời tiết & sản lượng (Ngắn hạn)',
    mediumTermTitle: 'Dự báo thời tiết & sản lượng (Trung hạn - Hàng ngày)',
    longTermTitle: 'Dự báo thời tiết & sản lượng (Dài hạn - Hàng tháng)',
    
    // Categories
    infrared: 'Ảnh hồng ngoại',
    irradiance: 'Bức xạ AI',
    groundtemp: 'Nhiệt độ đất',
    radar: 'Vùng mưa radar',
    lightning: 'Ảnh sét',
    windflow: 'Tốc độ gió (80m)',
    
    // Wind
    totalGenLabel: 'Tổng công suất',
    scadaTitle: 'Giám sát tua-bin thời gian thực (SCADA)',
    outTemp: 'Nhiệt ngoài',
    inTemp: 'Nhiệt trong',
    cutout: 'Ngắt an toàn',
    
    // Chart Toggles
    chartGen: 'Sản lượng',
    chartHoriz: 'Bức xạ ngang',
    chartIncl: 'Bức xạ nghiêng',
    chartPanel: 'Nhiệt tấm pin',
    chartTemp: 'Nhiệt độ khí',
    chartRain: 'Lượng mưa',
    chartWind80m: 'Gió (80m)',
    chartWind10m: 'Gió (10m)',
    
    // DSS Status
    dssNormal: 'Vận hành bình thường',
    dssHot: 'Hiệu suất giảm do nhiệt độ tấm cao',
    dssFluctuate: 'Bức xạ biến động mạnh',
    dssStorm: 'Cắt tải do bão/thiên tai',
    dssWindNormal: 'Tua-bin vận hành bình thường',
    dssWindStorm: 'Cảnh báo ngắt do gió bão lớn',
    dssWindCalm: 'Chế độ chờ do thiếu gió',
    
    // Map Details & Popups
    solarName: 'Nhà máy điện mặt trời Solaseado',
    solarLoc: '1165 Sanggong-ri, Sani-myeon, Haenam-gun, Jeollanam-do',
    solarCap: '98.4 MW',
    solarEss: '306.4 MWh',
    solarArea: '1.580.000 ㎡ (khoảng 480.000 pyeong)',
    solarDesc: 'Tổ hợp năng lượng tích hợp điện mặt trời và ESS lớn nhất tại Hàn Quốc.',
    windName: 'Nhà máy điện gió Yeongam',
    windLoc: 'San 340, Yeonso-ri, Geumjeong-myeon, Yeongam-gun, Jeollanam-do',
    windCap: '40.0 MW (2.0 MW × 20 tổ máy)',
    windEss: 'Không (Kết nối lưới điện)',
    windArea: 'khoảng 120.000 ㎡',
    windDesc: 'Trang trại điện gió thân thiện với môi trường được xây dựng trên núi Hwaseongsan.',
    addressLabel: 'Địa chỉ',
    capacityLabel: 'Công suất thiết bị',
    essLabel: 'Liên kết ESS',
    featureLabel: 'Đặc trưng',
    coordsLabel: 'Tọa độ',
    areaLabel: 'Diện tích',
    popupCapacity: 'C.suất',

    // AnimatedRadarMap HUD & Controls
    timelineSync: 'Đang đồng bộ dòng thời gian...',
    liveLoop: 'Vòng lặp thời gian thực',
    paused: 'Tạm dừng',
    imageInfo: 'Thông tin hình ảnh',

    // Weather cycling badge
    weatherCycleBadge: 'Trạng thái thời tiết hiện tại',
    weatherCyclePeriod: 'Dữ liệu ổn định',

    // Dashboard UI Additions
    kmaSync: 'Đồng bộ',
    solarObsStation: 'Số liệu trạm quan trắc Solaseado',
    windDirLabel: 'Hướng gió',
    turbineCutOut: 'Ngắt an toàn',
    inverterEff: 'Tần số lưới: 60.02 Hz | Hiệu suất biến tần: 98.4%',
    resetView: 'Xem toàn bộ khu vực'
  }
};

/**
 * Returns dynamic decision recommendations in selected language
 */
export function getLocalizedAdvices(plantType, scenario, stats, lang = 'ko') {
  const advicesDict = {
    ko: {
      solarHot: [
        `모듈 온도 상승(${stats.moduleTemp}℃)으로 인해 발전 효율이 약 8.8% 저하 중입니다.`,
        '패널 온도를 낮추기 위해 11:30~13:00 냉각수 살수 시스템 작동을 권장합니다.',
        '송전 과전압 방지를 위해 ESS 충전 연계 모드 작동을 권장합니다.'
      ],
      solarFluctuate: [
        '구름 이동으로 인해 급격한 일사량 변동이 관측되고 있습니다.',
        'ESS 스케줄을 [방전 대기]에서 [충전 보존 및 주파수 제어] 모드로 전환하십시오.',
        '오후 강수 시작 예정이므로 발전량 하향 조정을 대비하십시오.'
      ],
      solarStorm: [
        '태풍 경보 발효 중. 현재 일사량이 극히 희박하여 태양광 출력이 소실되었습니다.',
        '폭우로 인한 인버터 룸 침수 감지 센서를 확인하시기 바랍니다.',
        '계통 연계 차단 밸브의 압력을 수동으로 확인하십시오.'
      ],
      solarNormal: [
        `현재 일사량(${stats.inclinedIrradiance} W/㎡)이 매우 풍부하고 패널 온도가 정상 범주(${stats.moduleTemp}℃) 내에 있습니다.`,
        'ESS 예약 방전 스케줄링(18:00 송전 시작)이 유효합니다. 변동 없이 유지하십시오.',
        '보정 알고리즘 피드백 루프 활성화. 예측 오차율 1.5% 미만 유지 중입니다.'
      ],
      windStorm: [
        '80m 허브 높이 풍속이 26.5m/s를 초과하여 임계치(25m/s)를 돌파했습니다.',
        '물리 파손 및 기어박스 손상 방지를 위해 5~10호기의 [블레이드 페더링 정지] 작동 중.',
        '돌풍 풍향 변경(NW -> NNE)에 따른 요 제어 신호를 재정렬하십시오.'
      ],
      windCalm: [
        '무풍 현상으로 평균 풍속이 컷인(3m/s) 기준 미만입니다.',
        '터빈 블레이드가 대기 모드로 전환되었습니다. 기기 자체 대기 전력 소모를 최소화합니다.',
        '송전망 계통 전압 유지를 위해 대기 송전 모드 활성화를 대기하십시오.'
      ],
      windNormal: [
        '평균 풍속이 정격 발전 구간 내에 있어 정상적으로 발전을 수행 중입니다.',
        '계통 전압 및 주파수 변동률이 0.1Hz 이하로 양호합니다.',
        '발전 예측 알고리즘이 예보 대비 오차 3.2% 범위에서 연동 중입니다.'
      ]
    },
    en: {
      solarHot: [
        `Module temp elevated (${stats.moduleTemp}°C), reducing efficiency by approx 8.8%.`,
        'Recommended operating water spray cooling loop from 11:30 to 13:00.',
        'Engage ESS charge coupling mode to prevent transmission overvoltage.'
      ],
      solarFluctuate: [
        'Severe irradiance fluctuation observed due to cloud passings.',
        'Shift ESS schedule from [Discharge Standby] to [Charge Preserved & Frequency Control].',
        'Prepare for generation scale down due to forecasted afternoon rain.'
      ],
      solarStorm: [
        'Typhoon Warning Active. Solar output lost due to extreme cloud cover.',
        'Verify flood detection sensors in the inverter facility room immediately.',
        'Manually check grid connection valve pressure levels.'
      ],
      solarNormal: [
        `Optimal radiation (${stats.inclinedIrradiance} W/m²) and panels temp (${stats.moduleTemp}°C) satisfied.`,
        'ESS scheduled discharge (18:00 transmission) is valid. Keep current schedule.',
        'Feedback calibration loop active. Prediction error remains under 1.5%.'
      ],
      windStorm: [
        'Wind speed at 80m hub exceeds 26.5m/s, passing the safety cutoff (25m/s).',
        'Blade feathering and yaw braking active on turbines 5-10 to prevent structural damage.',
        'Realign yaw signals in response to wind shift (NW -> NNE).'
      ],
      windCalm: [
        'Average wind speed is under cut-in threshold (3m/s) due to anticyclonic conditions.',
        'Blades switched to standby. Auxiliary self-consumption minimized.',
        'Await standby grid transmission command to maintain network voltage.'
      ],
      windNormal: [
        'Average wind speed is within rated range. Generating power normally.',
        'Grid voltage and frequency fluctuations remain stable under 0.1Hz.',
        'Generation forecast engine calibrated within 3.2% of actual telemetry.'
      ]
    },
    vi: {
      solarHot: [
        `Nhiệt độ tấm pin tăng cao (${stats.moduleTemp}°C), giảm khoảng 8.8% hiệu suất phát.`,
        'Khuyến nghị kích hoạt hệ thống làm mát phun nước từ 11:30 đến 13:00.',
        'Đề xuất vận hành chế độ nạp ESS để tránh quá áp đường truyền.'
      ],
      solarFluctuate: [
        'Phát hiện biến động bức xạ lớn do mây di chuyển liên tục.',
        'Chuyển lịch ESS từ [Chờ xả] sang [Bảo toàn nạp & Kiểm soát tần số].',
        'Dự báo có mưa chiều nay, hãy chuẩn bị cho việc giảm sản lượng phát.'
      ],
      solarStorm: [
        'Cảnh báo bão đang hoạt động. Bức xạ quá thấp khiến sản lượng điện mặt trời bằng 0.',
        'Kiểm tra ngay cảm biến phát hiện ngập nước tại phòng biến tần trung tâm.',
        'Kiểm tra thủ công áp suất của van ngắt kết nối lưới điện.'
      ],
      solarNormal: [
        `Bức xạ dồi dào (${stats.inclinedIrradiance} W/m²) và nhiệt tấm pin ổn định (${stats.moduleTemp}°C).`,
        'Lịch xả ESS đã đặt (bắt đầu truyền lúc 18:00) hợp lệ. Giữ nguyên lịch trình.',
        'Vòng phản hồi hiệu chuẩn hoạt động. Tỷ lệ sai số dự báo duy trì dưới 1.5%.'
      ],
      windStorm: [
        'Tốc độ gió ở độ cao 80m vượt quá 26.5m/s, vượt giới hạn ngắt an toàn (25m/s).',
        'Hệ thống xoay cánh pin an toàn hoạt động tại tua-bin 5-10 để chống gãy cánh.',
        'Căn chỉnh lại tín hiệu Yaw theo sự thay đổi hướng gió (NW -> NNE).'
      ],
      windCalm: [
        'Tốc độ gió trung bình dưới ngưỡng khởi động (3m/s) do áp cao tĩnh.',
        'Cánh tua-bin chuyển sang chế độ chờ. Giảm thiểu điện tự dùng của thiết bị.',
        'Chờ lệnh truyền tải dự phòng để duy trì điện áp lưới.'
      ],
      windNormal: [
        'Tốc độ gió trung bình nằm trong dải định mức. Đang phát điện bình thường.',
        'Điện áp lưới và độ biến động tần số ổn định dưới 0.1Hz.',
        'Thuật toán dự báo liên kết khớp trong phạm vi sai số 3.2%.'
      ]
    }
  };

  const currentAdvices = advicesDict[lang] || advicesDict.ko;

  if (plantType === 'solar') {
    if (scenario === 'heatwave' || stats.moduleTemp > 45) return currentAdvices.solarHot;
    if (scenario === 'cloudy' || stats.horizontalIrradiance < 200) return currentAdvices.solarFluctuate;
    if (scenario === 'storm') return currentAdvices.solarStorm;
    return currentAdvices.solarNormal;
  } else {
    if (scenario === 'storm') return currentAdvices.windStorm;
    if (scenario === 'heatwave') return currentAdvices.windCalm;
    return currentAdvices.windNormal;
  }
}
