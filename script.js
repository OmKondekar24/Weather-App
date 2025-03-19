async function getWeather() {
  const cityInput = document.getElementById('city');
  const city = cityInput.value.trim();
  const apiKey = '9371e90347554ec2b7f95829251303';
  const weatherContainer = document.getElementById('weather');

  // If input is empty, show warning
  if (city === '') {
    weatherContainer.innerHTML = `<p class="warning">Please enter a city name.</p>`;
    cityInput.style.border = '2px solid red';
    return;
  } else {
    cityInput.style.border = '1px solid #ccc'; // Reset border
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    // Show loader animation
    weatherContainer.innerHTML = `<div class="loader"></div>`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      weatherContainer.innerHTML = `<p>${data.error.message}</p>`;
    } else {
      weatherContainer.innerHTML = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p><strong>${data.location.localtime}</strong></p>
        <img src="https:${data.current.condition.icon}" alt="Weather icon">
        <p>Temperature: ${data.current.temp_c}°C</p>
        <p>Weather: ${data.current.condition.text}</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind Speed: ${data.current.wind_kph} km/h</p>
      `;
    }
  } catch (error) {
    weatherContainer.innerHTML = `<p>Failed to fetch weather data. Please try again later.</p>`;
  }
}
