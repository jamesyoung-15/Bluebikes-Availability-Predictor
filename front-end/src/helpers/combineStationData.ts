type CombinedStationData = {
    station_name: string;
    num_bikes_available: number;
    num_docks_available: number;
    num_bikes_disabled: number;
    capacity: number;
    arrivals_forecast: number[];
    departures_forecast: number[];
    time_intervals: string[];
  };
  
type StationInfo = {
    station_name: string;
    num_docks_available: number;
    num_bikes_available: number;
    num_bikes_disabled: number;
    capacity: number;
};

type PredictionsResponse = {
[stationId: string]: {
    arrivals: number[];
    departures: number[];
};
};

type CombinedResponse = Record<string, CombinedStationData>;

const generateTimeIntervals = (): string[] => {
    const intervals: string[] = [];
    const now = new Date();
  
    // Convert current time to EST
    const estNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
  
    // Round the current time to the nearest 15-minute interval
    const minutes = estNow.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
  
    if (roundedMinutes === 60) {
      // If rounding results in 60 minutes, move to the next hour
      estNow.setHours(estNow.getHours() + 1, 0, 0, 0);
    } else {
      estNow.setMinutes(roundedMinutes, 0, 0); // Set to the rounded interval, reset seconds and milliseconds
    }
  
    for (let i = 0; i < 4; i++) {
      const start = new Date(estNow.getTime() + i * 15 * 60 * 1000);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
  
      const formattedInterval = `${start
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(" AM", "")
        .replace(" PM", "")} - ${end
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(" AM", "")
        .replace(" PM", "")}`;
  
      intervals.push(formattedInterval);
    }
  
    return intervals;
};

export const combineStationData = (
    stationInfo: Record<string, StationInfo>,
    predictions: PredictionsResponse
    ): CombinedResponse => {
    const combinedData: CombinedResponse = {};
    const timeInterval = generateTimeIntervals();

    for (const stationId of Object.keys(stationInfo)) {
        const stationDetails = stationInfo[stationId];
        const stationPredictions = predictions[stationId];

        // Combine station info and predictions
        combinedData[stationId] = {
            station_name: stationDetails.station_name,
            num_bikes_available: stationDetails.num_bikes_available,
            num_docks_available: stationDetails.num_docks_available,
            num_bikes_disabled: stationDetails.num_bikes_disabled,
            capacity: stationDetails.capacity,
            arrivals_forecast: stationPredictions ? stationPredictions.arrivals : [],
            departures_forecast: stationPredictions ? stationPredictions.departures : [],
            time_intervals: timeInterval,
        };
    }


    return combinedData;
};