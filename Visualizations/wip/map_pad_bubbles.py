import uuid
import plotly.express as px
from jupyter_dash import JupyterDash
from dash import dcc, html, Input, Output, no_update

from Visualizations.Dataset.Pads import pad_df as data

prefix = None

fig = px.scatter_geo(data,
                     lat='latitude', lon='longitude',
                     size='total_launch_count',
                     hover_name='location.name',
                     projection="kavrayskiy7",
                    )

# turn off native plotly.js hover effects - make sure to use
# hoverinfo="none" rather than "skip" which also halts events.
fig.update_traces(hoverinfo="none", hovertemplate=None)

fig.update_layout(
    xaxis=dict(title='Log P'),
    yaxis=dict(title='pkA'),
    plot_bgcolor='rgba(255,255,255,0.1)'
)


def get_fig(app):
    global prefix
    
    @app.callback(
        Output(prefix + "-graph-tooltip", "show"),
        Output(prefix + "-graph-tooltip", "bbox"),
        Output(prefix + "-graph-tooltip", "children"),
        Input(prefix + "-graph", "hoverData"),
    )
    def display_hover(hoverData):
        if hoverData is None:
            return False, no_update, no_update

        # demo only shows the first point, but other points may also be available
        pt = hoverData["points"][0]
        bbox = pt["bbox"]
        num = pt["pointNumber"]

        df_row = data.iloc[num]
        img_src = df_row['map_image']
        name = df_row['name']
        form = df_row['total_launch_count']

        children = [
            html.Div(children=[
                html.Img(src=img_src, style={"width": "100%"}),
                html.H2(f"{name}", style={"color": "darkblue"}),
                html.P(f"{form}"),
            ],
            style={'width': '200px', 'white-space': 'normal'})
        ]

        return True, bbox, children

    return fig

def get_div(app):
    global prefix
    prefix = uuid.uuid4().hex+__name__.replace(".", "-")

    div = html.Div(id=prefix + "-div", className="fig", children=[
        html.H1("Global Launch Locations"),
        dcc.Graph(id=prefix + "-graph", figure=get_fig(app), clear_on_unhover=True),
        dcc.Tooltip(id=prefix + "-graph-tooltip"),
    ])
    return div




#if __name__ == "__main__":
#    app.run_server(debug=True, mode='inline', port=8080)