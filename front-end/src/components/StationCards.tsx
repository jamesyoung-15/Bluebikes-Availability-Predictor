import React, { useState, useEffect } from "react";

type StationData = {
  station_name: string;
  num_bikes_available: number;
  num_docks_available: number;
  num_bikes_disabled: number;
  capacity: number;
  arrivals_forecast: number[];
  departures_forecast: number[];
  time_intervals: string[];
};

type StationCardProps = {
  data: StationData;
};

const StationCard: React.FC<StationCardProps> = ({ data }) => {
  const [adjustedData, setAdjustedData] = useState<{
    timeIntervals: string[];
    adjustedArrivals: number[];
    adjustedDepartures: number[];
    availableBikes: number[];
    availableDocks: number[];
  }>({
    timeIntervals: data.time_intervals,
    adjustedArrivals: [],
    adjustedDepartures: [],
    availableBikes: [],
    availableDocks: [],
  });

  useEffect(() => {
    const calculateAdjustedForecasts = () => {
      const { arrivals_forecast, departures_forecast, num_bikes_available, num_docks_available } = data;

      const adjustedArrivals: number[] = [];
      const adjustedDepartures: number[] = [];
      const availableBikes: number[] = [num_bikes_available];
      const availableDocks: number[] = [num_docks_available];

      for (let t = 0; t < arrivals_forecast.length; t++) {
        // Calculate adjusted departures and arrivals
        const departures = Math.min(departures_forecast[t], availableBikes[t]);
        const arrivals = Math.min(arrivals_forecast[t], availableDocks[t]);

        adjustedDepartures.push(departures);
        adjustedArrivals.push(arrivals);

        // Update available bikes and docks
        const bikes = Math.max(0, availableBikes[t] - departures + arrivals);
        const docks = Math.max(0, availableDocks[t] - arrivals + departures);

        availableBikes.push(bikes);
        availableDocks.push(docks);
      }

      setAdjustedData({
        timeIntervals: data.time_intervals,
        adjustedArrivals,
        adjustedDepartures,
        availableBikes: availableBikes.slice(1),
        availableDocks: availableDocks.slice(1),
      });
    };

    calculateAdjustedForecasts();
  }, [data]);

  return (
    <div className="table-auto shadow-md bg-white p-4 border border-gray-200 hover:shadow-lg transition duration-300">
      <h2 className="text-lg font-bold text-blue-600 mb-4">{data.station_name}</h2>
      <table className="w-full text-sm text-left text-gray-600">
        <thead>
          <tr>
            <th className="border-b p-2">Time Interval</th>
            <th className="border-b p-2 text-center hidden md:table-cell">Estimated Arrivals</th>
            <th className="border-b p-2 text-center hidden md:table-cell">Estimated Departures</th>
            <th className="border-b p-2 text-center">Estimated Available Bikes</th>
            <th className="border-b p-2 text-center">Estimated Available Docks</th>
          </tr>
        </thead>
        <tbody>
          {adjustedData.timeIntervals.map((interval, index) => (
            <tr key={index}>
              <td className="p-2">{interval}</td>
              <td className="p-2 text-center hidden md:table-cell">{adjustedData.adjustedArrivals[index]}</td>
              <td className="p-2 text-center hidden md:table-cell">{adjustedData.adjustedDepartures[index]}</td>
              <td className="p-2 text-center">{adjustedData.availableBikes[index]}</td>
              <td className="p-2 text-center">{adjustedData.availableDocks[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StationCards: React.FC<{ stations: Record<string, StationData> }> = ({ stations }) => {
  return (
    <div className="p-4 grid grid-cols-1 gap-4 max-w-[1200px] mx-auto shadow-md rounded-lg border border-gray-200 bg-[#fff]">
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Bike Station Forecasts</h2>
      {Object.entries(stations).map(([stationId, stationData]) => (
        <StationCard key={stationId} data={stationData} />
      ))}
    </div>
  );
};

export default StationCards;