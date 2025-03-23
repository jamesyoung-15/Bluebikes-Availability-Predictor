/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { getPredictions, getStationInfo, combineStationData } from "../helpers/index"; // Combines station info and predictions
import StationCards from "./StationCards";
// import BikeStationPic from "../assets/Bike_Availability_Forecast_1.jpg";



const PredictionsDashboard: React.FC = () => {
    const [combinedData, setCombinedData] = useState<
      Record<
        string,
        {
          station_name: string;
          num_bikes_available: number;
          num_docks_available: number;
          num_bikes_disabled: number;
          capacity: number;
          arrivals_forecast: number[];
          departures_forecast: number[];
          time_intervals: string[];
        }
      >
    >({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
  
          // Fetch station info and predictions
          const stationInfo = await getStationInfo();
          const predictions = await getPredictions();
  
          // Combine the data
          const combined = combineStationData(stationInfo, predictions);
          setCombinedData(combined);
        } 
        catch (err: any) {
          setError(err.message || "An unknown error occurred.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) return <div className="text-center mx-auto mt-4">Loading station data and forecasts...</div>;
    if (error) return <div className="text-center mx-auto text-rose-600">Error: {error}</div>;
  
    return (
      <section className="p-4">
        {/* <img src={BikeStationPic} alt="Bike station availability forecast" className="m-auto max-h-[20vh] mb-6" /> */}
        <StationCards stations={combinedData} />
      </section>
    );
  };

export default PredictionsDashboard;