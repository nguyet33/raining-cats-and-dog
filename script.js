// Define the API key and an array to store saved searches
var apiKey = "1b18ce13c84e21faafb19c931bb29331";
var savedSearches = [];

// Add a new search to the search history
function addSearchToHistory(cityName) {
  // If the search history already contains the city, remove it
  $('.past-search:contains("' + cityName + '")').remove();

  // Create a new entry for the city in the search history
  var entry = $("<p>").addClass("past-search").text(cityName);
  var container = $("<div>").addClass("past-search-container").append(entry);
  $("#search-history-container").append(container);

  // Add the city to the saved searches array and update local storage
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
}

// Load the saved search history into the search history container
function loadSearchHistory() {
  var savedSearchHistory = localStorage.getItem("savedSearches");
  if (savedSearchHistory) {
    savedSearches = JSON.parse(savedSearchHistory);
    savedSearches.forEach(addSearchToHistory);
  }
}

// Get the current weather for a city and update the current weather section
function updateCurrentWeather(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(response => {
      var lon = response.coord.lon;
      var lat = response.coord.lat;

      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(response => {
          addSearchToHistory(cityName);

          $("#current-weather-container").addClass("current-weather-container");

          var currentTitle = $("#current-title");
          currentTitle.text(`${cityName} (${moment().format("M/D/YYYY")})`);
          $("#current-weather-icon").attr("src", `https://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`);
          $("#current-temperature").text(`Temperature: ${response.current.temp} \u00B0F`);
          $("#current-humidity").text(`Humidity: ${response.current.humidity}%`);
          $("#current-wind-speed").text(`Wind Speed: ${response.current.wind_speed} MPH`);
          $("#current-uv-index").text("UV Index: ").append($("<span>").addClass("current-number").text(response.current.uvi).addClass(response.current.uvi <= 2 ? "favorable" : response.current.uvi <= 7 ? "moderate" : "severe"));
        });
    })
    .catch(() => alert("We could not find the city you searched for. Try searching for a valid city."));
}

// Get the five day forecast for a city and update the five day forecast section
function updateFiveDayForecast(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(response => {
      //...Skipped
    })
    .catch(() => alert("We could not find the city you searched for. Try searching for a valid city."));
}

// When the page is loaded, load the search history and add an event listener to the search button
$(document).ready(function() {
  // Load search history from local storage
  var searchHistory = localStorage.getItem('searchHistory');
  if (searchHistory) {
    // Do something with search history data
  }

  // Add event listener to search button
  $('#searchButton').on('click', function() {
    // Do something when search button is clicked
  });
});

// // called when a search history entry is clicked
// $("#search-history-container").on("click", "p", function () {
//   // get text (city name) of entry and pass it as a parameter to display weather conditions
//   var previousCityName = $(this).text();
//   currentWeatherSection(previousCityName);
//   fiveDayForecastSection(previousCityName);

//   //
//   var previousCityClicked = $(this);
//   previousCityClicked.remove();
// });

// loadSearchHistory();
