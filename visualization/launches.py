import pandas as pd
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

sns.set()
pd.set_option("display.max_columns", None)

path = "./dataset/Launches.json"
f = open(path, "r")
file = json.loads(f.read())

launch_df = pd.json_normalize(file, max_level=5)
launch_df.drop(
    [
        "updates",
        "vidURLs",
        "program",
        "mission_patches",
        "infoURLs",
        "rocket.configuration.program",
        "rocket.launcher_stage",
        "rocket.spacecraft_stage.launch_crew",
        "rocket.spacecraft_stage.onboard_crew",
        "rocket.spacecraft_stage.landing_crew",
        "rocket.spacecraft_stage.docking_events",
    ],
    axis=1,
    inplace=True,
)

updates_df = pd.json_normalize(
    file, record_path=["updates"], meta=["id"], meta_prefix="launch."
)
vidURLs_df = pd.json_normalize(
    file, record_path=["vidURLs"], meta=["id"], meta_prefix="launch."
)
infoURLs_df = pd.json_normalize(
    file, record_path=["infoURLs"], meta=["id"], meta_prefix="launch."
)
program_df = pd.json_normalize(
    file, record_path=["program"], meta=["id"], meta_prefix="launch."
)
program_df.drop(["agencies", "mission_patches"], axis=1, inplace=True)

program_agencies_df = pd.json_normalize(
    file,
    record_path=["program", "agencies"],
    meta=["id", ["program", "id"]],
    meta_prefix="launch.",
)

mission_patches_df = pd.json_normalize(
    file, record_path=["mission_patches"], meta=["id"], meta_prefix="launch."
)

rocket_config_df = pd.json_normalize(
    file,
    record_path=["rocket", "configuration", "program"],
    meta=["id", ["rocket", "id"]],
    meta_prefix="launch.",
)
rocket_config_df.drop(["agencies", "mission_patches"], axis=1, inplace=True)
rocket_config_program_agencies_df = pd.json_normalize(
    file,
    record_path=["rocket", "configuration", "program", "agencies"],
    meta=["id", ["program", "id"]],
    meta_prefix="launch.",
)
rocket_config_program_mission_patches_df = pd.json_normalize(
    file,
    record_path=["rocket", "configuration", "program", "mission_patches"],
    meta=["id", ["program", "id"]],
    meta_prefix="launch.",
)

rocket_launcher_stage_df = pd.json_normalize(
    file, record_path=["rocket", "launcher_stage"], meta=["id"], meta_prefix="launch."
)

launch_df.merge(updates_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(vidURLs_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(infoURLs_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(program_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(program_agencies_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(mission_patches_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(rocket_config_df, left_on="id", right_on="launch.id", how="outer")
launch_df.merge(
    rocket_config_program_agencies_df, left_on="id", right_on="launch.id", how="outer"
)
launch_df.merge(
    rocket_config_program_mission_patches_df,
    left_on="id",
    right_on="launch.id",
    how="outer",
)
launch_df.merge(
    rocket_launcher_stage_df, left_on="id", right_on="launch.id", how="outer"
)

launch_df["pad.latitude"] = launch_df["pad.latitude"].replace("", np.nan).astype(float)
launch_df["pad.longitude"] = (
    launch_df["pad.longitude"].replace("", np.nan).astype(float)
)

map_df = launch_df[["id", "pad.latitude", "pad.longitude", "window_end", "name"]]


# scatterplot_mapbox of latitude and longitude
fig = px.scatter_mapbox(
    map_df,
    lat="pad.latitude",
    lon="pad.longitude",
    animation_frame="window_end",
    hover_name="name",
    animation_group="name",
)
fig.update_layout(mapbox_style="open-street-map")
fig.update_layout(margin={"r": 0, "t": 0, "l": 0, "b": 0})
fig.show()
