const API_KEY = "138c3873b29710119937396d64c1b530";

document.getElementById("btnWeather").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Wpisz nazwę miasta!");

  getCurrentWeather(city);
  getForecast(city);
});

function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.onload = function () {
    console.log("Odpowiedz API (current):", xhr.responseText);
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      renderToday(data);
    } else {
      document.getElementById("todayPanel").innerHTML =
        "<p>Nie znaleziono miasta.</p>";
    }
  };

  xhr.send();
}

function renderToday(data) {
  document.getElementById("todayTitle").textContent = `${data.name} – Dzisiaj`;
  document.getElementById("todayDesc").textContent = data.weather[0].description;
  document.getElementById("todayTemp").innerHTML = `<strong>${data.main.temp}°C</strong>`;
  document.getElementById("todayDetails").innerHTML =
    `Wilgotność: ${data.main.humidity}% • Wiatr: ${data.wind.speed} m/s`;
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Odpowiedz API (forecast):", data);
      renderForecastDays(data);
      drawTemperatureChart(data);
    })
    .catch(() => {
      document.getElementById("forecast").innerHTML =
        "<p>Blad pobierania prognozy.</p>";
    });
}

function drawTemperatureChart(data) {
  const canvas = document.getElementById("tempChart");
  const ctx = canvas.getContext("2d");
  const hours = data.list.slice(0, 9);
  const temps = hours.map(h => h.main.temp);
  const labels = hours.map(h => h.dt_txt.split(" ")[1].slice(0, 5));

  const minTemp = Math.min(...temps) - 1;
  const maxTemp = Math.max(...temps) + 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const left = 40;
  const bottom = 230;
  const top = 10;
  const right = canvas.width - 20;

  const usableWidth = right - left;
  const stepX = usableWidth / (temps.length - 1);

  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  ctx.strokeStyle = "#2a4d69";
  ctx.lineWidth = 2;
  ctx.beginPath();

  temps.forEach((t, i) => {
    const x = left + i * stepX;
    const y = bottom - ((t - minTemp) / (maxTemp - minTemp)) * (bottom - top);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  temps.forEach((t, i) => {
    const x = left + i * stepX;
    const y = bottom - ((t - minTemp) / (maxTemp - minTemp)) * (bottom - top);

    ctx.fillStyle = "#4b86b4";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`${t.toFixed(1)}°`, x - 10, y - 10);
  });

  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";

  labels.forEach((label, i) => {
    const x = left + i * stepX;
    ctx.fillText(label, x - 15, bottom + 15);
  });
}

function renderForecastDays(data) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";

  const days = {};

  data.list.forEach(item => {
    const day = item.dt_txt.split(" ")[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });

  Object.keys(days).slice(1, 6).forEach(day => {
    const items = days[day];
    const temps = items.map(i => i.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const desc = items[0].weather[0].description;

    const div = document.createElement("div");
    div.className = "forecast-item";

    div.innerHTML = `
            <h4>${day}</h4>
            <p>${desc}</p>
            <p><strong>${max.toFixed(1)}° / ${min.toFixed(1)}°</strong></p>
        `;

    container.appendChild(div);
  });
}
