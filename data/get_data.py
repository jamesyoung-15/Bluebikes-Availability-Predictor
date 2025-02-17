import os
import requests
import zipfile
from datetime import datetime

def get_bluebikes_data(start_year:int, start_month:int, end_year:int, end_month:int, output_dir:str = '.'):
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
                print(f"Downloaded: {zip_filename}")

                # Unzip the file
                with zipfile.ZipFile(zip_filename, "r") as zip_ref:
                    zip_ref.extract(csv_filename,output_dir)
                print(f"Extracted: {csv_filename} to {output_dir}")

                os.remove(zip_filename)
                print(f"Deleted zip file: {zip_filename}")
            else:
                print(f"Failed to download: {url} (Status code: {response.status_code})")

        except Exception as e:
            print(f"Error processing {url}: {e}")

        if current_date.month == 12:
            current_date = datetime(current_date.year + 1, 1, 1)
        else:
            current_date = datetime(current_date.year, current_date.month + 1, 1)


# Getting data from January 2023 to Jan 2025
get_bluebikes_data(2023, 1, 2025, 1)