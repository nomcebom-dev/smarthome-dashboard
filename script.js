/* ═══════════════════════════════════════════════════
   NEXAHOME — Smart Environment Monitor
   IoT sensor simulation dashboard
   Built by Nomcebo Mtshali
═══════════════════════════════════════════════════ */

/* ─── SENSOR DATA MODEL ───────────────────────────── */
const ROOMS = [
  { id:'living',  name:'Living Room', icon:'🛋',  temp:22, humidity:48, aqi:42, motion:true,  light:true  },
  { id:'bedroom', name:'Bedroom',     icon:'🛏',  temp:20, humidity:55, aqi:38, motion:false, light:false },
  { id:'kitchen', name:'Kitchen',     icon:'🍳',  temp:24, humidity:62, aqi:68, motion:true,  light:true  },
  { id:'office',  name:'Home Office', icon:'💻',  temp:21, humidity:44, aqi:35, motion:true,  light:true  },
];

const DEVICES = [
  { id:'ac',       name:'Air Conditioner', room:'Living Room',  icon:'❄',  on:true,  power:'1.2 kW' },
  { id:'heater',   name:'Heater',          room:'Bedroom',      icon:'🔥', on:false, power:'0.8 kW' },
  { id:'fan',      name:'Ceiling Fan',     room:'Kitchen',      icon:'🌀', on:true,  power:'0.06 kW' },
  { id:'lights1',  name:'Smart Lights',    room:'Living Room',  icon:'💡', on:true,  power:'0.04 kW' },
  { id:'lights2',  name:'Smart Lights',    room:'Bedroom',      icon:'💡', on:false, power:'0.04 kW' },
  { id:'cam',      name:'Security Camera', room:'Entrance',     icon:'📷', on:true,  power:'0.01 kW' },
  { id:'hub',      name:'IoT Hub',         room:'Office',       icon:'📡', on:true,  power:'0.02 kW' },
  { id:'speaker',  name:'Smart Speaker',   room:'Living Room',  icon:'🔊', on:true,  power:'0.01 kW' },
];

const alertHistory = [];
let chartHistory = { living: [], bedroom: [] };
let startTime = Date.now();
let updateCount = 0;

/* ─── THRESHOLDS ──────────────────────────────────── */
const THRESHOLDS = {
  temp:     { warn: 27, alert: 30 },
  humidity: { warn: 70, alert: 85 },
  aqi:      { warn: 60, alert: 80 },
};

/* ─── SIMULATE SENSOR DRIFT ───────────────────────── */
function drift(val, min, max, speed = 0.4) {
  return Math.min(max, Math.max(min, val + (Math.random() - 0.5) * speed));
}

function updateSensors() {
  ROOMS.forEach(r => {
    r.temp     = +drift(r.temp,     16, 34, 0.3).toFixed(1);
    r.humidity = +drift(r.humidity, 30, 90, 0.8).toFixed(0);
    r.aqi      = +drift(r.aqi,      20, 100, 1.2).toFixed(0);
    r.motion   = Math.random() > 0.85 ? !r.motion : r.motion;
  });

  // check thresholds and log alerts
  ROOMS.forEach(r => {
    if (r.temp >= THRESHOLDS.temp.alert)
      logEvent('alert', `🌡 HIGH TEMP: ${r.name} reached ${r.temp}°C`, 'alert');
    else if (r.temp >= THRESHOLDS.temp.warn && Math.random() > 0.7)
      logEvent('warn', `⚠ Elevated temp in ${r.name}: ${r.temp}°C`, 'warn');

    if (r.aqi >= THRESHOLDS.aqi.alert)
      logEvent('alert', `🌬 POOR AIR QUALITY: ${r.name} AQI ${r.aqi}`, 'alert');
    else if (r.aqi >= THRESHOLDS.aqi.warn && Math.random() > 0.8)
      logEvent('warn', `⚠ Air quality declining in ${r.name}: AQI ${r.aqi}`, 'warn');
  });

  // occasional random events
  if (updateCount % 8 === 0) {
    const msgs = [
      ['Motion detected in Kitchen', 'info'],
      ['Front door sensor: closed', 'ok'],
      ['IoT Hub: all sensors responding', 'ok'],
      ['Network ping: 12ms', 'info'],
      ['Backup to cloud: complete', 'ok'],
    ];
    const [msg, type] = msgs[Math.floor(Math.random() * msgs.length)];
    logEvent(type, msg, type);
  }

  updateCount++;
}

/* ─── LOG ─────────────────────────────────────────── */
function logEvent(type, msg, level = 'info') {
  const time = new Date().toLocaleTimeString();
  const entry = { type, msg, level, time };
  alertHistory.unshift(entry);
  if (alertHistory.length > 50) alertHistory.pop();

  // update alert log panel
  renderAlertLog();
  renderAlertsPage();
  updateAlertBadge();
}

function renderAlertLog() {
  const el = document.getElementById('alertLog');
  if (!el) return;
  if (alertHistory.length === 0) {
    el.innerHTML = '<div class="log-empty">No events yet. System monitoring...</div>';
    return;
  }
  el.innerHTML = alertHistory.slice(0, 20).map(e => `
    <div class="log-entry">
      <div class="le-dot ${e.level}"></div>
      <div class="le-content">
        <div class="le-msg">${e.msg}</div>
        <div class="le-time">${e.time}</div>
      </div>
    </div>
  `).join('');
}

function renderAlertsPage() {
  const el = document.getElementById('alertsPage');
  if (!el) return;
  if (alertHistory.length === 0) {
    el.innerHTML = '<div class="log-empty">No alerts recorded.</div>';
    return;
  }
  el.innerHTML = alertHistory.map(e => {
    const icons = { alert:'🔴', warn:'🟡', ok:'🟢', info:'🔵' };
    return `
      <div class="alert-card ${e.level}">
        <div class="ac-icon">${icons[e.level] || '⚪'}</div>
        <div>
          <div class="ac-title">${e.msg}</div>
          <div class="ac-time">${e.time}</div>
        </div>
      </div>
    `;
  }).join('');
}

function updateAlertBadge() {
  const warnings = alertHistory.filter(e => e.level === 'alert' || e.level === 'warn').length;
  const badge = document.getElementById('alertBadge');
  const statAlerts = document.getElementById('statAlerts');
  if (badge) {
    badge.textContent = warnings;
    badge.classList.toggle('visible', warnings > 0);
  }
  if (statAlerts) statAlerts.textContent = warnings;
  const trend = document.getElementById('statAlertTrend');
  if (trend) trend.textContent = warnings > 0 ? `${warnings} need attention` : 'All systems normal';
}

function clearLog() {
  alertHistory.length = 0;
  renderAlertLog();
  renderAlertsPage();
  updateAlertBadge();
}

/* ─── RENDER ROOMS ────────────────────────────────── */
function getRoomStatus(r) {
  if (r.temp >= THRESHOLDS.temp.alert || r.aqi >= THRESHOLDS.aqi.alert) return 'alert';
  if (r.temp >= THRESHOLDS.temp.warn  || r.aqi >= THRESHOLDS.aqi.warn)  return 'warn';
  return 'ok';
}

function getTempColor(t) {
  if (t >= THRESHOLDS.temp.alert) return 'var(--red)';
  if (t >= THRESHOLDS.temp.warn)  return 'var(--yellow)';
  return 'var(--cyan)';
}

function getAQIColor(a) {
  if (a >= THRESHOLDS.aqi.alert) return 'var(--red)';
  if (a >= THRESHOLDS.aqi.warn)  return 'var(--yellow)';
  return 'var(--green)';
}

function renderRooms() {
  const grid = document.getElementById('roomsGrid');
  if (!grid) return;
  grid.innerHTML = ROOMS.map(r => {
    const status = getRoomStatus(r);
    const tempPct = Math.min(100, ((r.temp - 16) / (34 - 16)) * 100);
    const humPct  = Math.min(100, r.humidity);
    const aqiPct  = Math.min(100, r.aqi);
    return `
      <div class="room-card">
        <div class="rc-header">
          <div class="rc-room">${r.icon} ${r.name}</div>
          <div class="rc-status ${status}"></div>
        </div>
        <div class="rc-readings">
          <div class="rc-reading">
            <span class="rr-label">Temp</span>
            <div class="rr-bar"><div class="rr-fill" style="width:${tempPct}%;background:${getTempColor(r.temp)}"></div></div>
            <span class="rr-val" style="color:${getTempColor(r.temp)}">${r.temp}°C</span>
          </div>
          <div class="rc-reading">
            <span class="rr-label">Humid</span>
            <div class="rr-bar"><div class="rr-fill" style="width:${humPct}%;background:var(--cyan)"></div></div>
            <span class="rr-val" style="color:var(--cyan)">${r.humidity}%</span>
          </div>
          <div class="rc-reading">
            <span class="rr-label">AQI</span>
            <div class="rr-bar"><div class="rr-fill" style="width:${aqiPct}%;background:${getAQIColor(r.aqi)}"></div></div>
            <span class="rr-val" style="color:${getAQIColor(r.aqi)}">${r.aqi}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ─── RENDER SENSORS VIEW ─────────────────────────── */
function renderSensorsDetail() {
  const el = document.getElementById('sensorsDetail');
  if (!el) return;
  el.innerHTML = ROOMS.map(r => {
    const status = getRoomStatus(r);
    const labels = { ok:'Normal', warn:'Warning', alert:'Alert' };
    return `
      <div class="sensor-card ${status}">
        <div class="senc-header">
          <div>
            <div class="senc-room">${r.icon} ${r.name}</div>
            <div class="senc-type">Environmental Sensor</div>
          </div>
          <span class="senc-badge ${status}">${labels[status]}</span>
        </div>
        <div class="senc-readings">
          <div class="senc-val-row">
            <div class="svr-label">Temperature</div>
            <div class="svr-value" style="color:${getTempColor(r.temp)}">${r.temp}°C</div>
            <div class="svr-bar"><div class="svr-fill" style="width:${Math.min(100,(r.temp-16)/(34-16)*100)}%;background:${getTempColor(r.temp)}"></div></div>
          </div>
          <div class="senc-val-row">
            <div class="svr-label">Humidity</div>
            <div class="svr-value" style="color:var(--cyan)">${r.humidity}%</div>
            <div class="svr-bar"><div class="svr-fill" style="width:${r.humidity}%;background:var(--cyan)"></div></div>
          </div>
          <div class="senc-val-row">
            <div class="svr-label">Air Quality Index</div>
            <div class="svr-value" style="color:${getAQIColor(r.aqi)}">${r.aqi}</div>
            <div class="svr-bar"><div class="svr-fill" style="width:${r.aqi}%;background:${getAQIColor(r.aqi)}"></div></div>
          </div>
          <div class="senc-val-row">
            <div class="svr-label">Motion</div>
            <div class="svr-value" style="color:${r.motion ? 'var(--yellow)' : 'var(--muted)'};font-size:16px">${r.motion ? 'DETECTED' : 'CLEAR'}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ─── RENDER STAT CARDS ───────────────────────────── */
function renderStats() {
  const avgTemp  = (ROOMS.reduce((s,r) => s + r.temp, 0) / ROOMS.length).toFixed(1);
  const avgHumid = Math.round(ROOMS.reduce((s,r) => s + r.humidity, 0) / ROOMS.length);
  const avgAQI   = Math.round(ROOMS.reduce((s,r) => s + r.aqi, 0) / ROOMS.length);

  document.getElementById('statTemp').textContent  = avgTemp + '°C';
  document.getElementById('statHumid').textContent = avgHumid + '%';
  document.getElementById('statAQI').textContent   = avgAQI;

  const aqiLabel = avgAQI < 50 ? 'Good' : avgAQI < 60 ? 'Moderate' : 'Poor';
  document.getElementById('statTempTrend').textContent  = avgTemp > 25 ? '↑ Above comfort zone' : '✓ Comfortable';
  document.getElementById('statHumidTrend').textContent = avgHumid > 65 ? '↑ High humidity' : '✓ Normal range';
  document.getElementById('statAQITrend').textContent   = aqiLabel + ' air quality';
}

/* ─── RENDER CONTROLS ─────────────────────────────── */
function renderControls() {
  const el = document.getElementById('controlsList');
  if (!el) return;
  el.innerHTML = DEVICES.slice(0, 6).map(d => `
    <div class="control-item">
      <div class="ci-left">
        <span class="ci-icon">${d.icon}</span>
        <div>
          <div class="ci-name">${d.name}</div>
          <div class="ci-room">${d.room} · ${d.power}</div>
        </div>
      </div>
      <button class="toggle ${d.on ? 'on' : ''}" onclick="toggleDevice('${d.id}')"></button>
    </div>
  `).join('');
}

/* ─── RENDER DEVICES VIEW ─────────────────────────── */
function renderDevicesGrid() {
  const el = document.getElementById('devicesGrid');
  if (!el) return;
  el.innerHTML = DEVICES.map(d => `
    <div class="device-card ${d.on ? 'on' : ''}">
      <div class="dc-icon">${d.icon}</div>
      <div class="dc-name">${d.name}</div>
      <div class="dc-room">${d.room}</div>
      <div class="dc-power">${d.on ? d.power : 'Off'}</div>
      <button class="toggle ${d.on ? 'on' : ''}" onclick="toggleDevice('${d.id}', true)"></button>
    </div>
  `).join('');
}

function toggleDevice(id, fromDevices = false) {
  const d = DEVICES.find(x => x.id === id);
  if (!d) return;
  d.on = !d.on;
  logEvent(d.on ? 'ok' : 'info', `${d.icon} ${d.name} turned ${d.on ? 'ON' : 'OFF'}`, d.on ? 'ok' : 'info');
  renderControls();
  renderDevicesGrid();
}

/* ─── CHART ───────────────────────────────────────── */
function updateChart() {
  const living  = ROOMS.find(r => r.id === 'living');
  const bedroom = ROOMS.find(r => r.id === 'bedroom');
  chartHistory.living.push(living.temp);
  chartHistory.bedroom.push(bedroom.temp);
  if (chartHistory.living.length  > 30) chartHistory.living.shift();
  if (chartHistory.bedroom.length > 30) chartHistory.bedroom.shift();
  drawChart();
}

function drawChart() {
  const canvas = document.getElementById('tempChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 500;
  const H = 200;
  canvas.width  = W;
  canvas.height = H;

  const pad = { t: 16, b: 28, l: 36, r: 12 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;

  ctx.clearRect(0, 0, W, H);

  // background
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fillRect(pad.l, pad.t, cW, cH);

  // grid
  const minV = 15, maxV = 35;
  const gridLines = [15, 20, 25, 30, 35];
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  gridLines.forEach(v => {
    const y = pad.t + cH - ((v - minV) / (maxV - minV)) * cH;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l + cW, y);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(v + '°', pad.l - 32, y + 3);
  });

  function drawLine(data, color) {
    if (data.length < 2) return;
    const pts = data.map((v, i) => ({
      x: pad.l + (i / (data.length - 1)) * cW,
      y: pad.t + cH - ((v - minV) / (maxV - minV)) * cH,
    }));

    // fill
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + cH);
    grad.addColorStop(0, color.replace(')', ',0.2)').replace('rgb', 'rgba'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, pad.t + cH);
    ctx.lineTo(pts[0].x, pad.t + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // last dot
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // label
    ctx.fillStyle = color;
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText(data[data.length-1].toFixed(1) + '°C', last.x + 6, last.y + 4);
  }

  drawLine(chartHistory.living,  '#38bdf8');
  drawLine(chartHistory.bedroom, '#34d399');
}

/* ─── CLOCK & UPTIME ──────────────────────────────── */
function updateClock() {
  const now = new Date();
  const el  = document.getElementById('sysTime');
  const dt  = document.getElementById('sysDate');
  if (el) el.textContent = now.toLocaleTimeString('en-ZA');
  if (dt) dt.textContent = now.toLocaleDateString('en-ZA', { weekday:'short', day:'numeric', month:'short' });

  const ms      = Date.now() - startTime;
  const days    = Math.floor(ms / 86400000);
  const hours   = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000)  / 60000);
  const uptimeEl = document.getElementById('uptime');
  if (uptimeEl) uptimeEl.textContent = `${days}d ${hours}h ${minutes}m`;
}

/* ─── VIEW SWITCHING ──────────────────────────────── */
function setView(btn) {
  const view = btn.dataset.view;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1)).classList.add('active');

  const titles = { dashboard:'Dashboard', sensors:'Sensors', alerts:'Alert History', devices:'Devices' };
  document.getElementById('pageTitle').textContent = titles[view] || view;

  if (view === 'sensors')  renderSensorsDetail();
  if (view === 'devices')  renderDevicesGrid();
  if (view === 'alerts')   renderAlertsPage();
}

/* ─── MANUAL ALERT TRIGGER ────────────────────────── */
function triggerAlert() {
  const room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  room.temp = 31 + Math.random() * 2;
  logEvent('alert', `🔴 ALERT: Temperature spike in ${room.name} — ${room.temp.toFixed(1)}°C`, 'alert');
}

/* ─── THEME ───────────────────────────────────────── */
function toggleTheme() {
  document.body.classList.toggle('light');
  document.getElementById('themeBtn').textContent = document.body.classList.contains('light') ? '☀' : '☾';
}

/* ─── MAIN LOOP ───────────────────────────────────── */
function tick() {
  updateSensors();
  renderRooms();
  renderStats();
  renderControls();
  updateChart();
  updateAlertBadge();

  const activeView = document.querySelector('.nav-item.active')?.dataset.view;
  if (activeView === 'sensors') renderSensorsDetail();
}

/* ─── INIT ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // seed chart history
  for (let i = 0; i < 20; i++) {
    ROOMS.forEach(r => { r.temp = drift(r.temp, 18, 28, 0.4); });
    chartHistory.living.push(ROOMS[0].temp);
    chartHistory.bedroom.push(ROOMS[1].temp);
  }

  tick();
  logEvent('ok', '✅ NexaHome system initialised. All sensors online.', 'ok');
  logEvent('info', '📡 Network connected — 12ms latency', 'info');
  logEvent('ok', '☁ Cloud sync active', 'ok');

  setInterval(tick, 3000);
  setInterval(updateClock, 1000);
  updateClock();
  window.addEventListener('resize', drawChart);
});
