const apiKey = '1b18ce13c84e21faafb19c931bb29331'; 
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchHistory = document.querySelector('#search-history');
const weatherInfo = document.querySelector('#weather-info');

let cities = [];

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	const city = searchInput.value.trim();
	if (city) {
		getWeather(city);
		searchInput.value = '';
	}
});

searchHistory.addEventListener('click', e => {
	if (e.target.tagName === 'BUTTON') {
		const city = e.target.textContent;
		getWeather(city);
	}
});

function saveCity(city) {
	if (!cities.includes(city)) {
		cities.push(city);
		localStorage.setItem('cities', JSON.stringify(cities));
		addCityButton(city);
	}
}

function loadCities() {
	const savedCities = localStorage.getItem('cities');
	if (savedCities) {
		cities = JSON.parse(savedCities);
		cities.forEach(city => addCityButton(city));
	}
}

function addCityButton(city) {
	const button = document.createElement('button');
	button.textContent = city;
	searchHistory.appendChild(button);
}

async function getWeather(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	const response = await fetch(url);
	if (response.ok) {
		const data = await response.json();
		const lat = data.coord.lat;
		const lon = data.coord.lon;
		const name = data.name;
		saveCity(name);
		displayCurrentWeather(data);
		displayForecastWeather(lat, lon);
	} else {
		alert('City not found. Please try again.');
	}
}

async function getForecastWeather(lat, lon) {
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
	const response = await fetch(url);
	if (response.ok) {
		const data = await response.json();
		displayForecast(data);
	} else {
		alert('Error fetching forecast data. Please try again.');
	}
}

function displayCurrentWeather(data) {
	const name = data.name;
	const date = new Date(data.dt * 1000).toLocaleDateString('en-US');
	const icon = data.weather[0].icon;
	const temp = Math.round(data.main.temp);
	const humidity = data.main.humidity;
	const windSpeed = data.wind.speed;

	const html = `
		<h2>${name} (${date}) <img src="https://openweathermap.org/img/wn/${icon}.png"></h2>
		<p>Temperature: ${temp} &deg;C</p>
		<p>Humidity: ${humidity}%</p>
		<p>Wind Speed: ${windSpeed} m/s</p>
	`;

	weatherInfo.innerHTML = html;
}

function displayForecastWeather(lat, lon) {
	getForecastWeather(lat, lon);
}

function displayForecast(data) {
	const forecast = data.daily.slice(1, 6);
	let html = '<h3>5-Day Forecast:</h3><div class="forecast">';

	forecast.forEach(day => {
		const date = new Date(day.dt * 1000).toLocaleDateString('en-US');
		const icon = day.weather[0].icon;
		const temp = Math.round(day.temp.day);
		const windSpeed = day.wind_speed;
		const humidity = day.humidity;

		html += `
			<div class="day">
				<p class="date">${date}</p>
				<img src="https://openweathermap.org/img/wn/${icon}.png">
        <p>Temp: ${temp}&deg;C</p>
        <p>Wind: ${windSpeed}m/s</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  });
  
  html += '</div>';
  weatherInfo.innerHTML += html;
}

loadCities();
  
