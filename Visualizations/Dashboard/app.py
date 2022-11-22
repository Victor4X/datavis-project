from dash import Dash, dcc, html

from ..wip import map_pad_bubbles
from ..done import animated_launch_bubbles
app = Dash(__name__)
server = app.server

app.layout = html.Div(className="dashboard", children=[
    map_pad_bubbles.get_div(app),
    map_pad_bubbles.get_div(app),
    map_pad_bubbles.get_div(app),
    map_pad_bubbles.get_div(app),
    animated_launch_bubbles.get_div(app)
])

def serve():
    app.run_server(debug=True)
    print("Server started in debug mode")

if __name__ == '__main__':
    app.serve()