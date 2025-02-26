import os
import requests
import zipfile
from datetime import datetime

def get_weather_data(start_year:int, start_month:int, end_year:int, end_month:int, output_dir:str = '.'):
    """
    Downloads and extracts weather data zip files for the given date range.

    Parameters:
    - start_year: Starting year (YYYY)
    - start_month: Starting month (MM, as an integer), eg. 1 for Jan, 12 for Dec
    - end_year: Ending year (YYYY)
    - end_month: Ending month (MM, as an integer) eg. 1 for Jan, 12 for Dec
    - output_dir: Directory to save and extract the files (default: current directory)
    """
    start_date = datetime(start_year, start_month, 1)
    end_date = datetime(end_year, end_month, 1)
    # print(start_date, end_date)

    url = f"https://archive-api.open-meteo.com/v1/archive?latitude=42.3584&longitude=-71.1259&start_date={start_date.strftime('%Y-%m-%d')}&end_date={end_date.strftime('%Y-%m-%d')}&hourly=temperature_2m,precipitation&timezone=America%2FNew_York&format=csv"

    try:
        print("Downloading weather data from OpenMeteo...")
        response = requests.get(url)
        if response.status_code == 200:
            csv_filename = os.path.join(output_dir, f"{start_date.strftime('%Y%m%d')}-{end_date.strftime('%Y%m%d')}-weather-data.csv")
            with open(csv_filename, "wb") as csv_file:
                csv_file.write(response.content)
            print(f"Downloaded weather data: {csv_filename}")
        else:
            print(f"Failed to download weather data (Status code: {response.status_code})")
    except Exception as e:
        print(f"Error retrieving weather data: {e}")

def get_bluebikes_trip_data(start_year:int, start_month:int, end_year:int, end_month:int, output_dir:str = '.'):
    """
    Downloads and extracts Bluebikes trip data zip files for the given date range.

    Parameters:
    - start_year: Starting year (YYYY)
    - start_month: Starting month (MM, as an integer), eg. 1 for Jan, 12 for Dec
    - end_year: Ending year (YYYY)
    - end_month: Ending month (MM, as an integer) eg. 1 for Jan, 12 for Dec
    - output_dir: Directory to save and extract the files (default: current directory)
    """

    # Get dates in format of YYYYMM for url
    start_date = datetime(start_year, start_month, 1)
    end_date = datetime(end_year, end_month, 1)
    current_date = start_date # for iterating


    while current_date <= end_date:
        url = f"https://s3.amazonaws.com/hubway-data/{current_date.strftime('%Y%m')}-bluebikes-tripdata.zip"
        print(url)
        zip_filename = os.path.join(output_dir, f"{current_date.strftime('%Y%m')}-bluebikes-tripdata.zip")
        csv_filename = f"{current_date.strftime('%Y%m')}-bluebikes-tripdata.csv"

        try:
            # Download the zip file
            print(f"Downloading: {url}")
            response = requests.get(url, stream=True)
            if response.status_code == 200:
                with open(zip_filename, "wb") as zip_file:
                    for chunk in response.iter_content(chunk_size=1024):
                        zip_file.write(chunk)

                # Unzip the file
                with zipfile.ZipFile(zip_filename, "r") as zip_ref:
                    zip_ref.extract(csv_filename,output_dir)
                print(f"Extracted: {csv_filename} to {output_dir}")

                os.remove(zip_filename)
            else:
                print(f"Failed to download: {url} (Status code: {response.status_code})")

        except Exception as e:
            print(f"Error processing {url}: {e}")

        if current_date.month == 12:
            current_date = datetime(current_date.year + 1, 1, 1)
        else:
            current_date = datetime(current_date.year, current_date.month + 1, 1)


if __name__ == "__main__":
    get_weather_data(2023, 1, 2025, 1)
    # get_bluebikes_station_data
    # get_bluebikes_trip_data(2023, 1, 2025, 1)