from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from datetime import datetime, timedelta
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

station_ids = ['A32012', 'E32016', 'D32035']
station_external_ids = {"f8348136-0de8-11e7-991c-3863bb43a7d0": "A32012", 
                        "fae99a0c-e88a-4112-94d8-f655cf34e651": 'E32016', 
                        "bb27977d-36c1-496d-8bac-631b612dd7b8": "D32035"}

station_names = {   "A32012" : "Packard's Corner - Commonwealth Ave at Brighton Ave",
                    "E32016" : "Commonwealth Ave at Naples Rd",
                    "D32035" : "Harvard Ave at Brainerd Rd",}

def load_models():
    """ 
    Loads trained models for each station
    Returns a dictionary with model objects 
    """
    station_ids = ['A32012', 'E32016', 'D32035']
    models = {}

    for station_id in station_ids:
        with open(f"models_15min/{station_id}_arrivals_gb_model.pkl", "rb") as file:
            models[f"{station_id}_arrivals"] = pickle.load(file)
        with open(f"models_15min/{station_id}_departures_gb_model.pkl", "rb") as file:
            models[f"{station_id}_departures"] = pickle.load(file)
    return models

def get_weather_forecast():
    """
    Retrieves the weather forecast for Boston with Open-Meteo API
    Returns a dictionary with temperature and precipitation values
    """
    api = "https://api.open-meteo.com/v1/forecast?latitude=42.3584&longitude=-71.1259&hourly=temperature_2m,precipitation&timezone=America%2FNew_York&forecast_days=1"
    response = requests.get(api)
    weather_data = response.json()
    return {"temperature": weather_data["hourly"]["temperature_2m"], "precipitation": weather_data["hourly"]["precipitation"]}

def round_to_nearest(dt, interval_minutes=15):
    """ Rounds a datetime object to the nearest interval """
    minute = (dt.minute // interval_minutes) * interval_minutes
    # if dt.minute % interval_minutes >= interval_minutes//2 + 1:  # round up if halfway or more
    #     minute += interval_minutes
    if minute == 60:
        return dt.replace(hour=dt.hour+1, minute=0, second=0, microsecond=0)
    return dt.replace(minute=minute, second=0, microsecond=0)

def generate_future_intervals(num_intervals=4, interval_minutes=15):
    """ 
    Generates list of current and future datetime objects at specified intervals
    Returns a list of datetime objects
    """
    current_time = datetime.now()
    start_time = round_to_nearest(current_time, interval_minutes)
    return [start_time + timedelta(minutes=i * interval_minutes) for i in range(num_intervals)]

def make_predictions():
    """
    Generates predictions for the next 2 hours for each station
    Returns a dictionary with station IDs as keys and predictions as values
    """
    models = load_models()
    future_intervals = generate_future_intervals()
    weather_forecast = get_weather_forecast()
    predictions = {}
    for station_id in models:
        model = models[station_id]
        inputs = pd.DataFrame({
            "month": [future_intervals[0].month] * len(future_intervals),
            "day_of_week": [future_intervals[0].weekday()] * len(future_intervals),
            "hour": [future_interval.hour for future_interval in future_intervals],
            "minute": [future_interval.minute for future_interval in future_intervals],
            "temperature": [int(weather_forecast["temperature"][future_intervals[0].hour]) + 15] * len(future_intervals),
            "precipitation": [weather_forecast["precipitation"][future_intervals[0].hour]] * len(future_intervals)
        })
        # print(inputs)
        outputs = model.predict(inputs)
        predictions[station_id] = []
        for output in outputs:
            if station_id.endswith("arrivals"):
                output = np.round(output)
            # will overestimate departures, set round up cutoff lower
            elif station_id.endswith("departures") and output % 1 >= 0.4:
                output = np.ceil(output)
            predictions[station_id].append(int(output))

                
    predictions["time_intervals"] = [future_interval.strftime("%H:%M") for future_interval in future_intervals]
    return predictions

def get_station_info():
    """
    Retrieves station information from the Lyft API, including number of docks, number of available bikes, number of disabled bikes, and number of available docks
    Returns a dictionary with station IDs as keys and station information as values
    """
    status_api = "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_status.json"
    # info_api =  "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_information.json"
    response = requests.get(status_api)
    station_data = response.json()["data"]["stations"]
    station_info = {}
    for dict in station_data:
        # print(dict)
        if dict["station_id"] in station_external_ids:
            station_info[station_external_ids[dict["station_id"]]] = {
                "station_name": station_names[station_external_ids[dict["station_id"]]],
                "num_docks_available": dict["num_docks_available"],
                "num_bikes_available": dict["num_bikes_available"],
                "num_bikes_disabled": dict["num_bikes_disabled"],
                "capacity": dict["num_docks_available"] + dict["num_bikes_available"] + dict["num_bikes_disabled"]
            }
    return station_info

def get_future_availability(predictions, station_info):
    """
    Based on estimated departures, arrivals, and current availability, calculates future availability
    """
    forecasts = {station_id:{} for station_id in station_ids}
    for station_id in station_ids:
        departures = predictions[f"{station_id}_departures"]
        arrivals = predictions[f"{station_id}_arrivals"]
        available_bikes = station_info[station_id]["num_bikes_available"]
        available_docks = station_info[station_id]["num_docks_available"]
        disabled_bikes = station_info[station_id]["num_bikes_disabled"]
        capacity = station_info[station_id]["capacity"]
        forecasts[station_id]["future_available_bikes"] = []
        forecasts[station_id]["future_available_docks"] = []
        for i in range(len(departures)):
            available_bikes = max(0, available_bikes - departures[i])
            available_docks = max(0, available_docks - arrivals[i])
            available_bikes = min(available_bikes + arrivals[i], capacity - disabled_bikes)
            available_docks = min(available_docks + departures[i], capacity - disabled_bikes - available_bikes)
            forecasts[station_id]["future_available_bikes"].append(available_bikes)
            forecasts[station_id]["future_available_docks"].append(available_docks)
    return forecasts

@app.route('/', methods=['POST', 'GET'])
def forecast():
    try:
        predictions = make_predictions()
        print(jsonify(predictions))
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}, 500)

if __name__ == '__main__':
    app.run(debug=True)