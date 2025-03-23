/* 

This file contains a function that fetches station information from the Lyft API, filters it, and returns a dictionary of relevant station IDs and their certain information.

API response format:
{
    'E32016': {'station_name': 'Commonwealth Ave at Naples Rd', 'num_docks_available': 19, 'num_bikes_available': 0, 'num_bikes_disabled': 0, 'capacity': 19}, 
    'D32035': {'station_name': 'Harvard Ave at Brainerd Rd', 'num_docks_available': 10, 'num_bikes_available': 4, 'num_bikes_disabled': 0, 'capacity': 14}, 
    'A32012': {'station_name': "Packard's Corner - Commonwealth Ave at Brighton Ave", 'num_docks_available': 10, 'num_bikes_available': 17, 'num_bikes_disabled': 0, 'capacity': 27}
}

*/

type StationInfo = {
  station_name: string;
  num_docks_available: number;
  num_bikes_available: number;
  num_bikes_disabled: number;
  capacity: number;
};

type lyftSingleStationData = {
    num_scooters_unavailable: number,
    is_installed: number,
    legacy_id: string,
    num_bikes_disabled: number,
    num_ebikes_available: number,
    eightd_has_available_keys: boolean,
    num_scooters_available: number,
    is_returning: number,
    is_renting: number,
    station_id: string,
    num_docks_available: number,
    last_reported: number,
    num_docks_disabled: number,
    num_bikes_available: number
}


/**
 * Fetches station information from the Lyft API
 * @returns A Promise resolving to a dictionary of station IDs and their information
 */
export const getStationInfo = async (): Promise<Record<string, StationInfo>> => {
  const statusApi = "https://gbfs.lyft.com/gbfs/1.1/bos/en/station_status.json";

  // External station ID mapping
  const stationExternalIds: Record<string, string> = {
    "f8348136-0de8-11e7-991c-3863bb43a7d0": "A32012",
    "fae99a0c-e88a-4112-94d8-f655cf34e651": "E32016",
    "bb27977d-36c1-496d-8bac-631b612dd7b8": "D32035",
  };

  // Station names mapping
  const stationNames: Record<string, string> = {
    A32012: "Packard's Corner - Commonwealth Ave at Brighton Ave",
    E32016: "Commonwealth Ave at Naples Rd",
    D32035: "Harvard Ave at Brainerd Rd",
  };

  try {
    // Fetch station status data
    const response = await fetch(statusApi);

    // Handle HTTP response errors
    if (!response.ok) {
      throw new Error(`Failed to fetch station data: ${response.statusText}`);
    }

    const data = await response.json();
    const stations = data.data.stations; // Lyft API stations array

    // Process station data
    const stationDetails: Record<string, StationInfo> = {};

    stations.forEach((station:lyftSingleStationData) => {
      console.log(station);
      const internalId = stationExternalIds[station.station_id];
      if (internalId) {
        stationDetails[internalId] = {
          station_name: stationNames[internalId],
          num_docks_available: station.num_docks_available,
          num_bikes_available: station.num_bikes_available,
          num_bikes_disabled: station.num_bikes_disabled,
          capacity:
            station.num_docks_available +
            station.num_bikes_available +
            station.num_bikes_disabled,
        };
      }
    });

    return stationDetails;
  } catch (error) {
    console.error("Error fetching station info:", error);
    throw new Error(
      "An error occurred while fetching station information. Please try again later."
    );
  }
};