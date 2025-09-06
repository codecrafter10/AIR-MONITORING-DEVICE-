const SAMPLE = {
  "Delhi": {aqi: 210, pm25: 180, pm10: 260, temp: 34, hum: 32, co2: 420, ozone: 30, wind: 12},
  "Mumbai": {aqi: 95, pm25: 45, pm10: 78, temp: 30, hum: 66, co2: 390, ozone: 25, wind: 18},
  "Bengaluru": {aqi: 62, pm25: 32, pm10: 45, temp: 28, hum: 60, co2: 360, ozone: 20, wind: 15},
  "Chennai": {aqi: 80, pm25: 40, pm10: 55, temp: 33, hum: 70, co2: 370, ozone: 22, wind: 14},
  "Kolkata": {aqi: 150, pm25: 120, pm10: 160, temp: 31, hum: 65, co2: 410, ozone: 28, wind: 16}
};

const cities = Object.keys(SAMPLE);
let activeCity = cities[0];
let simulate = false;

const citiesList = document.getElementById("citiesList");
const activeCityEl = document.getElementById("activeCity");
const activeTimeEl = document.getElementById("activeTime");
const aqiValueEl = document.getElementById("aqiValue");
const aqiCategoryEl = document.getElementById("aqiCategory");
const aqiBar = document.getElementById("aqiBar");
const pm25El = document.getElementById("pm25");
const pm10El = document.getElementById("pm10");
const tempEl = document.getElementById("temp");
const humEl = document.getElementById("hum");
const co2El = document.getElementById("co2");
const ozoneEl = document.getElementById("ozone");
const windEl = document.getElementById("wind");

// Chart setup
const ctx = document.getElementById("cityChart").getContext("2d");
let cityChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: cities,
    datasets: [{
      label: "AQI",
      data: cities.map(c => SAMPLE[c].aqi),
      backgroundColor: "#5b8cff"
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

// Render city cards
function renderCities() {
  citiesList.innerHTML = "";
  cities.forEach(c => {
    const d = SAMPLE[c];
    const el = document.createElement("div");
    el.className = "city";
    el.innerHTML = `<strong>${c}</strong><br>AQI: ${d.aqi}`;
    el.onclick = () => setActiveCity(c);
    citiesList.appendChild(el);
  });
}

function setActiveCity(city) {
  activeCity = city;
  const data = SAMPLE[city];
  activeCityEl.textContent = city;
  activeTimeEl.textContent = new Date().toLocaleString();
  aqiValueEl.textContent = data.aqi;
  pm25El.textContent = data.pm25;
  pm10El.textContent = data.pm10;
  tempEl.textContent = data.temp + "°C";
  humEl.textContent = data.hum + "%";
  co2El.textContent = data.co2 + " ppm";
  ozoneEl.textContent = data.ozone + " µg/m³";
  windEl.textContent = data.wind + " km/h";
  aqiCategoryEl.textContent = getAQICategory(data.aqi);

  // Update chart
  cityChart.data.datasets[0].data = cities.map(c => SAMPLE[c].aqi);
  cityChart.update();
}

function getAQICategory(aqi) {
  if (aqi <= 50) { aqiBar.style.background = "green"; return "Good"; }
  if (aqi <= 100) { aqiBar.style.background = "yellow"; return "Moderate"; }
  if (aqi <= 150) { aqiBar.style.background = "orange"; return "Unhealthy for Sensitive"; }
  if (aqi <= 200) { aqiBar.style.background = "red"; return "Unhealthy"; }
  if (aqi <= 300) { aqiBar.style.background = "purple"; return "Very Unhealthy"; }
  aqiBar.style.background = "maroon";
  return "Hazardous";
}

// Simulation
function tickSim() {
  if (!simulate) return;
  cities.forEach(c => {
    const d = SAMPLE[c];
    d.aqi = Math.max(10, d.aqi + Math.round(Math.random() * 10 - 5));
  });
  setActiveCity(activeCity);
  renderCities();
}
setInterval(tickSim, 2000);

// Search city
document.getElementById("searchBtn").onclick = () => {
  const v = document.getElementById("searchInput").value.trim();
  if (!v) return;
  if (SAMPLE[v]) setActiveCity(v);
  else alert("City not found. Try: " + cities.join(", "));
};

// Toggle simulation
document.getElementById("simulateBtn").onclick = () => {
  simulate = !simulate;
  document.getElementById("simulateBtn").textContent = simulate ? "Stop Simulation" : "Toggle Live Simulation";
};

// Init
renderCities();
setActiveCity(activeCity);