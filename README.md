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
|Jan 2rd| Project Prompt / Priority Matrix | Complete
|Jan 3rd| Wireframes / File Organization | Complete
|Jan 5th| Main Page (searchbar, current weather) | Complete
|Jan 6th| Map View | Complete
|Jan 7th| MVP (Rendered climate map, saved favorites) | Incomplete
|Jan 8th| Forecasts / Info Filtering | Incomplete
|Jan 9th| Present | Incomplete


## Timeframes
| Component | Priority | Estimated Time | Time Invested | Actual Time |
| --- | :---: |  :---: | :---: | :---: |
| HTML structure | H | 2hrs | 1.75hrs | 1.5hrs |
| Basic styling | H | 3hrs | 1hrs | |
| Display searched weather | H | 3hrs | 3.5hrs | |
| Get forecasts from API | H | 2hrs  | 1hrs | |
| Map searched location | H | 3hrs | 5hrs | |
| Responsive CSS / map size | H | 2hrs | 1.5hrs| |
| Saving favorite searches | M | 1.5hrs | 1hrs| |
| Render temperature gradient | H | 4hrs | 6hrs| |
| Other climate gradients | M | 1hr | | |
| Pressure fronts | L | 3hrs | | |

## Change Log

### [0.1] - 2020-01-03
- Added mobile wireframe
- Moved user location detection to post-MVP

### [0.2] - 2020-01-06
- Removed clickable markers from project