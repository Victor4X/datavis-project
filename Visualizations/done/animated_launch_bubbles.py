import uuid
import plotly.express as px
from dash import dcc, html, Input, Output, no_update

from Visualizations.Dataset.Pads import get_pads_by_year

prefix = ""

fig = px.scatter_geo(get_pads_by_year(), lon="longitude", lat="latitude",
                     hover_name="name", size="total_attempts_year",
                     animation_frame="year",
                     projection="equirectangular",
                     height=800)


def get_fig(app):
    global prefix
    prefix = uuid.uuid4().hex+__name__.replace(".", "-")
    return fig

def get_div(app):
    global prefix
    div = html.Div(id=prefix + "-div", className="fig", children=[
        html.H1("Global Launches Over Time"),
        dcc.Graph(id=prefix + "-graph", figure=get_fig(app))
    ])
    return div