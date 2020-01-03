const apiUrl = "http://api.openweathermap.org/data/2.5/"
const apiKey = '&appid=' + '3e1f7aa5c8683821e7604c5eb70b0985'

let fieldsToDisplay = ['temp', 'precip']
// , 'wind', 'clouds', 'humidity']

const responseMap = {
  'current-weather': {
    'temp': (response) => { return kelvinToF(response.data.main.temp) },
    'precip': (response) => { return parsePrecip(response.data.weather[0]) },
    'wind': (response) => { return parseWind(response.data.wind) },
    'clouds': (response) => { return parseClouds(response.data.clouds) },
    'humidity': (response) => { return parseHumidity(response.data.main.humidity) }
  },
  'weather-forecast': {

  }
}

const print = (message) => { console.log(message) }

const setSubmitListener = () => {
  let submitButton = document.querySelector('#submit-search')
  submitButton.addEventListener('click', executeUserQuery)
}

const getUserInput = () => {
  let userQuery = document.querySelector('#user-search-query').value
  // print(`userQuery ${userQuery}`)
  return parseUserQuery(userQuery)
}

const parseUserQuery = (userQuery) => {
  let queryParts = userQuery.split(',')
  // print(queryParts)
  if (queryParts.length == 1) {
    return '?q=' + queryParts[0].trim()
  } else if (queryParts.length == 2) {
    return `?lat=${queryParts[0].trim()}&lon=${queryParts[1].trim()}`
  } else {
    alert('Invalid query, check formatting')
    return false
  }
}

async function getQueryResponse(query) {
  let queryResponse
  await axios.get(query)
    .then((response) => {
      // print(response)
      queryResponse = response
    }).catch((error) => {
      alert('Invalid search criteria, please try a city name, zipcode, or lat / long.')
      print(error)
    }).finally()
  return queryResponse
}

async function executeUserQuery() {
  event.preventDefault()
  let userQuery = getUserInput()

  let currentWeatherQuery = apiUrl + 'weather' + userQuery + apiKey
  let responseCurrent = await getQueryResponse(currentWeatherQuery)
  print(responseCurrent)
  displayWeather(responseCurrent, 'current-weather')

  let forecastWeatherQuery = apiUrl + 'forecast' + userQuery + apiKey
  let responseForecast = await getQueryResponse(forecastWeatherQuery)
  print(responseForecast)
  // displayWeather(responseForecast, 'weather-forecast')
}

const displayWeather = (response, currentOrForecast) => {
  document.querySelector(`#${currentOrForecast}`).innerHTML = ''
  fieldsToDisplay.forEach((name) => {
    displayField(response, name, currentOrForecast)
  })
}

const displayField = (response, name, currentOrForecast) => {
  // print(currentOrForecast)
  let displayContainer = document.querySelector(`#${currentOrForecast}`)

  let newField = document.createElement('p')

  newField.innerHTML = responseMap[currentOrForecast][name](response)
  newField.className = name

  displayContainer.append(newField)
}

const kelvinToF = (kelvinTemp) => {
  let tempF = Math.floor((kelvinTemp - 273.15) * 1.8 + 32)
  return addFavicon('thermometer-half', tempF + '°F')
}

const parsePrecip = (weather) => {
  let precipType = weather.main
  let iconindex = weather.icon
  let iconURL = `https://openweathermap.org/img/wn/${iconindex}.png`
  let iconStyle = 'max-height:100%;max-width:100%;'
  let iconStr = `<img src=${iconURL} style=${iconStyle}></img>`
  return `${iconStr}${precipType}`
}

const addFavicon = (iconName, textContent) => {
  return `<i class='fa fa-${iconName}'></i> ${textContent}`
}

// const displayResponse = (response) => {
//   let cityName = response.data.name
//   let currentTemp = kelvinToF(response.data.main.temp)
//   let weatherDesc = response.data.weather[0].description
//   let minTemp = kelvinToF(response.data.main.temp_min)
//   let maxTemp = kelvinToF(response.data.main.temp_max)

//   let sunriseTime = humanReadableTime(response.data.sys.sunrise)
//   let sunsetTime = humanReadableTime(response.data.sys.sunset)
//   let humidity = response.data.main.humidity
//   let pressure = response.data.main.pressure
//   let windSpeed = response.data.wind.speed
//   let windDir = response.data.wind.deg

//   document.querySelector('main').innerHTML = ''

//   displayDataField(`Here is the current weather in ${cityName}`, 'city-name')
//   displayDataField(`It is <span class='temp'>${currentTemp}°F</span> outside`, 'current-temp')
//   displayDataField(`The sky there is ${weatherDesc}`, 'weather-desc')
//   displayDataField(`Low of <span class='temp'>${minTemp}°F</span> today`, 'min-temp')
//   displayDataField(`High of <span class='temp'>${maxTemp}°F</span> today`, 'max-temp')

//   displayDataField(`Sunrise at ${sunriseTime}`, 'sunrise-time')
//   displayDataField(`Sunset at ${sunsetTime}`, 'sunset-time')
//   displayDataField(`Humidity at ${humidity}%`, 'humidity')
//   displayDataField(`Atmospheric pressure at ${pressure} millibars`, 'pressure')
//   displayDataField(`Wind speed at ${windSpeed} m/s towards ${windDir}°`, 'wind')

//   colorTempFields()
// }

const setSaveListener = () => {
  let saveButton = document.querySelector('#save-query')
  saveButton.addEventListener('click', saveQuery)
}

const saveQuery = () => {
  let userQuery = document.querySelector('#city').value
  localStorage.setItem('savedQuery', userQuery)
}

const loadSavedQuery = () => {
  let savedQuery = localStorage.getItem('savedQuery')
  if (savedQuery) {
    let userField = document.querySelector('#city')
    userField.value = savedQuery
  }
}

setSubmitListener()
setSaveListener()
loadSavedQuery()
