import json

with open('../dataset/Launches-small.json') as f:
    data = json.load(f)

    # Count unique "status":
    status = set()
    for launch in data:
        status.add(str(launch['status']))

    print(status)