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
let API_key = "2548d3426398a0d799d768b43669be0a";
let currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;
    
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
    fetch(WEATHER_API_URL).then((res) => res.json())
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
                <p><i class = "fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i>___</p>
            </div>`;
        })
        .catch(() => {
            alert("Failed to fetch");
        });
        fetch(FORECAST_API_URL).then((res)=> res.json()).then((data)=> {
            let uniqueForeCastDays = [];
            let fiveDaysForecast = data.list.filter(forecast =>{
                let forecastDate = new Date (forecast.dt_txt).getDate();
                if(!uniqueForeCastDays.includes(forecastDate)){
                    return uniqueForeCastDays.push(forecastDate);
                }
            });
            console.log(fiveDaysForecast);
        }).catch(()=>{
            alert('failed to fetch');
        });
}
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = "";
    if (!cityName) {
        return;
    }
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            let { name, lat, lon, country, state} = data[0] ;
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`failed to fetch coordinates of ${cityName}`);
        });
}
searchBtn.addEventListener("click", getCityCoordinates);
