import json

outfile = './data/Launchers-expanded.json'

rels = '../visualization/dataset/rels/'

with open("../visualization/dataset/Launchers.json") as l:
    launchers = json.load(l)

    with (
        open(rels+"launcher_launches.json") as ll,
        open(rels+"launcher_first_flight.json") as ff,
        open(rels+"launcher_last_flight.json") as lf,
    ):
        launcher_launches = json.load(ll)
        launcher_first_flight = json.load(ff)
        launcher_last_flight = json.load(lf)

        for launcher in launchers:
            launcher['launches'] = launcher_launches.get(str(launcher['id']), [])
            launcher['first_flight'] = launcher_first_flight.get(str(launcher['id']), None)
            launcher['last_flight'] = launcher_last_flight.get(str(launcher['id']), None)

        with open(outfile, 'w') as ll:
            json.dump(launchers, ll, indent=4)
