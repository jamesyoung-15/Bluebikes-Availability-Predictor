type PredictionsResponse = {
  [stationId: string]: {
    arrivals: number[];
    departures: number[];
  };
};

export const getPredictions = async (): Promise<PredictionsResponse> => {
  const predictionApiUrl = "http://localhost:5000/v1"; // Replace with actual API URL

  try {
    const response = await fetch(predictionApiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch predictions: ${response.statusText}`);
    }

    const data: PredictionsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw new Error("Failed to fetch predictions. Please try again later.");
  }
};