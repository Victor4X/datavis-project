import json


with open("../dataset/Launches-small.json", "r") as f:
    data = json.load(f)

    # Count amount of launches per provider country
    providers = {}
    for launch in data:
        provider = launch["launch_service_provider"]["country_code"]
        if launch["status"]["abbrev"] == "Success":
            continue
        if provider not in providers:
            providers[provider] = 0
        providers[provider] += 1
    
    print(providers)

    # Count only successes per provider country

    providers = {}
    for launch in data:
        provider = launch["launch_service_provider"]["country_code"]
        if launch["status"]["abbrev"] == "Failure":
            continue
        if provider not in providers:
            providers[provider] = 0
        providers[provider] += 1
    
    print(providers)