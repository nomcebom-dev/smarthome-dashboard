# ⬡ NexaHome — Smart Environment Monitor

A real-time IoT smart home monitoring dashboard with live sensor simulation, automated alert detection, device control, and data visualisation. Built to demonstrate IoT concepts, network monitoring principles, and dashboard UI development.

**Live Demo:**(https://nomcebom-dev.github.io/smarthome-dashboard)

---

## 🏠 What It Does

NexaHome simulates a smart home IoT monitoring system — the same category of product used by enterprise networking platforms like HPE Aruba Networks' UXI (User Experience Insight) sensors.

It monitors 4 rooms in real time:
- **Living Room** · **Bedroom** · **Kitchen** · **Home Office**

Each room reports temperature, humidity, air quality (AQI), and motion detection. The system analyses readings against safety thresholds and automatically raises alerts when values go out of range.

---

## ⚙️ Features

**Live Sensor Simulation**
- Sensor readings update every 3 seconds using a drift algorithm (simulating real IoT sensor behaviour)
- Mouse-reactive — values drift naturally within realistic ranges

**Automated Alert System**
- Threshold-based alert engine — triggers warnings at 27°C / alerts at 30°C for temperature
- AQI warnings at 60 / alerts at 80
- All events logged to the Event Log with timestamps

**4 Dashboard Views**
- `Dashboard` — overview stats, room sensor cards, live temperature chart, event log, device toggles
- `Sensors` — detailed per-room sensor cards with AQI, humidity, motion and status badges
- `Alerts` — full alert history with severity classification
- `Devices` — smart device grid with toggle controls for 8 devices

**Live Temperature Chart**
- Canvas-based line chart tracking Living Room vs Bedroom temperature over 30 data points
- Gradient fill, animated data points, real-time labels

**Device Controls**
- Toggle 8 smart devices on/off from either Dashboard or Devices view
- Events logged automatically when devices are switched

**Light/Dark Mode**
- Full light theme toggle

---

## 🛠 Tech Stack

- **HTML5** — semantic layout, canvas element
- **CSS3** — CSS custom properties, CSS Grid, responsive layout, light/dark theming
- **Vanilla JavaScript** — sensor simulation engine, threshold alerting, canvas chart rendering, state management, real-time DOM updates via `setInterval`

No libraries. No frameworks. No build tools. Open `index.html` in any browser.

---

## 🔗 IoT Concepts Applied

| Concept | Implementation |
|---|---|
| Sensor data polling | `setInterval` loop every 3 seconds |
| Threshold alerting | Automated event triggers on out-of-range values |
| Time-series visualisation | Canvas line chart with rolling 30-point history |
| Device state management | Toggle state persisted in JS objects |
| Network status monitoring | Simulated latency and uptime display |
| Event logging | Timestamped event stream with severity levels |

---

## 🚀 How to Run

```bash
git clone https://github.com/your-username/smarthome-dashboard.git
open index.html
```

Or deploy to **GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Source: `main` branch → Save
3. Live at `https://your-username.github.io/smarthome-dashboard`

---

## 💡 What I Learned

- Simulating real IoT sensor behaviour with drift algorithms
- Building automated threshold-based alert systems
- Drawing real-time data charts with the HTML5 Canvas API
- Managing complex UI state across multiple views without a framework
- CSS Grid for professional dashboard layouts

---

## 🔮 Future Improvements

- WebSocket integration for real sensor hardware (Raspberry Pi / Arduino)
- Historical data persistence with localStorage or a backend API
- Push notifications for critical alerts
- Energy consumption tracking
- Floor plan visualisation with sensor overlay

---

## 👩🏾‍💻 Author

**Nomcebo Langelihle Mtshali**  
Junior Developer · Johannesburg, South Africa  
📧 nomcebomtshali131@gmail.com  
🔗 [Portfolio](https://nomcebom-dev.github.io) · [GitHub](https://github.com/nomcebom-dev)
