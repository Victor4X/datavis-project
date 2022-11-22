import json
import geopandas as gpd
import matplotlib.pyplot as plt

# Load geopandas world map
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

# plot launch sites on a map
with open("../dataset/Launches-small.json", "r") as f:
    # Get lat and lon from json (["pad"]["latitude"] and ["pad"]["longitude"])
    # and convert to two lists (lat and lon)
    data = json.load(f)
    lat = [d["pad"]["latitude"] for d in data]
    lon = [d["pad"]["longitude"] for d in data]

    # Create a GeoDataFrame from the lat and lon lists
    gdf = gpd.GeoDataFrame(
        geometry=gpd.points_from_xy(lon, lat),
        crs="EPSG:4326"
    )

    # Plot the map of the world and the launch sites
    ax = world.plot(color='white', edgecolor='black')
    gdf.plot(ax=ax, color='red')
    plt.show()