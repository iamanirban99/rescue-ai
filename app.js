// Rescue AI - Indian Emergency Response Portal (NDMA & SDRF Engine)

// Global Application State
const state = {
  activeView: 'dashboard',
  isOffline: false,
  selectedShelterId: null,
  dispatches: [
    { id: 'SDRF-7041', name: 'Rohan Sharma', type: 'Trapped in Flood waters', location: 'Assam Valley, Sector 3 Relief Hub', responders: 'NDRF 1st Battalion (Assam)', status: 'En Route', severity: 'critical' },
    { id: 'SDRF-7042', name: 'Ananya Iyer', type: 'Severe Medical Aid Requirement', location: 'Wayanad, Camp Road Sector B', responders: 'Kerala Health SDRF Unit 4', status: 'Arrived', severity: 'high' },
    { id: 'SDRF-7043', name: 'Amit Patel', type: 'Food & Clean Water Crisis', location: 'Jodhpur, Sector C Drylands', responders: 'Civil Supply Helicopter Sortie 2', status: 'Dispatched', severity: 'medium' }
  ],
  
  // Localized Indian Relief Centers mapped to custom coordinates on our stylized SVG map
  shelters: [
    { id: 1, name: 'Guwahati NDRF Relocation Camp', area: 'Assam Plains', capacity: 1500, filled: 1240, status: 'open', x: 380, y: 190, phone: '0361-223344 (Assam SDRF)' },
    { id: 2, name: 'Cuttack Cyclone Relief Center', area: 'Odisha Coastal Belt', capacity: 2000, filled: 1980, status: 'open', x: 300, y: 280, phone: '0671-244556 (Odisha SDRF)' },
    { id: 3, name: 'Wayanad Disaster Relief Hub', area: 'Kerala Western Ghats', capacity: 800, filled: 780, status: 'open', x: 230, y: 440, phone: '0493-266778 (Kerala SDRF)' },
    { id: 4, name: 'Dehradun SDRF Mountain Headquarters', area: 'Uttarakhand Himalayan Belt', capacity: 1200, filled: 310, status: 'open', x: 240, y: 110, phone: '0135-277889 (U.K. SDRF)' },
    { id: 5, name: 'Patna Flood Relief Base', area: 'Bihar Ganges Plains', capacity: 1000, filled: 1000, status: 'full', x: 290, y: 180, phone: '0612-255667 (Bihar SDRF)' },
    { id: 6, name: 'Jodhpur Drought Resource Depot', area: 'Rajasthan Desert Belt', capacity: 500, filled: 120, status: 'open', x: 150, y: 190, phone: '0291-233445 (Rajasthan SDRF)' }
  ],

  // State-wise parameters for predictive modeling
  stateConfigs: {
    kerala: { name: 'Kerala', baseRainfall: 150, baseWind: 40, baseSeismic: 10, vulnerability: 'High danger of Monsoonal Landslides & Flooding.' },
    odisha: { name: 'Odisha', baseRainfall: 100, baseWind: 130, baseSeismic: 5, vulnerability: 'Severe vulnerability to Bay of Bengal Cyclones & Storm Surges.' },
    assam: { name: 'Assam', baseRainfall: 350, baseWind: 50, baseSeismic: 35, vulnerability: 'Extreme annual Flooding in Brahmaputra Valley & high seismic activity.' },
    bihar: { name: 'Bihar', baseRainfall: 220, baseWind: 40, baseSeismic: 20, vulnerability: 'Recurrent severe river flooding across Ganga plains.' },
    uttarakhand: { name: 'Uttarakhand', baseRainfall: 180, baseWind: 30, baseSeismic: 60, vulnerability: 'Extreme Risk of Landslides, Cloudbursts, & Seismic Zone V earthquakes.' },
    rajasthan: { name: 'Rajasthan', baseRainfall: 20, baseWind: 60, baseSeismic: 5, vulnerability: 'High vulnerability to Heatwaves, Droughts & water table depletion.' }
  },

  guides: {
    flood: {
      title: 'NDMA Monsoon Flood Survival Guide',
      actions: [
        { title: 'Relocate to Elevated Relief Camps', text: 'Evacuate immediately upon receipt of IMD alerts. Avoid wading through water to prevent snakebites and waterborne diseases.' },
        { title: 'Store Drinking Water in Clean Vessels', text: 'Floodwaters contaminate pipelines. Always use Halogen/Chlorine tablets before drinking local supply water.' },
        { title: 'Keep Livestock Untied', text: 'Untie cows, goats, and pets so they can swim to safety. Keep animal feed stored dry on elevated shelves.' },
        { title: 'Avoid Touching Flooded Power Lines', text: 'Alert electricity boards immediately to cut off supply in waterlogged sectors.' }
      ],
      checklist: [
        'Pack family ration dry bag (Chura, Gur, biscuits)',
        'Add chlorine water-purification drops/tablets',
        'Wrap identity documents (Aadhaar, Ration Card) in plastic sheets',
        'Store fully charged mobile power bank in waterproof bag',
        'Keep emergency whistle and flashlight ready'
      ]
    },
    cyclone: {
      title: 'Coastal Cyclone Survival Directives',
      actions: [
        { title: 'Move to Cyclone Relief Centers', text: 'In coastal areas, evacuate to concrete Multi-Purpose Cyclone Shelters if wind alerts exceed 90 km/h.' },
        { title: 'Prepare Indoor Safe Areas', text: 'Secure window shutters. Keep family members inside an interior windowless room during high winds.' },
        { title: 'Beware of the Storm Eye', text: 'If winds suddenly stop, do not leave shelter. This is the calm eye of the storm; severe destructive winds will resume shortly.' },
        { title: 'Switch off Gas Cylinders', text: 'Disconnect LPG regulators to prevent gas leaks and accidental fires during structural damage.' }
      ],
      checklist: [
        'Identify route to the nearest Cyclone Shelter',
        'Tie loose objects outside house or move them indoors',
        'Tape window glasses diagonally to prevent shattering',
        'Ensure matches, candles, and dry kerosene lamps are available',
        'Keep emergency cash and emergency medicine kit ready'
      ]
    },
    earthquake: {
      title: 'Himalayan Earthquake Drop-Cover-Hold SOP',
      actions: [
        { title: 'Drop, Cover, and Hold On', text: 'Get under a solid wooden table or bed frame. Hold onto its legs tightly until structural vibrations cease.' },
        { title: 'Avoid Staircases and Elevators', text: 'Stairwells are structurally vulnerable. Do not run or gather near balconies or outer walls.' },
        { title: 'Move to Open Ground', text: 'If outdoors, stay clear of electric posts, street lamps, brick walls, and concrete buildings.' },
        { title: 'Prepare for Aftershocks', text: 'Smaller tremors often follow. Stay prepared to vacate buildings between intervals.' }
      ],
      checklist: [
        'Place heavy shelves away from exit doorways',
        'Keep heavy boots and torches near beds',
        'Learn location of main electric switch and gas valves',
        'Anchor gas cylinders to solid walls using chains',
        'Identify local assembly points (parks, playgrounds)'
      ]
    },
    drought: {
      title: 'Heatwave & Drought Advisory (NDMA)',
      actions: [
        { title: 'Hydrate Regularly with ORS', text: 'Drink water even if you are not thirsty. Use ORS, Lassi, Lemon water, and buttermilk to prevent heat strokes.' },
        { title: 'Limit Sunlight Exposure (12 PM - 3 PM)', text: 'Avoid high physical exertion. Wear light, loose, breathable cotton clothes.' },
        { title: 'Collect and Reuse Greywater', text: 'Implement rainwater harvesting storage and divert domestic greywater to animal pools.' },
        { title: 'Protect Birds and Stray Animals', text: 'Place earthen pots with clean drinking water on balconies and shaded paths.' }
      ],
      checklist: [
        'Inspect household water valves for leaks',
        'Keep ORS (Oral Rehydration Salts) packets stocked',
        'Set up green shading screens over roofs/balconies',
        'Check warning indicators for Heat Exhaustion (dizziness, cramps)',
        'Insulate home doors to trap cold air'
      ]
    },
    accident: {
      title: 'Industrial & Road Emergency Guidelines',
      actions: [
        { title: 'Alert SDRF Control Room Immediately', text: 'Dial 112 or 1078 to report structural collapses, chemical leaks, or vehicle crashes.' },
        { title: 'Perform Initial Bleeding Control', text: 'Use clean cotton cloths to apply direct pressure to open wounds. Elevate injured limbs.' },
        { title: 'Do Not Move Spinal Victims', text: 'Keep victims lying flat. Do not force them to sit or walk unless there is an active threat of fire or explosion.' },
        { title: 'Evacuate Upwind from Gas Leaks', text: 'If chemical fumes are detected, move in the opposite direction of wind flow.' }
      ],
      checklist: [
        'Call 112 emergency response immediately',
        'Place roadside reflective warning markers',
        'Verify emergency vehicle access path is clear',
        'Apply sterile bandages from first-aid kit',
        'Ensure toxic areas are cordoned off'
      ]
    }
  }
};

// Clock Setup
function initClock() {
  const clockEl = document.getElementById('clock-display');
  setInterval(() => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString();
  }, 1000);
}

// Navigation Controller
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');
  const pageTitle = document.getElementById('page-title');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHash = item.getAttribute('href');
      const viewId = targetHash.replace('#', 'view-');

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      viewPanels.forEach(panel => panel.classList.remove('active'));
      const targetPanel = document.getElementById(viewId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      pageTitle.textContent = item.textContent.trim().split(' ').slice(1).join(' ');
      state.activeView = targetHash.replace('#', '');
      
      if (state.activeView === 'shelters') {
        renderSheltersMap();
      }
    });
  });

  document.getElementById('dashboard-sos-trigger').addEventListener('click', () => {
    document.getElementById('nav-sos').click();
  });
}

// Offline Cache Mode Simulator
function initOfflineMode() {
  const toggleBtn = document.getElementById('toggle-offline-btn');
  const offlineBanner = document.getElementById('offline-banner');
  const connDot = document.getElementById('connection-dot');
  const connText = document.getElementById('connection-text');

  const cachedOffline = localStorage.getItem('rescue_ai_offline') === 'true';
  if (cachedOffline) {
    setOfflineState(true);
  }

  toggleBtn.addEventListener('click', () => {
    setOfflineState(!state.isOffline);
  });

  function setOfflineState(active) {
    state.isOffline = active;
    localStorage.setItem('rescue_ai_offline', active);

    if (active) {
      offlineBanner.classList.remove('hidden');
      connDot.className = 'dot offline';
      connText.textContent = 'Offline Relief Cache Active';
      toggleBtn.textContent = 'Reconnect System';
      toggleBtn.className = 'btn btn-primary btn-sm';
    } else {
      offlineBanner.classList.add('hidden');
      connDot.className = 'dot online';
      connText.textContent = 'SDRF Server Online';
      toggleBtn.textContent = 'Simulate Offline Mode';
      toggleBtn.className = 'btn btn-secondary btn-sm';
    }
  }
}

// Survival Guides Controller
function initSurvivalGuides() {
  const tabs = document.querySelectorAll('.guide-tab');
  const playBtn = document.getElementById('play-guide-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGuide(tab.dataset.hazard);
    });
  });

  playBtn.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
      const activeTab = document.querySelector('.guide-tab.active');
      const hazard = activeTab.dataset.hazard;
      const guideData = state.guides[hazard];

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        playBtn.textContent = '🔊 Listen to Localized Audio Guide';
        return;
      }

      let readText = `${guideData.title}. Critical instructions from NDMA: `;
      guideData.actions.forEach((a, i) => {
        readText += `Point ${i + 1}: ${a.title}. ${a.text}. `;
      });

      const utterance = new SpeechSynthesisUtterance(readText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN'; // Indian accent support

      utterance.onend = () => {
        playBtn.textContent = '🔊 Listen to Localized Audio Guide';
      };

      playBtn.textContent = '⏹️ Stop Audio Readout';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech Synthesis API not supported in this browser version.');
    }
  });

  renderGuide('flood');
}

function renderGuide(hazard) {
  const guideData = state.guides[hazard];
  document.getElementById('guide-title').textContent = guideData.title;

  const actionsList = document.getElementById('guide-actions');
  actionsList.innerHTML = '';
  guideData.actions.forEach(act => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${act.title}</strong>${act.text}`;
    actionsList.appendChild(li);
  });

  const checklistContainer = document.getElementById('guide-checklist');
  checklistContainer.innerHTML = '';
  guideData.checklist.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'checklist-item';
    
    const checkboxId = `chk-${hazard}-${index}`;
    itemEl.innerHTML = `
      <input type="checkbox" id="${checkboxId}">
      <label for="${checkboxId}"><span>${item}</span></label>
    `;
    
    const input = itemEl.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        itemEl.classList.add('checked');
      } else {
        itemEl.classList.remove('checked');
      }
    });

    checklistContainer.appendChild(itemEl);
  });

  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.getElementById('play-guide-btn').textContent = '🔊 Listen to Localized Audio Guide';
  }
}

// Interactive Hazard & Risk Predictor Logic
function initRiskPredictor() {
  const stateSelect = document.getElementById('predict-state');
  const rainfallSlider = document.getElementById('param-rainfall');
  const windSlider = document.getElementById('param-wind');
  const seismicSlider = document.getElementById('param-seismic');

  stateSelect.addEventListener('change', () => {
    const stateVal = stateSelect.value;
    const config = state.stateConfigs[stateVal];
    
    // Set base sliders values matching typical state limits
    rainfallSlider.value = config.baseRainfall;
    windSlider.value = config.baseWind;
    seismicSlider.value = config.baseSeismic;

    updatePredictorDashboard();
  });

  // Attach input event listeners for real-time mathematical calculations
  [rainfallSlider, windSlider, seismicSlider].forEach(slider => {
    slider.addEventListener('input', updatePredictorDashboard);
  });

  // Initial trigger
  updatePredictorDashboard();
}

function updatePredictorDashboard() {
  const selectedState = document.getElementById('predict-state').value;
  const rainfall = parseFloat(document.getElementById('param-rainfall').value);
  const wind = parseFloat(document.getElementById('param-wind').value);
  const seismic = parseFloat(document.getElementById('param-seismic').value);

  // Update slider label readouts
  document.getElementById('label-rainfall').textContent = `${rainfall} mm`;
  document.getElementById('label-wind').textContent = `${wind} km/h`;
  document.getElementById('label-seismic').textContent = `${(seismic / 100).toFixed(2)} g`;

  // Risk Probability Formula simulating prediction model
  // Flood: rainfall dependent
  let pFlood = Math.round(Math.min((rainfall / 500) * 100, 100));
  // Cyclone: wind speed dependent
  let pCyclone = Math.round(Math.min((wind / 220) * 100, 100));
  // Landslide: rainfall + terrain slope (state factor) + seismic triggers
  let terrainFactor = (selectedState === 'uttarakhand') ? 35 : (selectedState === 'kerala') ? 20 : 5;
  let pLandslide = Math.round(Math.min(((rainfall / 450) * 50) + (seismic * 0.5) + terrainFactor, 100));
  // Seismic Zone scale
  let pSeismic = Math.round(Math.min((seismic / 75) * 100, 100));

  // Update Bars
  updateBar('prob-flood', pFlood);
  updateBar('prob-cyclone', pCyclone);
  updateBar('prob-landslide', pLandslide);
  updateBar('prob-seismic', pSeismic);

  // Calculate Overall Risk Category
  const maxRisk = Math.max(pFlood, pCyclone, pLandslide, pSeismic);
  const riskBadge = document.getElementById('risk-badge-result');
  const riskDesc = document.getElementById('risk-desc-result');
  const topAlert = document.getElementById('top-alert-banner');
  const alertsCount = document.getElementById('dash-alerts-count');

  if (maxRisk >= 75) {
    riskBadge.textContent = 'CRITICAL RED ALERT';
    riskBadge.className = 'risk-badge-display high';
    riskDesc.textContent = `Severe Threat detected: ${state.stateConfigs[selectedState].vulnerability} High likelihood of active hazard. NDRF evacuation recommended.`;
    
    // Sync top alert banner
    topAlert.textContent = `⚠️ RED ALERT: Severe Hazard Risk in ${state.stateConfigs[selectedState].name}! Evacuate to camps.`;
    topAlert.className = 'alarm-badge flash';
    alertsCount.textContent = '5 Alerts (Severe)';
    alertsCount.className = 'stat-value text-emergency';
  } else if (maxRisk >= 40) {
    riskBadge.textContent = 'ORANGE WATCH';
    riskBadge.className = 'risk-badge-display medium';
    riskDesc.textContent = `Moderate Threat: SDRF monitoring state parameters. Ensure emergency rations are packed and local maps downloaded.`;
    
    topAlert.textContent = `⚠️ ORANGE WATCH: Alert active for ${state.stateConfigs[selectedState].name}. Stay informed.`;
    topAlert.className = 'alarm-badge';
    alertsCount.textContent = '3 Alerts (Active)';
    alertsCount.className = 'stat-value text-warning';
  } else {
    riskBadge.textContent = 'GREEN CLEAR';
    riskBadge.className = 'risk-badge-display low';
    riskDesc.textContent = `Safe Parameters: Weather monitoring values within regular seasonal bounds.`;
    
    topAlert.textContent = `🟢 Safe status: No major alarms across monitoring centers.`;
    topAlert.className = 'alarm-badge';
    alertsCount.textContent = '0 Alerts';
    alertsCount.className = 'stat-value text-safe';
  }
}

function updateBar(id, val) {
  const el = document.getElementById(id);
  el.style.width = `${val}%`;
  el.textContent = `${val}%`;

  // Color classes
  el.className = 'bar-inner';
  if (val >= 75) el.classList.add('high');
  else if (val >= 40) el.classList.add('medium');
  else el.classList.add('low');
}

// Zonation & Relocation Hubs Logic
function initShelterFinder() {
  const searchInput = document.getElementById('shelter-search');
  const zoneSeismic = document.getElementById('zone-seismic');
  const zoneFlood = document.getElementById('zone-flood');
  const zoneCyclone = document.getElementById('zone-cyclone');

  searchInput.addEventListener('input', filterShelters);
  
  // Layer toggling hooks
  [zoneSeismic, zoneFlood, zoneCyclone].forEach(cb => {
    cb.addEventListener('change', () => {
      const layerId = cb.id.replace('zone', 'svg-layer');
      const layer = document.getElementById(layerId);
      if (layer) {
        if (cb.checked) {
          layer.classList.remove('hidden');
        } else {
          layer.classList.add('hidden');
        }
      }
    });
  });

  filterShelters();
}

function filterShelters() {
  const query = document.getElementById('shelter-search').value.toLowerCase();
  
  const filtered = state.shelters.filter(s => {
    return s.name.toLowerCase().includes(query) || s.area.toLowerCase().includes(query);
  });

  renderShelterList(filtered);
  renderSheltersMap(filtered);
}

function renderShelterList(items) {
  const container = document.getElementById('shelter-list-container');
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<div class="no-results">No active regional camps found.</div>';
    return;
  }

  items.forEach(shelter => {
    const pct = Math.round((shelter.filled / shelter.capacity) * 100);
    let barColorClass = '';
    if (pct >= 90) barColorClass = 'danger';
    else if (pct >= 70) barColorClass = 'warning';

    const card = document.createElement('div');
    card.className = `shelter-card ${state.selectedShelterId === shelter.id ? 'selected' : ''}`;
    card.innerHTML = `
      <h4>
        <span>${shelter.name}</span>
        <span class="shelter-status-dot ${shelter.status}"></span>
      </h4>
      <p>📍 ${shelter.area} | 📞 ${shelter.phone}</p>
      <p>Capacity: ${shelter.filled}/${shelter.capacity} occupied (${pct}%)</p>
      <div class="capacity-bar-container">
        <div class="capacity-bar ${barColorClass}" style="width: ${pct}%"></div>
      </div>
    `;

    card.addEventListener('click', () => {
      state.selectedShelterId = shelter.id;
      document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      highlightMapMarker(shelter.id);
    });

    container.appendChild(card);
  });
}

function renderSheltersMap(items = state.shelters) {
  const markersGroup = document.getElementById('map-markers-group');
  if (!markersGroup) return;
  markersGroup.innerHTML = '';

  items.forEach(s => {
    let pinColor = '#10b981'; // open
    if (s.status === 'full') pinColor = '#f59e0b';
    else if (s.status === 'closed') pinColor = '#ef4444';

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'map-pin');
    g.setAttribute('id', `svg-marker-${s.id}`);
    
    if (state.selectedShelterId === s.id) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', s.x);
      ring.setAttribute('cy', s.y);
      ring.setAttribute('r', 16);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#6366f1');
      ring.setAttribute('stroke-width', 2);
      ring.innerHTML = `<animate attributeName="r" values="8;20;8" dur="1.5s" repeatCount="indefinite" />`;
      g.appendChild(ring);
    }

    const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pin.setAttribute('cx', s.x);
    pin.setAttribute('cy', s.y);
    pin.setAttribute('r', 8);
    pin.setAttribute('fill', pinColor);
    pin.setAttribute('stroke', '#fff');
    pin.setAttribute('stroke-width', 1.5);
    g.appendChild(pin);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', s.x);
    label.setAttribute('y', s.y - 12);
    label.setAttribute('fill', '#fff');
    label.setAttribute('font-size', '8');
    label.setAttribute('font-weight', '600');
    label.setAttribute('text-anchor', 'middle');
    label.textContent = s.name.split(' ')[0];
    g.appendChild(label);

    g.addEventListener('click', () => {
      state.selectedShelterId = s.id;
      filterShelters();
    });

    markersGroup.appendChild(g);
  });
}

function highlightMapMarker(id) {
  renderSheltersMap();
}

// Evacuation Route Planner
function initEvacuationRouter() {
  const calcBtn = document.getElementById('calculate-route-btn');
  calcBtn.addEventListener('click', () => {
    const startNode = document.getElementById('route-start').value;
    const avoidFloods = document.getElementById('avoid-floods').checked;
    const avoidLandslides = document.getElementById('avoid-landslides').checked;
    
    calculateRouting(startNode, avoidFloods, avoidLandslides);
  });
}

function calculateRouting(start, avoidFloods, avoidLandslides) {
  const resultsPanel = document.getElementById('route-results-panel');
  const safetyBadge = document.getElementById('route-safety-badge');
  const distanceEl = document.getElementById('route-distance');
  const timeEl = document.getElementById('route-time');
  const directionsContainer = document.getElementById('route-directions-list');
  const svgHighlight = document.getElementById('active-routing-highlight');

  resultsPanel.classList.remove('hidden');
  directionsContainer.innerHTML = '';

  let route = [];
  let steps = [];
  let dist = '2.4 km';
  let time = '11 mins';
  let pathD = '';

  if (start === 'A') { // Coastal Sector
    if (avoidFloods) {
      // Detour bypass around river overflow
      dist = '5.2 km';
      time = '28 mins (Vehicle evacuation detour)';
      pathD = 'M 120,100 L 100,280 L 450,300 L 450,130';
      safetyBadge.className = 'badge badge-warning';
      safetyBadge.textContent = 'Detour Via Coastline';
      steps = [
        { desc: 'Exit Odisha Beach front. Move South away from storm surge boundary.', isHazard: false },
        { desc: 'Detour Warning: Avoid Highway 4 crossing near river flood plains.', isHazard: true },
        { desc: 'Take Coastal Expressway detour. Connect to South Relief Hub.', isHazard: false },
        { desc: 'Arrive safely at SDRF Camp Alpha.', isHazard: false }
      ];
    } else {
      dist = '1.8 km';
      time = '9 mins';
      pathD = 'M 120,100 L 250,150 L 450,130';
      safetyBadge.className = 'badge badge-emergency';
      safetyBadge.textContent = 'Active Flood Danger';
      steps = [
        { desc: 'Exit Odisha Beach front. Head East on Riverbank Road.', isHazard: false },
        { desc: 'CAUTION: Water depths of 1.5 feet reported near River Basin settlement.', isHazard: true },
        { desc: 'Cross Bridge 12. Arrive at SDRF Camp Alpha.', isHazard: false }
      ];
    }
  } else if (start === 'B') { // Riverbank
    dist = '2.1 km';
    time = '10 mins';
    pathD = 'M 250,150 L 450,130';
    safetyBadge.className = 'badge badge-success';
    safetyBadge.textContent = 'Clear & Safe';
    steps = [
      { desc: 'Depart Riverbank settlement via main concrete road.', isHazard: false },
      { desc: 'Arrive safely at SDRF Camp Alpha high ground.', isHazard: false }
    ];
  } else if (start === 'C') { // Hill Station
    if (avoidLandslides) {
      dist = '8.5 km';
      time = '45 mins (Blocked path bypass)';
      pathD = 'M 120,100 L 100,280 L 450,300 L 450,130';
      safetyBadge.className = 'badge badge-warning';
      safetyBadge.textContent = 'Landslide Cordon Bypass';
      steps = [
        { desc: 'Leave Uttarakhand mountain slope. Proceed through lower Valley bypass road.', isHazard: false },
        { desc: 'Road warning: Avoid landslide prone rocks on the eastern pass.', isHazard: true },
        { desc: 'Arrive safely at SDRF Camp Alpha.', isHazard: false }
      ];
    } else {
      dist = '3.0 km';
      time = '15 mins';
      pathD = 'M 250,150 L 450,130';
      safetyBadge.className = 'badge badge-emergency';
      safetyBadge.textContent = 'Landslide Warning active';
      steps = [
        { desc: 'Head Downhill on Eastern mountain pass road.', isHazard: false },
        { desc: 'CAUTION: Heavy rockfall warnings active near Sector 4.', isHazard: true },
        { desc: 'Reach valley floor and enter SDRF Camp Alpha.', isHazard: false }
      ];
    }
  }

  if (pathD) {
    svgHighlight.setAttribute('d', pathD);
    svgHighlight.classList.remove('hidden');
  } else {
    svgHighlight.classList.add('hidden');
  }

  distanceEl.textContent = dist;
  timeEl.textContent = time;

  steps.forEach(step => {
    const stepEl = document.createElement('div');
    stepEl.className = `direction-step ${step.isHazard ? 'hazard' : ''}`;
    stepEl.textContent = step.desc;
    directionsContainer.appendChild(stepEl);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SOS Modal — One-Tap Emergency Gateway
// ─────────────────────────────────────────────────────────────────────────────

let sosModalTimers = [];      // track all timeouts so we can clear on cancel
let sosCountdownTimer = null; // countdown interval reference
let sosAutoDispatchId = null; // the dispatch ID for the triggered SOS

function openSOSModal() {
  const modal = document.getElementById('sos-modal');
  if (!modal) return;

  // Reset all steps to pending state
  resetModalSteps();

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Kick off the connection simulation chain
  runSOSConnectionFlow();
}

function closeSOSModal() {
  const modal = document.getElementById('sos-modal');
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';

  // Clear all pending timers
  sosModalTimers.forEach(t => clearTimeout(t));
  sosModalTimers = [];
  if (sosCountdownTimer) {
    clearInterval(sosCountdownTimer);
    sosCountdownTimer = null;
  }

  // Reset the countdown button if present
  const dispatchBtn = document.getElementById('modal-dispatch-btn');
  if (dispatchBtn) dispatchBtn.remove();
}

function resetModalSteps() {
  ['step-gps', 'step-network', 'step-assigned'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.className = 'status-step';
    }
  });

  setStepText('gps-coordinate-status', 'Requesting device coordinates...');
  setStepText('relay-status', 'Connecting to local district dispatcher...');
  setStepText('deployment-status', 'Waiting for battalion dispatch...');

  // Remove any leftover dispatch button
  const old = document.getElementById('modal-dispatch-btn');
  if (old) old.remove();
}

function setStepText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function activateStep(stepId) {
  const el = document.getElementById(stepId);
  if (el) el.className = 'status-step active';
}

function completeStep(stepId) {
  const el = document.getElementById(stepId);
  if (el) el.className = 'status-step completed';
}

function runSOSConnectionFlow() {
  // ── STEP 1: GPS Geolocation ──────────────────────────────────────────────
  activateStep('step-gps');
  setStepText('gps-coordinate-status', '📡 Scanning satellite network...');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setStepText('gps-coordinate-status', `✅ Location acquired: ${lat}°N, ${lon}°E`);
        state.sosLocation = { lat, lon };
        completeStep('step-gps');
        scheduleRelayStep();
      },
      () => {
        // Fallback to simulated Indian coordinates if permission denied
        const fallbackLat = (20 + Math.random() * 10).toFixed(4);
        const fallbackLon = (75 + Math.random() * 10).toFixed(4);
        setStepText('gps-coordinate-status', `⚠️ GPS fallback: ${fallbackLat}°N, ${fallbackLon}°E`);
        state.sosLocation = { lat: fallbackLat, lon: fallbackLon };
        completeStep('step-gps');
        scheduleRelayStep();
      },
      { timeout: 5000 }
    );
  } else {
    // Browser doesn't support geolocation — simulate
    const t = setTimeout(() => {
      setStepText('gps-coordinate-status', '⚠️ GPS unavailable — using IP triangulation fallback');
      state.sosLocation = { lat: '22.5726', lon: '88.3639' };
      completeStep('step-gps');
      scheduleRelayStep();
    }, 1800);
    sosModalTimers.push(t);
  }
}

function scheduleRelayStep() {
  // ── STEP 2: SDRF Relay ────────────────────────────────────────────────────
  const t1 = setTimeout(() => {
    activateStep('step-network');
    setStepText('relay-status', '🔄 Routing to nearest SDRF Command Center...');

    const t2 = setTimeout(() => {
      // Determine nearest state based on rough location
      const stateNames = ['NDRF 10th Bn (Assam)', 'SDRF Kerala State HQ', 'Odisha SDRF Control', 'Bihar State Disaster Cell', 'Uttarakhand SDRF Alpha', 'Rajasthan Emergency Coordination'];
      const selected = stateNames[Math.floor(Math.random() * stateNames.length)];
      setStepText('relay-status', `✅ Connected to: ${selected}`);
      completeStep('step-network');
      scheduleDeploymentStep(selected);
    }, 2000);
    sosModalTimers.push(t2);
  }, 600);
  sosModalTimers.push(t1);
}

function scheduleDeploymentStep(commandCenter) {
  // ── STEP 3: Battalion Deployment ─────────────────────────────────────────
  const t1 = setTimeout(() => {
    activateStep('step-assigned');
    setStepText('deployment-status', '⏳ Alerting rescue battalion...');

    const t2 = setTimeout(() => {
      const ticketId = `SDRF-${Math.floor(1000 + Math.random() * 9000)}`;
      sosAutoDispatchId = ticketId;

      setStepText('deployment-status', `✅ Ticket ${ticketId} — Unit en route. ETA: 8-12 min.`);
      completeStep('step-assigned');

      // Log it to the dispatch system
      const sosDispatch = {
        id: ticketId,
        name: 'One-Tap SOS User',
        type: 'Rapid Emergency SOS',
        location: state.sosLocation
          ? `GPS: ${state.sosLocation.lat}°N, ${state.sosLocation.lon}°E`
          : 'Location pending...',
        responders: commandCenter,
        status: 'Dispatched',
        severity: 'critical'
      };
      state.dispatches.unshift(sosDispatch);
      renderDispatchLog();

      // Show the confirm & countdown dispatch button
      showConfirmDispatchButton(ticketId);

      // Auto-progress status in background
      simulateStatusProgression(ticketId);
    }, 2200);
    sosModalTimers.push(t2);
  }, 800);
  sosModalTimers.push(t1);
}

function showConfirmDispatchButton(ticketId) {
  const footer = document.querySelector('.modal-footer-sos');
  if (!footer) return;

  // Remove any previous button
  const old = document.getElementById('modal-dispatch-btn');
  if (old) old.remove();

  let seconds = 10;
  const btn = document.createElement('button');
  btn.id = 'modal-dispatch-btn';
  btn.className = 'btn btn-danger btn-lg btn-pulse btn-block';
  btn.textContent = `🚨 SOS CONFIRMED — Closing in ${seconds}s`;
  footer.insertAdjacentElement('beforebegin', btn);

  sosCountdownTimer = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(sosCountdownTimer);
      sosCountdownTimer = null;
      closeSOSModal();
    } else {
      btn.textContent = `🚨 SOS CONFIRMED — Closing in ${seconds}s`;
    }
  }, 1000);

  btn.addEventListener('click', () => {
    clearInterval(sosCountdownTimer);
    sosCountdownTimer = null;
    closeSOSModal();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SOS Portal (Full Form Dispatch) — standard form view
// ─────────────────────────────────────────────────────────────────────────────
function initSOSPortal() {
  // Wire dashboard hero SOS trigger button → modal
  const dashTrigger = document.getElementById('dashboard-sos-trigger');
  if (dashTrigger) {
    dashTrigger.addEventListener('click', openSOSModal);
  }

  // Wire modal close/cancel buttons
  const closeBtn = document.getElementById('close-sos-modal-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSOSModal);

  const cancelBtn = document.getElementById('cancel-sos-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeSOSModal);

  // Click outside modal card to close
  const overlay = document.getElementById('sos-modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSOSModal();
    });
  }

  // SMS emergency link sender
  const smsBtn = document.getElementById('send-sms-sos-btn');
  if (smsBtn) {
    smsBtn.addEventListener('click', () => {
      const loc = state.sosLocation
        ? `${state.sosLocation.lat},${state.sosLocation.lon}`
        : '20.5937,78.9629';
      const msg = encodeURIComponent(
        `🚨 EMERGENCY SOS — I need immediate rescue assistance.\n` +
        `📍 My Location: https://maps.google.com/?q=${loc}\n` +
        `📞 Please contact NDRF: 112 or SDRF: 1078 on my behalf immediately.`
      );
      // Opens SMS app with pre-filled message to NDRF national number
      window.open(`sms:112?body=${msg}`, '_self');
      smsBtn.textContent = '✅ SMS App Opened — Send Immediately';
      smsBtn.disabled = true;
      setTimeout(() => {
        smsBtn.textContent = '💬 Send Emergency SMS Link';
        smsBtn.disabled = false;
      }, 5000);
    });
  }

  // Keyboard escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('sos-modal');
      if (modal && !modal.classList.contains('hidden')) {
        closeSOSModal();
      }
    }
  });

  // Full SOS form submission (detailed report)
  const form = document.getElementById('sos-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sos-name').value;
      const categorySel = document.getElementById('sos-category');
      const categoryText = categorySel.options[categorySel.selectedIndex].text;
      const severity = document.getElementById('sos-severity').value;
      const location = document.getElementById('sos-location').value;

      const id = `SDRF-${Math.floor(1000 + Math.random() * 9000)}`;

      let responder = 'SDRF District Cell';
      if (categoryText.includes('Flood')) responder = 'NDRF 10th Battalion (Water Rescue)';
      else if (categoryText.includes('Medical')) responder = 'SDRF Mobile Medical Unit C';
      else if (categoryText.includes('Food')) responder = 'District Food Supply & Air Drop Sortie';
      else responder = 'Local SDRF Disaster Recovery Battalion';

      const newDispatch = {
        id, name, type: categoryText, location, responders: responder, status: 'Dispatched', severity
      };

      state.dispatches.unshift(newDispatch);
      renderDispatchLog();
      form.reset();

      // Show confirmation as a toast-style banner instead of alert
      showToast(`✅ SOS Transmitted! Ticket: ${id} — ${responder} has been notified.`, 'success');
      simulateStatusProgression(id);
    });
  }

  renderDispatchLog();
}

function renderDispatchLog() {
  const tbody = document.getElementById('dispatch-log-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.dispatches.forEach(d => {
    const tr = document.createElement('tr');

    let sevBadge = '';
    if (d.severity === 'critical') sevBadge = 'badge-emergency';
    else if (d.severity === 'high') sevBadge = 'badge-warning';
    else sevBadge = 'badge-info';

    let statusBadge = 'badge-info';
    if (d.status === 'En Route') statusBadge = 'badge-warning';
    if (d.status === 'Arrived') statusBadge = 'badge-warning';
    if (d.status === 'Rescued' || d.status === 'Resolved') statusBadge = 'badge-success';

    tr.innerHTML = `
      <td><strong>${d.id}</strong></td>
      <td>${d.name}</td>
      <td><span class="badge ${sevBadge}">${d.type}</span></td>
      <td>${d.location}</td>
      <td>${d.responders}</td>
      <td><span class="badge ${statusBadge}">${d.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function simulateStatusProgression(id) {
  setTimeout(() => {
    const item = state.dispatches.find(d => d.id === id);
    if (item) { item.status = 'En Route'; renderDispatchLog(); }
  }, 6000);
  setTimeout(() => {
    const item = state.dispatches.find(d => d.id === id);
    if (item) { item.status = 'Arrived'; renderDispatchLog(); }
  }, 14000);
  setTimeout(() => {
    const item = state.dispatches.find(d => d.id === id);
    if (item) { item.status = 'Rescued'; renderDispatchLog(); }
  }, 24000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast Notification System
// ─────────────────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      z-index: 99999; display: flex; flex-direction: column; gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const colorMap = {
    success: 'linear-gradient(135deg, #10b981, #059669)',
    error: 'linear-gradient(135deg, #ef4444, #dc2626)',
    info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${colorMap[type] || colorMap.info};
    color: #fff; padding: 0.9rem 1.25rem; border-radius: 10px;
    font-size: 0.875rem; font-weight: 600; max-width: 360px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    pointer-events: all; cursor: pointer;
    opacity: 0; transform: translateX(20px);
    transition: all 0.3s ease;
    font-family: var(--font-sans, sans-serif);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto-dismiss after 5s
  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  };
  setTimeout(dismiss, 5000);
  toast.addEventListener('click', dismiss);
}

// Indian Rations Calculator
function initSuppliesCalculator() {
  const calcBtn = document.getElementById('calculate-supplies-btn');
  const copyBtn = document.getElementById('copy-supplies-btn');

  calcBtn.addEventListener('click', calculateRations);
  
  copyBtn.addEventListener('click', () => {
    const water = document.getElementById('supply-qty-water').textContent;
    const food = document.getElementById('supply-qty-food').textContent;
    const meds = document.getElementById('supply-qty-meds').textContent;
    const gear = document.getElementById('supply-qty-gear').textContent;

    const checklistText = `Rescue AI - Indian Ration & Emergency Checklist:\n` +
      `- Clean Drinking Water: ${water}\n` +
      `- Dry Food Rations (Rice/Dal): ${food}\n` +
      `- First Aid & ORS Packets: ${meds}\n` +
      `- Emergency Survival Kit: ${gear}\n\n` +
      `Keep Rations secured in dry zip-lock bags inside a waterproof backpack.`;

    navigator.clipboard.writeText(checklistText)
      .then(() => alert('Rations details copied to clipboard successfully!'))
      .catch(err => alert('Unable to copy rations list: ' + err));
  });

  calculateRations();
}

function calculateRations() {
  const familySize = parseInt(document.getElementById('supplies-family').value) || 1;
  const days = parseInt(document.getElementById('supplies-days').value) || 1;
  const hasInfant = document.getElementById('supplies-infant').value === 'yes';

  // Math for rations
  const waterLiters = familySize * days * 3; // 3 Liters per person per day
  const grainKg = ((familySize * days * 0.4) + (familySize * days * 0.1)).toFixed(1); // 400g Rice + 100g Dal per person per day
  
  let medsQty = '1 Core First-Aid Kit & 5 ORS Packets';
  if (familySize > 5) medsQty = '2 Medical Kits & 10 ORS Packets';
  if (hasInfant) medsQty += ' + Amul/Pediatric Milk Supplements';

  let gearQty = '1 Emergency Pack (Torches & Whistles)';
  if (familySize > 4) gearQty = '2 Emergency Packs';

  // Update UI Elements
  document.getElementById('supply-qty-water').textContent = `${waterLiters} Liters`;
  document.getElementById('supply-qty-food').textContent = `${grainKg} kg Rice & Dal`;
  document.getElementById('supply-qty-meds').textContent = medsQty;
  document.getElementById('supply-qty-gear').textContent = gearQty;
}

// Live Broadcasts data initializer
function renderLiveBroadcasts() {
  const feed = document.getElementById('dashboard-feed-container');
  if (!feed) return;

  const feeds = [
    { time: '17:15', label: 'IMD Alert', desc: 'Cyclone threat rises. Odisha coastal communities relocated to shelters.', type: 'urgent' },
    { time: '16:45', label: 'NDMA Advisory', desc: 'Monsoon flooding alerts activated for Guwahati and eastern river beds.', type: 'warning' },
    { time: '15:20', label: 'SDRF Action', desc: 'Landslide clearance in progress on Uttarakhand Route 8 detour.', type: 'info' }
  ];

  feed.innerHTML = '';
  feeds.forEach(f => {
    const item = document.createElement('div');
    item.className = `feed-item ${f.type}`;
    item.innerHTML = `
      <div class="feed-time">${f.time}</div>
      <div class="feed-details">
        <h4>${f.label}</h4>
        <p>${f.desc}</p>
      </div>
    `;
    feed.appendChild(item);
  });
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
  initClock();
  initNavigation();
  initOfflineMode();
  initSurvivalGuides();
  initRiskPredictor();
  initShelterFinder();
  initEvacuationRouter();
  initSOSPortal();
  initSuppliesCalculator();
  renderLiveBroadcasts();
});
