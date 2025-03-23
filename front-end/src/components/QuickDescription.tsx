import React from "react";
import BikeStationPic from "../assets/Bike_Availability_Forecast_1.jpg";

const QuickDescription: React.FC = () => {
  return (
    <section className="p-4 max-w-[1200px] mx-auto">
        <div className="mt-10 p-4 shadow-md rounded-lg border border-gray-200 bg-[#fff]">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">About This Project</h2>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Intro</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                This is a personal hobby project designed to provide real-time hourly forecasts for Bluebikes stations near my home in Boston. 
                It combines machine learning and live station data to help me forecast bike availability and plan my bike rides efficiently. 
            </p>
            <div className="flex justify-center mb-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                    src={BikeStationPic}
                    alt="Random Pic"
                    className="w-full object-cover"
                />
                {/* <p className="p-4 text-gray-700 text-center">Data Flow Diagram</p> */}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">How It Works</h3>
            <ol className="list-decimal list-inside text-gray-700 text-lg mb-6 flex flex-col gap-2">
                <li>
                    <span className="font-semibold">Data Collection</span> 
                    <p>
                    Every quarter, Bluebikes publishes comprehensive trip histories that contains all recorded trip histories in Boston. I use this data, alongside weather data, to train my machine learning model.
                    Unfortunately, they do not store historical station data, so I use their live station status API to get the current station statuses.
                    </p>
                    <p className="my-1">
                        See <a href="https://bluebikes.com/system-data" target="_blank" className="text-indigo-600 hover:text-indigo-500"> here </a> for Bluebikes' data source and 
                        <a href="https://open-meteo.com/en/docs" target="_blank" className="text-indigo-600 hover:text-indigo-500"> here </a> for OpenMeteo's weather API.
                    </p>
                </li>
                <li>
                    <span className="font-semibold">Machine Learning Model for Predicting Arrivals and Departures </span>
                    <p>
                    I used the gradient boosting regression model HistGradientBoostingRegressor from Scikit-Learn and trained the model with recorded historical bike rides, temperature, and precipitation data to forecast each station's arrivals and departures.
                    </p>
                    <p>
                        The model takes the following features: temperature, precipiation, month, day of week, hour, minute as inputs. It outputs the number of bikes arriving and departing at each station.
                    </p>
                </li>
                <li>
                <span className="font-semibold">Combining ML Models with Live Data</span>
                <p>
                To forecast the availability of bikes at each station for the next hour, I feed the model with the temperature and precipiation forecast and current time to get future predicted arrivals and departures.
                Then, I pull the current station information (eg. number of available bikes and docks) from the Bluebikes API and combine it with the model's predictions to get the final forecast.
                </p>
                </li>
            </ol>
            <h3 className="text-xl font-semibold text-blue-600 mb-4">More Info</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Feel free to check out the source code 
                <a href="https://github.com/jamesyoung-15/Bluebikes-Availability-Predictor/" target="_blank" className="text-indigo-700 hover:text-indigo-600"> here! </a>
                Project still ongoing so more features, visualizations, and info will be added.
            </p>
        </div>
    </section>
  );
};

export default QuickDescription;