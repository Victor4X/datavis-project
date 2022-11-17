# Group 16 Data Visualization Project

## Introduction

This project aims to visualize the data from the [Launch Library 2 API](https://thespacedevs.com/llapi). The data is about rocket launches and their payloads. The data is available in the `Visualization/Dataset/data` folder.

## Dataset

The data set contains historical data of all governmental and commercial spacecraft launches since the beginning of human spaceflight.
It has been compiled by a non-profit group of developers called **The Space Devs**. According to the website, _"[Space Devs]...is a group of space enthusiast developers working on a range of services,
united in a common goal to improve public knowledge and accessibility of spaceflight information._

The data is `JSON` formatted and each record is a launch containing a lot of meta-information such as launch location and timestamp, rocket type, launch events and the agency responsible, just to name a few.

---

## Running the project

The main Jupiter notebook is `launches.ipynb`. It can be run with the following command:

```bash
jupyter notebook launches.ipynb
```

Or opened with google colab here:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Victor4X/datavis-project/blob/main/launches.ipynb)

The project also comes with a web dashboard that can be run with the following command:

```bash
python serve.py
```

But that requires the `requirements.txt` to be installed first.

```bash
pip install -r requirements.txt
```

# Visualizations

## 01. Global pad lanches from 1951-2021
World map animation over time containing locations of pad launches.
When hovering a pad launch point, info should be shown in a popover box.
Launches should be indicated by a circular "pulse" effect with a given opacity when added to the map, to make the change more visible.
Full screen map.

## 02. Linegraph of launches vs. geopolitical situation


## 03. Launches pr. country as stacked barchart over time


## 04. Launch provider type per country per year

# Misc

Cleaning the notebook outputs:
```bash
jupyter nbconvert --clear-output --inplace launches.ipynb
```