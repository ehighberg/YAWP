const weatherApiUrl = "http://api.openweathermap.org/data/2.5/"
const weatherApiKey = '&appid=' + '3e1f7aa5c8683821e7604c5eb70b0985'

const fieldsToDisplay = ['temp', 'precip', 'wind', 'clouds', 'humidity']

const responseMap = {
  'current-weather': {
    'temp': (response) => { return kelvinToF(response.data.main.temp) },
    'precip': (response) => { return parsePrecip(response.data.weather[0]) },
    'wind': (response) => { return parseWind(response.data.wind) },
    'clouds': (response) => { return parseClouds(response.data.clouds) },
    'humidity': (response) => { return parseHumidity(response.data.main.humidity) }
  },
  'weather-forecast': {
    'temp': (response) => { return kelvinToF(response.data.list[0].main.temp) },
    'precip': (response) => { return parsePrecip(response.data.list[0].weather[0]) },
    'wind': (response) => { return parseWind(response.data.list[0].wind) },
    'clouds': (response) => { return parseClouds(response.data.list[0].clouds) },
    'humidity': (response) => { return parseHumidity(response.data.list[0].main.humidity) }
  }
}

const elementsOfWeather = {
  'temp': (point) => { return (point.data.main.temp - 273.15) * 1.8 + 32 }
  }

const windDirMap = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

const cloudCoverMap = ['Clear', 'Partly cloudy', 'Mostly cloudy', 'Overcast']

const mapApiUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/'

const mapApiKey = '?access_token=pk.eyJ1IjoiZWhpZ2hiZXJnIiwiYSI6ImNrNHgycGxmNjB1dTQzbG9wdmloOGRtN3UifQ.13kapeks0t3GQOmTUv6fQg'

let viridis = chroma.scale(chroma.brewer.viridis).colors(256)
let viridisRGB = viridis.map(hexColor => {return hexColor + '09'})

let zoomLevel = 8
let samplesPerXY = 7
let rectSize = 9
let extraIterations = 2
let lastResponse


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
    return `?lat=${queryParts[1].trim()}&lon=${queryParts[0].trim()}`
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

  let currentWeatherQuery = weatherApiUrl + 'weather' + userQuery + weatherApiKey
  let responseCurrent = await getQueryResponse(currentWeatherQuery)
  console.log(responseCurrent)
  displayWeather(responseCurrent, 'current-weather')
  lastResponse = await responseCurrent

  let forecastWeatherQuery = weatherApiUrl + 'forecast' + userQuery + weatherApiKey
  let responseForecast = await getQueryResponse(forecastWeatherQuery)
  print(responseForecast)
  displayWeather(responseForecast, 'weather-forecast')

  let mapQuery = await queryMapBox(responseCurrent, zoomLevel)
  displayMap(mapQuery, 1.0)
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
  let tempC = Math.floor((kelvinTemp - 273.15))
  return addFavicon('thermometer-half', tempF + '°F / ' + tempC + '°C')
}

const parsePrecip = (weather) => {
  let precipType = weather.main
  let iconindex = weather.icon
  let iconURL = `https://openweathermap.org/img/wn/${iconindex}.png`
  let iconStyle = 'height:150%;'
  let iconStr = `<img src=${iconURL} style=${iconStyle}></img>`
  return `${iconStr}<p>&nbsp${precipType}</p>`
}

const parseWind = (wind) => {
  let windSpeed = (2.237 * wind.speed).toFixed(0)
  let windDir = windDirMap[Math.round(wind.deg / 45)]
  // print(`${windSpeed} ${windDir}`)
  return addFavicon('superpowers', `${windSpeed} mph ${windDir ? windDir : ''}`)
}

const parseClouds = (clouds) => {
  let cloudiness = cloudCoverMap[Math.min(Math.floor((clouds.all) / 25), 3)]
  return addFavicon('cloud', cloudiness)
}

const parseHumidity = (humidity) => {
  return addFavicon('tint', humidity + '% Humid')
}

const addFavicon = (iconName, textContent) => {
  return `<i class='fa fa-${iconName}'></i> ${textContent}`
}

async function queryMapBox(weatherResponse, zoomLevel) {
  let queryLat = weatherResponse.data.coord.lat
  let queryLon = weatherResponse.data.coord.lon
  let mapCanvas = document.querySelector('canvas')
  let mapWidth = mapCanvas.scrollWidth
  let mapHeight = mapCanvas.scrollHeight

  let queryString = `${mapApiUrl}${queryLon},${queryLat},${zoomLevel}/${mapWidth}x${mapHeight}${mapApiKey}`
  print(queryString)
  let mapImg = new Image(mapWidth, mapHeight)
  mapImg.src = queryString
  return mapImg
}

function displayMap(map, opacity) {
  let mapCanvas2DContext = document.querySelector('canvas').getContext('2d')
  setCanvasDims()
  map.onload = () => {
    mapCanvas2DContext.save()
    mapCanvas2DContext.globalAlpha = opacity
    mapCanvas2DContext.drawImage(map, 0, 0)
    mapCanvas2DContext.restore()
  }
  
}

const setCanvasDims = () => {
  let canvas = document.querySelector('canvas')
  let mapWidth = canvas.scrollWidth
  let mapHeight = canvas.scrollHeight
  canvas.height = mapHeight
  canvas.width = mapWidth
}

const setSaveListener = () => {
  let saveButton = document.querySelector('#save-query')
  saveButton.addEventListener('click', saveQuery)
}

const saveQuery = () => {
  let userQuery = document.querySelector('#user-search-query').value
  let savedName = prompt('Enter location name (work, home, etc.)')

  if (localStorage.getItem('Save a search') == 'Save a search') {
    localStorage.removeItem('Save a search')
  }

  localStorage.setItem(savedName, userQuery)
}

const populateLoadOptions = () => {
  let loadDropDown = document.querySelector('#load-query')
  let savedQueryNames = Object.keys(localStorage)
  print(savedQueryNames)

  if (savedQueryNames.length == 0) {
    localStorage.setItem('Save a search', 'Save a search')
    savedQueryNames = Object.keys(localStorage)
  }

  savedQueryNames.forEach((queryName) => {
    let newOption = document.createElement('option')
    newOption.value = queryName
    newOption.innerHTML = queryName
    loadDropDown.appendChild(newOption)
  })
}

const setLoadListener = () => {
  let loadDropDown = document.querySelector('#load-query')
  loadDropDown.addEventListener('change', loadOption)
}

const loadOption = () => {
  let selectedOption = document.querySelector('#load-query').value
  if (selectedOption != 'pick-query') {
    let selectedLocation = localStorage.getItem(selectedOption)
    let userSearchBar = document.querySelector('#user-search-query')
    userSearchBar.value = selectedLocation
    executeUserQuery()
  }
}

const getPixelCoords = (xPixel, yPixel) => {
  // Largely from https://stackoverflow.com/questions/47106276/converting-pixels-to-latlng-coordinates-from-google-static-image
  let map = document.querySelector('canvas')
  let width = map.width
  let height = map.height

  let centerLat = lastResponse.data.coord.lat
  let centerLon = lastResponse.data.coord.lon

  let degreesPerXPixel = 360 / 2 ** (zoomLevel + 9) * Math.cos(centerLat * Math.PI / 180)
  let degreesPerYPixel = 360 / 2 ** (zoomLevel + 9) * Math.cos(centerLat * Math.PI / 180)

  let pixelLat = Number((centerLat - degreesPerYPixel * (yPixel - height / 2)).toFixed(2))
  let pixelLon = Number((centerLon + degreesPerXPixel * (xPixel - width / 2)).toFixed(2))

  return {
    lat: pixelLat,
    lon: pixelLon
  }
}

const getCoordPixel = (lat, lon) => {
  let map = document.querySelector('canvas')
  let width = map.width
  let height = map.height

  let centerLat = lastResponse.data.coord.lat
  let centerLon = lastResponse.data.coord.lon

  let degreesPerXPixel = 360 / 2 ** (zoomLevel + 9) * Math.cos(centerLat * Math.PI / 180)
  let degreesPerYPixel = 360 / 2 ** (zoomLevel + 9) * Math.cos(centerLat * Math.PI / 180)

  let yPixel = Number(((lat - centerLat) / degreesPerYPixel + (height / 2)).toFixed(0))
  let xPixel = Number(((lon - centerLon) / degreesPerXPixel + (width / 2)).toFixed(0))

  return {
    x: xPixel,
    y: yPixel
  }
}


async function getPointsNearLoc() {
  let map = document.querySelector('canvas')
  let width = map.width
  let height = map.height

  let xSteps = Math.ceil(width / (samplesPerXY -1))
  let ySteps = Math.ceil(height / (samplesPerXY - 1))

  let queryGrid = []
  for (i = 0; i < samplesPerXY; i++) {
    for (j = 0; j < samplesPerXY; j++) {
      let queryLat = getPixelCoords(0, i * xSteps)['lat']
      let queryLon = getPixelCoords(j * ySteps, 0)['lon']
      let latLonQuery = `?lat=${queryLat}&lon=${queryLon}`
      // console.log(latLonQuery)
      let queryUrl = `${weatherApiUrl}weather${latLonQuery}${weatherApiKey}`
      let gridResponse = await getQueryResponse(queryUrl)
      queryGrid.push(gridResponse)
    }
  }
  // console.log(queryGrid)
  return queryGrid
}

const getGridPointVals = (gridPoints, paramToPlot) => {
  let pointVals = []
  gridPoints.forEach(gridPoint => {
    let pointStats = {
      val: Number(elementsOfWeather[paramToPlot](gridPoint).toFixed(2)),
      xPixel: getCoordPixel(0, gridPoint.data.coord.lon)['x'],
      yPixel: getCoordPixel(gridPoint.data.coord.lat, 0)['y']
    }
    pointVals.push(pointStats)    
  })
  pointVals.sort((a, b) => {return a.val - b.val})
  return pointVals
}

const getGridValRange = (points) => {
  console.log('getting gridValRange')
  return {
    low: points[0].val,
    high: points[points.length - 1].val
  }
}

const getPointRGBs = (points, gridValRange, colormap) => {
  let low = gridValRange.low
  let high = gridValRange.high

  let valueMap = colormap.length / (high - low)
  let rgbs = points.map((point) => {
    // console.log((point.val - low) * valueMap)
    return colormap[Math.min(Math.floor((point.val - low) * valueMap), 255)]
  })
  return rgbs
}

const plotPointRGBs = (points, pointRGBs) => {
  let ctx = document.querySelector('canvas').getContext('2d')
  for (i = 0; i < points.length; i++) {
    ctx.beginPath()
    ctx.fillStyle = pointRGBs[i]
    ctx.rect(points[i]['xPixel'] - (rectSize - 1) / 2,
      points[i]['yPixel'] - (rectSize - 1) / 2,
      rectSize, rectSize)
    ctx.fill()
  }
}

async function interpolateRGBs (gridPoints, gridValRange, colormap) {
  gridPoints.sort((a, b) => {return a.xPixel - b.xPixel})
  let initialGap = gridPoints[samplesPerXY].xPixel - (rectSize - 1)
  let totalGap = initialGap
  let numSquares = 1
  let numInterpolations = extraIterations
  console.log('initial gap ' + initialGap + ' pixels')

  while (totalGap > 0) {
    totalGap -= rectSize * numSquares
    numSquares *= 2
    numInterpolations++
  }

  console.log(`doing ${numInterpolations + 1} iterations`)
  for (k = 0; k <= numInterpolations; k++) {
    console.log(`iteration ${k}`)
    let distinctXVals = distinctXYVals(gridPoints, 'x')
    // console.log(distinctXVals)
    let distinctYVals = distinctXYVals(gridPoints, 'y')
    // console.log(distinctYVals)
    if (k <= numInterpolations) {
      interpolatePoints(gridPoints, distinctXVals, 'x')
    }
    if (k <= numInterpolations - 1) {
      interpolatePoints(gridPoints, distinctYVals, 'y')
    }
  }
  let allRGBs = getPointRGBs(gridPoints, gridValRange, colormap)
  plotPointRGBs(gridPoints, allRGBs)
}

const distinctXYVals = (gridPoints, xORy) => {
  // console.log(gridPoints)
  let pixelVals = []
  gridPoints.forEach((point) => {
    // console.log(point[`${xORy}Pixel`])
    pixelVals.push(point[`${xORy}Pixel`])
  })
  // console.log(pixelVals)
  let uniqueVals = [...new Set(pixelVals)]
  return uniqueVals
}

const interpolatePoints = (points, distinctVals, xORy) => {
  let otherOfXOrY = (xORy == 'x') ? 'y' : 'x'
  let newPoints = []
  distinctVals.forEach((value) => {
    let oldPointsInLine = points.filter((point) => 
      point[`${xORy}Pixel`] == value
    )

    oldPointsInLine.sort((a, b) => {
      return a[`${otherOfXOrY}Pixel`] - b[`${otherOfXOrY}Pixel`]
    })

    // console.log('numOldPoints ' + oldPointsInLine.length)
    oldPointsInLine.forEach((point, index) => {
      if (index > 0) {
        let newPoint = {
          val: Number(((point['val'] + oldPointsInLine[index - 1]['val']) / 2).toFixed(2))
        }
        newPoint[`${xORy}Pixel`] = value
        newPoint[`${otherOfXOrY}Pixel`] = Number(((point[`${otherOfXOrY}Pixel`] + oldPointsInLine[index - 1][`${otherOfXOrY}Pixel`]) / 2).toFixed(0))
        newPoints.push(newPoint)
      }
    })
  })
  // console.log('numNewPoints ' + newPoints.length)
  newPoints.forEach(point => {points.push(point)})
}

async function plotHeatMap(elementOfWeather) {
  let gridPoints = await getPointsNearLoc()
  console.log(gridPoints)
  let gridPointVals = getGridPointVals(gridPoints, elementOfWeather)
  console.log(gridPointVals)
  let gridValRange = getGridValRange(gridPointVals)
  console.log(gridValRange)
  interpolateRGBs(gridPointVals, gridValRange, viridisRGB)
}


setSubmitListener()
setSaveListener()
populateLoadOptions()
setLoadListener()
console.log('listeners set')

// REMOVE WHEN DONE DEVELOPING OR REPLACE WITH LOCATION DETECTION
document.querySelector('#submit-search').click()

setTimeout(function () {

  plotHeatMap('temp')

}, 500)
