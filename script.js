// Define API key and array to store saved searches
const apiKey = "0b92fb01220df036df043816c3457d39";
const savedSearches = [];

// Function to add a new search history entry
const addSearchHistoryEntry = (cityName) => {
  // Remove any existing entry for this city
  $(`.past-search:contains("${cityName}")`).remove();

  // Create new entry and container
  const $entry = $("<p>").addClass("past-search").text(cityName);
  const $container = $("<div>").addClass("past-search-container").append($entry);

  // Add entry to search history container
  $("#search-history-container").append($container);

  // Add city to saved searches array and local storage
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // Clear search input
  $("#search-input").val("");
};

// Function to load search history from local storage
const loadSearchHistory = () => {
  const savedSearchHistory = localStorage.getItem("savedSearches");
  if (savedSearchHistory) {
    JSON.parse(savedSearchHistory).forEach(addSearchHistoryEntry);
  }
};

// Function to update the current weather section
const updateCurrentWeather = (data, cityName) => {
  // Add city to search history
  addSearchHistoryEntry(cityName);

  // Update current weather container
  const $container = $("#current-weather-container").addClass("current-weather-container");

  // Update title with city name, date, and weather icon
  const $title = $("#current-title").text(`${cityName} (${moment().format("M/D/YYYY")})`);
  const $icon = $("#current-weather-icon").addClass("current-weather-icon")
    .attr("src", `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);

  // Update temperature, humidity, and wind speed
  $("#current-temperature").text(`Temperature: ${data.current.temp} \u00B0F`);
  $("#current-humidity").text(`Humidity: ${data.current.humidity}%`);
  $("#current-wind-speed").text(`Wind Speed: ${data.current.wind_speed} MPH`);

  // Update UV index and color
  const $uvIndex = $("#current-uv-index").text("UV Index:");
  const $uvNumber = $("#current-number").text(data.current.uvi);
  $uvNumber.removeClass("favorable moderate severe");
  if (data.current.uvi <= 2) {
    $uvNumber.addClass("favorable");
  } else if (data.current.uvi <= 7) {
    $uvNumber.addClass("moderate");
  } else {
    $uvNumber.addClass("severe");
  }
};

// Function to update the five day forecast section
function updateFiveDayForecast() {
  // Get the user's location input
  const location = document.getElementById('location-input').value;

  // Get the forecast data for the location
  const forecastData = getFiveDayForecast(location);

  // Get the forecast element
  const forecastElement = document.getElementById('five-day-forecast');

  // Clear the existing forecast content
  forecastElement.innerHTML = '';

  // Loop through the forecast data and create HTML elements for each day
  forecastData.forEach((day) => {
    // Create the HTML elements for the day's forecast
    const dayElement = document.createElement('div');
    const dateElement = document.createElement('h3');
    const tempElement = document.createElement('p');
    const conditionsElement = document.createElement('p');

    // Set the text content for the HTML elements
    dateElement.textContent = day.date;
    tempElement.textContent = `Temperature: ${day.temperature}°C`;
    conditionsElement.textContent = `Conditions: ${day.conditions}`;

    // Add the HTML elements to the day element
    dayElement.appendChild(dateElement);
    dayElement.appendChild(tempElement);
    dayElement.appendChild(conditionsElement);

    // Add the day element to the forecast element
    forecastElement.appendChild(dayElement);
  });
}
