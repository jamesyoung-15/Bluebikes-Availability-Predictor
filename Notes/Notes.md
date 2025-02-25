# Notes

## Plan

I want to build a simple predictive model that estimates the number of available bikes in a station. To do so, I will use historical bike trip data and train a model that will predict the departures and arrivals to a bike station in 10 minute intervals. Using the predicted net departure and arrivals alongside the number of available bikes in a station, we can estimate the number of bikes that should be available in a station.

## Aggregating Data

To simplify analysis and modeling, I aggregate the data into time intervals.

Eg of 10 minute intervals:

- Before aggregation

``` json
Original Trip Data

started_at: 15:51 ended_at: 16:04
started_at: 15:54 ended_at: 16:08
```

- After aggregation

``` json
Aggregated Trip Data

started_at: 15:50 ended_at: 16:00
started_at: 15:50 ended_at: 16:00
```

The reason for doing this is to simplify analysis and data modeling. The raw times are complex and noisy, so aggregating them into intervals reduces dimensionality where the model can focus on important time-based features (eg. hourly trends).
Aggregating data is also important for making the predictive model, as I want to predict the number of departures and arrivals in a station and doing so in intervals makes it easier and reduces irregularities.

Now since I want to estimate the net departures vs arrivals in each station in intervals, I will aggregate each station's arrivals and departures independently, ignoring certain details of the trip like trip duration.

Eg:

- Before aggregation and calculating departures/arrivals

``` json
Original Trip Data

start_station_id: A32012 end_station_id: E32016 started_at: 15:51 ended_at: 16:04
start_station_id: A32012 end_station_id: E32016 started_at: 15:54 ended_at: 16:08
```

- After aggregation, create seperate dfs for each station with arrivals and departures in intervals

``` json
Station ID: A32012

time: 15:00 departures: 2 arrivals: 0
time: 16:00 departures: 0 arrivals: 0
...
```

### Time Granularity

For now setting to 15 minutes, will consider other intervals in future.

Setting smaller time intervals will provide higher resolution and may capture bike usage better since most trips aren't that long, but it increases computation and introduces data sparsity, where many intervals will have few to no trips during certain periods which increases noise and makes it harder to model important trends.

Setting larger time granularity (eg. 1 hour) loses some finer-grained patterns, particularly in high-usage hours where bikes are constantly coming and going in short periods.

### Overlapping Interval Issue

One issue I had to consider is overlapping intervals when rounding time. For example, a short trip that starts at 15:51 and ends at 15:53 will both be rounded to 15:50. There are a couple of ways to resolve this:

1. Round start time with floor, end time with ceil. Eg: start: 15:51 -> 15:50, end: 15:53 -> 16:00.
2. Split departures and arrivals into independent data

The issue with solution 1 is that it causes lots of trips to be longer or shorter than they actually are, unless I make the time intervals very short (eg. 5 min intervals), which may be too granular.

The issue with solution 2 is that I potentially lose some important data that I can use in the future, such as trip durations.

Since I want to build a simple model that just predicts the net departure vs arrivals, I will use solution 2.

## AI Prompts

### Start

I want to create a blue bike predictor that predicts the number of empty bikes in 3 bike stations near my home. To do so, I have 1 year worth of blue bike data, where it tells me all trip history (departure location, arrival destination, time and date for departure and arrival, and trip duration). My plan is to calculate the arrivals and departures in 10 minute intervals from the dataset to predict the net flow in every 10 minute interval for the year. I also plan to add historical temperature and precipitation to enhance my predictor. My predictor will predict future bike net flow based on weather forecast and past historical bike trips data, and potentially add in real-time data of available bikes in stations in the future.

Is this a good approach? What should I consider?

### Data Extraction

To start with, I want to investigate the bike trip data. I have extracted all trip data from 2024 and combined them into a df called trip_data_df. In this df it has the relevant columns: started_at (datetime), ended_at (datetime), start_station_id (str), end_station_id (str).

I have 3 bike stations I would like to make 3 separate availability predictors for, with station ids = ["A32012", "E32016", "D32035"]. I want to first filter the `trip_data_df` to get the stations of interest so that I can predict the departure vs arrival to estimate availability.

Help me split the arrivals and departures seperately for each station into 15 minute intervals.
