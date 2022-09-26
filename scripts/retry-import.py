# Preamble
import json
import requests
import math
import os
from time import sleep
from datetime import datetime, timezone

# Import parameters
API = 'll'  # ll or lldev
API_version = '2.2.0'
# with open('APIkey.txt', 'r') as f:
#     API_key = f.read()
#     f.close()
# header = {'Authorization': 'Token ' + API_key}
header = ''

# create data directory if it doesnt exist
os.makedirs("./data", exist_ok=True)


def ll2_call(data_name, endpoint, call_headers, api, api_version, limit):
    next_url = f'https://{api}.thespacedevs.com/{api_version}/{endpoint}/?limit={limit}&mode=detailed'
    ii = 0
    number_calls = 0
    data = []
    while next_url is not None:
        part = []
        call = requests.get(next_url, headers=call_headers, timeout=360).json()
        if not('results' in call):
            print('No data in response, waiting 22 minutes')
            sleep(22 * 60)
            continue
        ii += 1
        if ii == 1:
            number_data = call['count']
            print(f'Total {data_name} : {str(number_data)}')
            number_calls = math.ceil(number_data / limit)
        part = call['results'] 
        export(f'{data_name}_part_{ii:03d}', part)
        data.extend(part)
        next_url = call['next']
        print(f'{datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")} - API Call {str(ii)}/{str(number_calls)}')
    return data


def export(data_name, data):
    with open(f'data/{data_name}.json', 'w') as file:
        json.dump(data, file, indent=4)
    print('Successfully exported ' + data_name + ' to file.')


# Import Launches
export('Launches',  ll2_call('Launches', 'launch', header, API, API_version, 100))

# # Import Orbits
# export('Orbits', 'data/Orbits.json', ll2_call('Orbits', 'config/orbit', header, API, API_version, 100))

# # Import Statuses
# export('Statuses', 'data/Statuses.json', ll2_call('Statuses', 'config/launchstatus', header, API, API_version, 100))

# # Import Agencies
# export('Agencies', 'data/Agencies.json', ll2_call('Agencies', 'agencies', header, API, API_version, 100))

# # Import Locations
# export('Locations', 'data/Locations.json', ll2_call('Locations', 'location', header, API, API_version, 100))

# # Import Pads
# export('Pads', 'data/Pads.json', ll2_call('Pads', 'pad', header, API, API_version, 100))

# # Import Astronauts
# export('Astronauts', 'data/Astronauts.json', ll2_call('Astronauts', 'astronaut', header, API, API_version, 20))

print('Successfully completed import.')
