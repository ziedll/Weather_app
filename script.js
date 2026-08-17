/*const API_KEY = 'ESD7324LE7PSV4E6BXKWPRBNZ';
async function fetchDatawithHeader(){
    try{
        const response = await fetch('https://www.visualcrossing.com/weather-query-builder/',{
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${API_KEY}`,
                'X-API-Key' : API_KEY
            }
        });
        const data = await response.json();
        console.log(data);
    }catch(error){
        console.error(error);
    }
}*/
let cityInput = document.getElementById("city");
let searchBtn = document.getElementById("search");
let locationBtn = document.getElementById("location")
let API_key = "2548d3426398a0d799d768b43669be0a";
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let fiveDaysForecastCard = document.querySelector(".future-weather");
let aqiCard = document.querySelectorAll(".highlights .card")[0];
let aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
let humidityVal = document.getElementById('humidityVal');
let pressureVal = document.getElementById('pressureVal');
let visibilityVal = document.getElementById('visibilityVal');
let windSpeedVal = document.getElementById('windSpeedVal');
let feelsLikeVal = document.getElementById('feelsLikeVal');
let hourlyForecastCard = document.querySelector('.hourly-forecast');
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;
    let AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_key}`;
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
              <div class="actual-weather">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-icon"></div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="cloud"> 
            <hr>
            <div class="card-footer">
                <p><i class = "fa-solid fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                <p><i class="fa-solid fa-location-dot"></i>${country}</p>
                <p><i class="fa-solid fa-location-dot"></i>${name}</p>
                <p><i class="fa-solid fa-location-dot"></i>${state}</p>
            </div>`;
            const timezoneOffsetInSeconds = data.timezone;

            const sunriseLocal = moment
                .utc((data.sys.sunrise + timezoneOffsetInSeconds) * 1000)
                .format("HH:mm ");
            const sunsetLocal = moment
                .utc((data.sys.sunset + timezoneOffsetInSeconds) * 1000)
                .format("HH:mm ");
                let {visibility} = data;
                let {humidity, pressure, feels_like} = data.main;
                let {speed} = data.wind;
            sunriseCard.innerHTML = `
            <div class="card-head">
                                <p>Sunrise & Sunset</p>
                            </div>
                            <div class="sunrise-sunset">
                                <div class="item">
                                    <div class="icon">
                                        <i class="fa-solid fa-cloud-sun-rain fa-4x"></i>
                                    </div>
                                    <div> 
                                    <p>Sunrise</p>
                                <h2>${sunriseLocal}</h2></div>
                                </div>
                                <div class="item">
                            <div class="icon">
                                <i class="fa-solid fa-cloud-sun-rain fa-4x"></i>
                            </div>
                            <div>
                                <p>
                                    Sunset
                                </p>
                                <h2>${sunsetLocal}</h2>
                            </div>
                        </div>
                            </div>`;
                humidityVal.innerHTML = `${humidity}%`;
                pressureVal.innerHTML = `${pressure}hPa`;
                visibilityVal.innerHTML= `${visibility / 1000} km`;
                windSpeedVal.innerHTML = `${speed}m/s`;
                feelsLikeVal.innerHTML = `${(feels_like - 273.15).toFixed(2)} &deg;C`;
        })
        .catch(() => {
            alert("Failed to fetch");
        });
    fetch(FORECAST_API_URL)
        .then((res) => res.json())
        .then((data) => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for(i=0;i<7;i++){
                let hrForeCastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForeCastDate.getHours();
                if(hr > 24){
                    hr = 24-hr;
                }
                hourlyForecastCard.innerHTML += `
                 <div class="card">
                    <p>${hr}:00</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp -273.15).toFixed(2)}&deg;C</p>
                </div>`
            }
            let uniqueForeCastDays = [];
            let fiveDaysForecast = data.list.filter((forecast) => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForeCastDays.includes(forecastDate)) {
                    return uniqueForeCastDays.push(forecastDate);
                }
            });
            fiveDaysForecastCard.innerHTML = "";
            for (i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                <div class="weather-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="image">
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>`;
            }
        })
        .catch(() => {
            alert("failed to fetch");
        });
    fetch(AIR_POLLUTION_API_URL)
        .then((res) => res.json())
        .then((data) => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqiCard.innerHTML = `
            <div class="card-head">
                            <p>Air Quality Index</p>
                            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                        </div>    
                        <div class="air-indices">
                            <i class="fa-solid fa-wind fa-3x"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                             <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                             <div class="item">
                                <p>SO2</p>
                                <h2>${so2}</h2>
                            </div>
                             <div class="item">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                             <div class="item">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                             <div class="item">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                              <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                              <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                        </div>`;
        })
        .catch(() => {
            alert("Failed to fetch Air Quality Index");
        });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = "";
    if (!cityName) {
        return;
    }
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`failed to fetch coordinates of ${cityName}`);
        });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then (data =>{
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('Failed to fetch user coordinates');
        }), error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("geolocation permission denied");
            }
            
        }
    });
}
window.onload = () =>{
    getUserCoordinates();
};
searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);