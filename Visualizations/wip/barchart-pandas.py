import pandas as pd
import json
import numpy as np
import seaborn as sns

# Load data
with open("../dataset/Launches-small.json", "r") as f:
    data = json.load(f)

    # Count providers in json path: ["launch_service_provider"]["country_code"], and seperate them by success at path ["status"]["abbrev"] == "Success"
    providers = {}
    for launch in data:
        provider = launch["launch_service_provider"]["country_code"]
        success = launch["status"]["abbrev"] == "Success"
        if provider not in providers:
            providers[provider] = [0, 0]
        providers[provider][success] += 1

    # Convert to dataframe
    df = pd.DataFrame(providers)

    # Plot
    ax = df.T.plot.bar(stacked=True)
    ax.set_xlabel("Country")
    ax.set_ylabel("Launches")
    ax.set_title("Launches per country")
    ax.legend(["Success", "Failure"])
    sns.despine()
    ax.figure.savefig("Launches.png")