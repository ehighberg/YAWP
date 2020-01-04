# YAWP


## Project Description

YAWP is a simple weather service querying app, with native generation and rendering of [climate maps](https://openweathermap.org/weathermap?basemap=map&cities=false&layer=temperature&lat=30&lon=-20&zoom=3) (pressure / temperature). 


## Wireframes

![mobile wireframe](https://res.cloudinary.com/ehighberg/image/upload/v1578063616/mobile_wireframe_nfppxz.png "mobile wireframe")


#### MVP 

- Find and use external api (Open Weather and Mapbox)
- Render data on page (popup at user's search location, and a few other places nearby)
- Save favorite locations for later
- Temp overlay on map

#### Post-MVP 

- Retrieve weather forecasts
- Simplest possible temp / wind model for native forecasting ( <6 hours)
- User filtering of returned data, with option to continously display a couple fields for each pin
- Get user location from browser, search for weather at their location when page loads


## Project Schedule

|  Day | Deliverable | Status
|---|---| ---|
|Jan 2rd| Project Prompt / Priority Matrix | Incomplete
|Jan 3rd| Wireframes / File Organization | Incomplete
|Jan 5th| Main Page (searchbar, current weather) | Incomplete
|Jan 6th| Map View (pins at search location and ~12 more in box) | Incomplete
|Jan 7th| MVP (Rendered climate map, saved favorites) | Incomplete
|Jan 8th| Forecasts / Info Filtering | Incomplete
|Jan 9th| Present | Incomplete


## Timeframes
| Component | Priority | Estimated Time | Time Invested | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| HTML structure | H | 2hrs | 1.75hrs | 1.5hrs |
| Basic styling | H | 3hrs | 1hrs | |
| Display searched weather | H | 3hrs | 3.5hrs | |
| Map searched location | H | 3hrs | | |
| Responsive CSS / map size | H | 2hrs | | |
| Clickable pins nearby | M | 2hrs | | |
| Saving favorite searches | M | 1.5hrs | | |
| Render temperature gradient | H | 4hrs | | |
| Other climate gradients | M | 1hr | | |
| Pressure fronts | L | 3hrs | | |
| Get forecasts from API | H | 2hrs | 0.5hrs | |
| User filtered data | M | 1.5hrs | | |
| Get user location from browser | M | 2hrs | | |
| Put some data at each pin | L | 3hrs | | |
| Animated wind / fronts | L | 4hrs | |


## Priority Matrix

![the matrix](https://res.cloudinary.com/ehighberg/image/upload/v1578063616/priority_matrix_p8qxye.png "priorities")


## API Data Sample


![weather query](https://res.cloudinary.com/ehighberg/image/upload/v1578063616/weather_query_wmgffh.png "weather query")


![background map](https://res.cloudinary.com/ehighberg/image/upload/v1578063616/base_map_wgqmgm.png "background map")



## Code Snippet

Use this section to include a brief code snippet of functionality that you are proud of an a brief description  

```
function reverse(string) {
	// here is the code to reverse a string of text
}
```

## Change Log

### [0.0.1] - 2020-01-03
- Added mobile wireframe
- Moved user location detection to post-MVP
