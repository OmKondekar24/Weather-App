// Function to fetch weather based on city input
async function getWeather(event) {
  event.preventDefault(); // Prevent page reload on button click
  const cityInput = document.getElementById('city');
  const city = cityInput.value.trim();
  const apiKey = '9371e90347554ec2b7f95829251303';
  const weatherContainer = document.getElementById('weather');
  const body = document.body;

  // If input is empty, show warning
  if (city === '') {
    weatherContainer.innerHTML = `<p class="warning">Please enter a city name.</p>`;
    cityInput.style.border = '2px solid red';
    return;
  } else {
    cityInput.style.border = '1px solid #ccc'; // Reset border
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

  try {
    // Show loader animation
    weatherContainer.innerHTML = `<div class="loader"></div>`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      weatherContainer.innerHTML = `<p>${data.error.message}</p>`;
      body.className = ''; // Reset background if there's an error
    } else {
      // Reset the body class before adding the new one
      body.className = '';

      // Get weather condition
      const condition = data.current.condition.text.toLowerCase();

      // Determine weather condition class (e.g., sunny, cloudy, rainy, etc.)
      if (condition.includes("sunny")) {
        body.classList.add('sunny');
      } else if (condition.includes("cloudy")) {
        body.classList.add('cloudy');
      } else if (condition.includes("rainy") || condition.includes("drizzle")) {
        body.classList.add('rainy');
      } else if (condition.includes("snowy")) {
        body.classList.add('snowy');
      } else if (condition.includes("stormy") || condition.includes("thunder")) {
        body.classList.add('stormy');
      } else if (condition.includes("foggy")) {
        body.classList.add('foggy');
      } else if (condition.includes("windy")) {
        body.classList.add('windy');
      } else if (condition.includes("hazy")) {
        body.classList.add('hazy');
      }

      // Generate 5-day forecast
      const forecastDays = data.forecast.forecastday;
      let forecastHTML = forecastDays.map(day => {
        return `
          <div class="forecast-day">
            <h3>${day.date}</h3>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.condition.text}</p>
            <p>Max: ${day.day.maxtemp_c}°C / Min: ${day.day.mintemp_c}°C</p>
          </div>
        `;
      }).join(''); // Convert the array of strings into a single HTML string

      // Display weather information
      weatherContainer.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p><strong>${data.location.localtime}</strong></p>
        <div class="current">
          <img src="https:${data.current.condition.icon}" alt="Weather icon">
          <p>Temperature: ${data.current.temp_c}°C</p>
          <p>Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h</p>
        </div>
        <h3>3-Day Forecast:</h3>
        <div class="forecast-container">${forecastHTML}</div>
      `;
    }
  } catch (error) {
    weatherContainer.innerHTML = `<p>Failed to fetch weather data. Please try again later.</p>`;
  }
}

// Function to fetch weather based on user's geolocation
async function getWeatherByLocation(event) {
  event.preventDefault(); // Prevent page reload on button click
  const weatherContainer = document.getElementById('weather');
  const body = document.body;
  const apiKey = '9371e90347554ec2b7f95829251303';

  if (!navigator.geolocation) {
    weatherContainer.innerHTML = `<p class="warning">Geolocation is not supported by your browser.</p>`;
    return;
  }

  weatherContainer.innerHTML = `<div class="loader"></div>`;

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        weatherContainer.innerHTML = `<p class="warning">${data.error.message}</p>`;
        body.className = '';
        return;
      }

      const condition = data.current.condition.text.toLowerCase();
      body.className = '';

      const conditionsMap = {
        sunny: ['sunny', 'clear'],
        cloudy: ['cloud', 'overcast'],
        rainy: ['rain', 'drizzle', 'shower'],
        snowy: ['snow', 'blizzard'],
        stormy: ['thunder', 'storm'],
        foggy: ['fog', 'mist'],
        windy: ['wind'],
        hazy: ['haze', 'smoke']
      };

      for (let [cls, keywords] of Object.entries(conditionsMap)) {
        if (keywords.some(word => condition.includes(word))) {
          body.classList.add(cls);
          break;
        }
      }

      const forecastHTML = data.forecast.forecastday.map(day => `
        <div class="forecast-day">
          <h3>${day.date}</h3>
          <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
          <p>${day.day.condition.text}</p>
          <p>Max: ${day.day.maxtemp_c}°C / Min: ${day.day.mintemp_c}°C</p>
        </div>
      `).join('');

      weatherContainer.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p><strong>${data.location.localtime}</strong></p>
        <div class="current">
          <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
          <p>Temperature: ${data.current.temp_c}°C</p>
          <p>Humidity: ${data.current.humidity}% | Wind: ${data.current.wind_kph} km/h</p>
        </div>
        <h3>5-Day Forecast:</h3>
        <div class="forecast-container">${forecastHTML}</div>
      `;
    } catch (error) {
      weatherContainer.innerHTML = `<p class="warning">Failed to fetch weather. Please try again later.</p>`;
    }
  }, () => {
    weatherContainer.innerHTML = `<p class="warning">Unable to retrieve your location.</p>`;
  });
}
