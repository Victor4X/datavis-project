# Group 16 Data Visualization Project

## Introduction

This project aims to visualize the data from the [Launch Library 2 API](https://thespacedevs.com/llapi). The data is about rocket launches and their payloads. The data is available in the `visualization/dataset` folder.

## Dataset

The data set contains historical data of all governmental and commercial spacecraft launches since the beginning of human spaceflight.
It has been compiled by a non-profit group of developers called **The Space Devs**. According to the website, _"[Space Devs]...is a group of space enthusiast developers working on a range of services,
united in a common goal to improve public knowledge and accessibility of spaceflight information._

The data is `JSON` formatted and each record is a launch containing a lot of meta-information such as launch location and timestamp, rocket type, launch events and the agency responsible, just to name a few.

---

## Running the project

The main Jupiter notebook is `visualization/launches.ipynb`. It can be run with the following command:

```bash
jupyter notebook visualization/launches.ipynb
```

Or opened with google colab here:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Victor4X/datavis-project/blob/main/visualization/launches.ipynb)
