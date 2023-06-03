function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentDay = days[date.getDay()];
  let currentMonth = months[date.getMonth()];
  let currentDate = String(date.getDate()).padStart(2, "0");

  let formattedDate = `${currentDay} ${currentDate} ${currentMonth}`;
  return formattedDate;
}

function formatTime(time) {
  let currentHours = String(time.getHours()).padStart(2, "0");
  let currentMinutes = String(time.getMinutes()).padStart(2, "0");
  let formattedTime = `${currentHours}:${currentMinutes}`;
  return formattedTime;
}

function formatDay(timestamp) {
  console.log(timestamp);
  let date = new Date(timestamp * 1000);
  console.log(date);
  let day = date.getDay();
  console.log(day);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function showWeather(response) {
  let userCityElement = document.querySelector("#user-city");
  let currentTempElement = document.querySelector("#temp-value");
  let maxTempElement = document.querySelector("#max-temp-value");
  let minTempElement = document.querySelector("#min-temp-value");
  let humidityElement = document.querySelector("#humidity-value");
  let windElement = document.querySelector("#wind-value");
  let descriptionElement = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#weather-icon");

  celciusTemperature = response.data.main.temp;
  maxCelciusTemperature = response.data.main.temp_max;
  minCelciusTemperature = response.data.main.temp_min;

  //This is to revert back to celcius as the default to prevent bugs. A different work-around would probably be better but this works for the time being.
  let currentTempUnitElement = document.querySelector("#temp-unit");
  currentTempUnitElement.innerHTML = "°C";
  let maxTempUnitElement = document.querySelector("#max-temp-unit");
  maxTempUnitElement.innerHTML = "°C";
  let minTempUnitElement = document.querySelector("#min-temp-unit");
  minTempUnitElement.innerHTML = "°C";
  toCelciusButton.classList.add("inactive");
  toFarenheitButton.classList.remove("inactive");

  metrespersecondWindSpeed = response.data.wind.speed;

  //same as above
  let currentWindUnitElement = document.querySelector("#wind-unit");
  currentWindUnitElement.innerHTML = " m/s";
  toMetrespersecondButton.classList.add("inactive");
  toMphButton.classList.remove("inactive");

  let currentTemp = Math.round(celciusTemperature);
  let maxTemp = Math.round(maxCelciusTemperature);
  let minTemp = Math.round(minCelciusTemperature);
  let humidity = `${response.data.main.humidity}%`;
  let wind = Math.round(metrespersecondWindSpeed * 10) / 10;
  let description = response.data.weather[0].description;
  let iconCode = response.data.weather[0].icon;

  userCityElement.innerHTML = response.data.name;
  currentTempElement.innerHTML = currentTemp;
  maxTempElement.innerHTML = maxTemp;
  minTempElement.innerHTML = minTemp;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = wind;
  descriptionElement.innerHTML = description;

  iconElement.setAttribute("src", `../img/${iconCode}.svg`);
  iconElement.setAttribute("alt", description);

  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiKey = "bd3bb6534458ba51b48c49f5155745b6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(showForecast);
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = ``;
  forecast.forEach(function (day, index) {
    if (index > 0 && index < 7) {
      let iconCode = day.weather[0].icon;
      let description = day.weather[0].description;
      forecastMaxCelciusTemperature = day.temp.max;
      forecastMinCelciusTemperature = day.temp.min;
      console.log(forecastMaxCelciusTemperature);
      console.log(forecastMinCelciusTemperature);
      forecastHTML += `
          <div class="col-sm">
            <h4 class="day">${formatDay(day.dt)}</h4>
            <div class="row">
              <div class="col">
                <img class="forecast-icon" src="../img/${iconCode}.svg" alt="${description}"/>
              </div>
              <div class="col">
                <p>
                  <span class="max-forecast-value high">${Math.round(
                    forecastMaxCelciusTemperature
                  )}</span
                      ><span class="max-forecast-unit high forecast-unit">°C</span>
                </p>
                <p>
                  <span class="min-forecast-value">${Math.round(
                    forecastMinCelciusTemperature
                  )}</span
                      ><span class="min-forecast-unit forecast-unit">°C</span>
                </p>
              </div>
            </div>
          </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function searchCity(event) {
  event.preventDefault();
  let searchBar = document.querySelector("#search-bar");
  let userCity = searchBar.value;
  console.log(userCity);
  let apiKey = "ece424250b8bd634c2653a8886cce7a1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  let userCityHeading = document.querySelector("#user-city");
  userCityHeading.innerHTML = `${userCity}`;
  axios.get(apiUrl).then(showWeather);
}

function getPosition(position) {
  let apiKey = "ece424250b8bd634c2653a8886cce7a1";
  let currentLat = position.coords.latitude;
  let currentLon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  console.log(apiUrl);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function toFarenheit(event) {
  event.preventDefault();
  let currentTempValueElement = document.querySelector("#temp-value");
  let currentTempUnitElement = document.querySelector("#temp-unit");
  let maxTempValueElement = document.querySelector("#max-temp-value");
  let maxTempUnitElement = document.querySelector("#max-temp-unit");
  let minTempValueElement = document.querySelector("#min-temp-value");
  let minTempUnitElement = document.querySelector("#min-temp-unit");

  let maxForecastValueElement = document.querySelector(".max-forecast-value");
  let maxForecastUnitElement = document.querySelector(".max-forecast-unit");
  let minForecastValueElement = document.querySelector(".min-forecast-value");
  let minForecastUnitElement = document.querySelector(".min-forecast-unit");

  let farenheitTemperature = celciusTemperature * 1.8 + 32;
  let maxFarenheitTemperature = maxCelciusTemperature * 1.8 + 32;
  let minFarenheitTemperature = minCelciusTemperature * 1.8 + 32;
  let forecastMaxFarenheitTemperature =
    forecastMaxCelciusTemperature * 1.8 + 32;
  let forecastMinFarenheitTemperature =
    forecastMinCelciusTemperature * 1.8 + 32;

  toCelciusButton.classList.remove("inactive");
  toFarenheitButton.classList.add("inactive");

  currentTempValueElement.innerHTML = Math.round(farenheitTemperature);
  currentTempUnitElement.innerHTML = "°F";
  maxTempValueElement.innerHTML = Math.round(maxFarenheitTemperature);
  maxTempUnitElement.innerHTML = "°F";
  minTempValueElement.innerHTML = Math.round(minFarenheitTemperature);
  minTempUnitElement.innerHTML = "°F";

  maxForecastValueElement.innerHTML = Math.round(
    forecastMaxFarenheitTemperature
  );
  maxForecastUnitElement.innerHTML = "°F";
  minForecastValueElement.innerHTML = Math.round(
    forecastMinFarenheitTemperature
  );
  minForecastUnitElement.innerHTML = "°F";
}

function toCelcius(event) {
  event.preventDefault();
  let currentTempValueElement = document.querySelector("#temp-value");
  let currentTempUnitElement = document.querySelector("#temp-unit");
  let maxTempValueElement = document.querySelector("#max-temp-value");
  let maxTempUnitElement = document.querySelector("#max-temp-unit");
  let minTempValueElement = document.querySelector("#min-temp-value");
  let minTempUnitElement = document.querySelector("#min-temp-unit");

  toFarenheitButton.classList.remove("inactive");
  toCelciusButton.classList.add("inactive");

  currentTempValueElement.innerHTML = Math.round(celciusTemperature);
  currentTempUnitElement.innerHTML = "°C";
  maxTempValueElement.innerHTML = Math.round(maxCelciusTemperature);
  maxTempUnitElement.innerHTML = "°C";
  minTempValueElement.innerHTML = Math.round(minCelciusTemperature);
  minTempUnitElement.innerHTML = "°C";
}

function toMph(event) {
  event.preventDefault();
  let currentWindValueElement = document.querySelector("#wind-value");
  let currentWindUnitElement = document.querySelector("#wind-unit");

  let mphWindSpeed = metrespersecondWindSpeed * 2.237;

  toMetrespersecondButton.classList.remove("inactive");
  toMphButton.classList.add("inactive");

  currentWindValueElement.innerHTML = Math.round(mphWindSpeed * 10) / 10;
  currentWindUnitElement.innerHTML = " mph";
}

function toMetrespersecond(event) {
  event.preventDefault();
  let currentWindValueElement = document.querySelector("#wind-value");
  let currentWindUnitElement = document.querySelector("#wind-unit");

  toMphButton.classList.remove("inactive");
  toMetrespersecondButton.classList.add("inactive");

  currentWindValueElement.innerHTML =
    Math.round(metrespersecondWindSpeed * 10) / 10;
  currentWindUnitElement.innerHTML = " m/s";
}

let now = new Date();
let fullDate = document.querySelector("#full-date");
let currentTime = document.querySelector("#current-time");
fullDate.innerHTML = formatDate(now);
currentTime.innerHTML = formatTime(now);

navigator.geolocation.getCurrentPosition(getPosition);

let celciusTemperature = null;
let maxCelciusTemperature = null;
let minCelciusTemperature = null;
let metrespersecondWindSpeed = null;
let forecastMaxCelciusTemperature = null;
let forecastMinCelciusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentLocation);

let toFarenheitButton = document.querySelector("#farenheit-button");
toFarenheitButton.addEventListener("click", toFarenheit);

let toCelciusButton = document.querySelector("#celcius-button");
toCelciusButton.addEventListener("click", toCelcius);

let toMphButton = document.querySelector("#mph-button");
toMphButton.addEventListener("click", toMph);

let toMetrespersecondButton = document.querySelector("#metrespersecond-button");
toMetrespersecondButton.addEventListener("click", toMetrespersecond);
