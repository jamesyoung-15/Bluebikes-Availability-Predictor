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

### Possible Models

- Regression-Based Models
  - Linear Regression
  - Decision Tree Regressor
  - Random Forest Regressor
  - GBM (eg. XGBoost)
- Time Series Models
  - LSTM
  - TCN

## Resources

- [Bike Prediction Paper](https://ksiresearch.org/seke/dmsviva21paper/paper001.pdf)
- [Bikeshare Prediction Chicago Example Project](https://github.com/dssg/bikeshare)
- [Greenmov Blog post](https://green-mov.eu/blog/bike-availability-forecast)
- [Scikit-Learn Doc using Lagged Features for Bike Sharing Dataset](https://scikit-learn.org/stable/auto_examples/applications/plot_time_series_lagged_features.html)
