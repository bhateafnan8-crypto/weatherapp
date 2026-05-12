let div = document.getElementById("div")
let inp = document.getElementById("inp")
let btn = document.getElementById("btn")
let lists = document.getElementById("lists")
let weatherDesc = document.getElementById("weatherDesc")
let humidity = document.getElementById("humidity")
let temp_C = document.getElementById("temp_C")
let contentSection = document.getElementById("content-section")
let error = document.getElementById("error")
let container = document.querySelector("#container")

async function getWeather(e) {
    try {
        e.preventDefault()
        if (!inp.value) {
            error.style.display = "block"
            container.style.display = "none"
            error.innerText = `Please enter your city name `
        }
        else {
            // console.clear()
            weatherDesc.innerText = "";
            humidity.innerText = "";
            temp_C.innerText = "";

            let city = inp.value.trim();

            // Geo fetch
            let geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
            let geoData = await geoResponse.json()

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("City not found")
            }

            let lat = geoData.results[0].latitude
            let lon = geoData.results[0].longitude

            // Weather fetch
            let weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`)
            let data = await weatherResponse.json()

            // Weather code mapping
            const weatherCodes = {
                0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
                45: "Fog", 48: "Icy Fog", 51: "Light Drizzle", 53: "Moderate Drizzle",
                55: "Heavy Drizzle", 61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain",
                71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow",
                80: "Light Showers", 81: "Moderate Showers", 82: "Heavy Showers",
                95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Thunderstorm with Heavy Hail"
            }

            let desc = (weatherCodes[data.current_weather.weathercode] || "Clear Sky").toLowerCase()

            // Tera icon logic same
            let icon = "wi wi-day-sunny";
            if (desc.includes("sunny") || desc.includes("clear")) { icon = "wi wi-day-sunny"; }
            else if (desc.includes("cloud") || desc.includes("overcast")) { icon = "wi wi-cloudy"; }
            else if (desc.includes("rain") || desc.includes("drizzle")) { icon = "wi wi-rain"; }
            else if (desc.includes("thunder") || desc.includes("storm")) { icon = "wi wi-thunderstorm"; }
            else if (desc.includes("snow")) { icon = "wi wi-snow"; }
            else if (desc.includes("fog")) { icon = "wi wi-fog"; }

            weatherDesc.innerHTML = `Weather Description: ${weatherCodes[data.current_weather.weathercode]} <i class="${icon}"></i>`;
            humidity.innerText = `Humidity: ${data.hourly.relativehumidity_2m[0]}%`;
            temp_C.innerText = `Temperature Celsius: ${data.current_weather.temperature}°C`;

            error.style.display = "none"
            container.style.display = "grid";
            container.style.gap = "2rem";
            container.style.gridTemplateColumns = "repeat(auto-fill, minmax(50%, 1fr))";

            inp.value = "";
        }
        // else {
        //     console.clear()
        //     weatherDesc.innerText = "";
        //     humidity.innerText = "";
        //     temp_C.innerText = "";
        //     let city = inp.value;
        //     let response = await fetch(`https://wttr.in/${city}?format=j1`)
        //     let data = await response.json()

        //     // let li = document.createElement("li")



        //     let desc = data.current_condition[0].weatherDesc[0].value.toLowerCase();

        //     let icon = "wi wi-day-sunny";

        //     if (desc.includes("sunny") || desc.includes("clear")) {
        //         icon = "wi wi-day-sunny";
        //     }

        //     else if (desc.includes("cloud") || desc.includes("overcast")) {
        //         icon = "wi wi-cloudy";
        //     }

        //     else if (desc.includes("rain") || desc.includes("drizzle")) {
        //         icon = "wi wi-rain";
        //     }

        //     else if (desc.includes("thunder") || desc.includes("storm")) {
        //         icon = "wi wi-thunderstorm";
        //     }

        //     else if (
        //         desc.includes("snow") ||
        //         desc.includes("blizzard") ||
        //         desc.includes("sleet")
        //     ) {
        //         icon = "wi wi-snow";
        //     }

        //     else if (
        //         desc.includes("fog") ||
        //         desc.includes("mist") ||
        //         desc.includes("haze") ||
        //         desc.includes("smoke")
        //     ) {
        //         icon = "wi wi-fog";
        //     }

        //     else if (
        //         desc.includes("wind") ||
        //         desc.includes("breezy")
        //     ) {
        //         icon = "wi wi-strong-wind";
        //     }

        //     weatherDesc.innerHTML =
        //         `Weather Description: ${data.current_condition[0].weatherDesc[0].value} <i class="${icon}"></i>`;
        //     // weatherDesc.innerText = `${data.current_condition[0].weatherDesc[0].value}`;
        //     humidity.innerText = `Humidity: ${data.current_condition[0].humidity}%`;
        //     temp_C.innerText = `Temperature_Celcius: ${data.current_condition[0].temp_C}°C`;
        //     error.style.display = "none"

        //     container.style.display = "grid";
        //     container.style.gap = "2rem";
        //     container.style.gridTemplateColumns = "repeat(auto-fill, minmax(50%, 1fr))";

        //     console.log(data)
        //     console.log(data.current_condition[0])

        //     inp.value = "";

        //     // lists.appendChild(li)


        // }
    }
    catch (err) {
        // error.innerText = `${err}`
        error.innerText = `City Not Found`
        error.style.display = "block"
        container.style.display = "none"
    }

}
// getWeather()

btn.addEventListener("click", getWeather)