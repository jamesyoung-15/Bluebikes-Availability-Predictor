# Available Bluebikes Predictor

An application for making future predictions of the number of Bluebikes that will be available at 3 stations near my apartment in Boston using machine learning.

See application [here](https://bluebikepredictor.jyylab.com)

## Project Motivation

I use Bluebikes regularly to get around. However, at times there are no available blue bikes in specific stations for certain hours of the day. So, I made this project for fun to gain some insights into commuting patterns for blue bikes near my home so that I know when and which stations are likely to have available bikes when I leave my home.

## Project Info

### Dataset

I will be using Bluebikes trip history data from 2024, as one of the station was just recently opened in mid-December 2023. Unfortunately, I do not believe there is a recorded historical record of number of available bikes in stations, so I can only estimate the departures and arrivals into a station based on trip data history.

For weather, I will just be considering temperature and precipitation for now, although I may add other features like wind speed in the future.

Below are the data sources:

- [Official Bluebike Historical Trip Dataset](https://bluebikes.com/system-data)
- [Hourly Weather Data](https://open-meteo.com/en/docs/historical-weather-api#latitude=52.52&longitude=13.41&hourly=temperature_2m,precipitation&daily=&models=)

### Prediction Model

There are two predictors for each station: arrivals and departures prediction. The predictor takes inputs of time (minute, hour, day, month) and weather (temperature and precipitation) to estimate the number of arrivals and departures for each station. Using the estimated arrivals and departures, I can get the net flow (arrivals - departure), which can be used to estimate the number of available bikes in the station.

<!-- ### API  -->
