import json


with open("Launches.json", "r") as f:
    data = json.load(f)

    # Count amount of launches per provider country
    providers = {}
    for launch in data:
        provider = launch["launch_service_provider"]["country_code"]
        if provider not in providers:
            providers[provider] = 0
        providers[provider] += 1
    
    print(providers)