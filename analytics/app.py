import dash
from dash import html, dcc, Input, Output, no_update
import dash_bootstrap_components as dbc
from config.settings import DERICBI_LOGO, DERICBI_SLOGAN

# Initialize Dash app with Bootstrap for premium styling
app = dash.Dash(
    __name__,
    use_pages=True,
    external_stylesheets=[dbc.themes.CYBORG],
    suppress_callback_exceptions=True
)
server = app.server

# Sidebar navigation
sidebar = html.Div(
    [
        html.Img(
            src=DERICBI_LOGO,
            alt="DericBI Logo",
            style={"height": "48px", "width": "auto", "marginBottom": "0.75rem"},
        ),
        html.H2("DericBI", className="display-6"),
        html.Hr(),
        html.P(DERICBI_SLOGAN, className="lead"),
        dbc.Nav(
            [
                dbc.NavLink("Ingestion", href="/ingestion", active="exact"),
                dbc.NavLink("Cleaning", href="/cleaning", active="exact"),
                dbc.NavLink("Exploration", href="/exploration", active="exact"),
                dbc.NavLink("Visualization", href="/visualization", active="exact"),
                dbc.NavLink("Insights", href="/insights", active="exact"),
                dbc.NavLink("Reporting", href="/reporting", active="exact"),
            ],
            vertical=True,
            pills=True,
        ),
    ],
    style={
        "position": "fixed",
        "top": 0,
        "left": 0,
        "bottom": 0,
        "width": "16rem",
        "padding": "2rem 1rem",
        "backgroundColor": "#111111",
        "color": "white"
    },
)

# Content area
content = html.Div(
    [
        dash.page_container  # This loads whichever page is active
    ],
    style={
        "marginLeft": "18rem",
        "marginRight": "2rem",
        "padding": "2rem 1rem"
    },
)

# App layout
app.layout = html.Div([
    dcc.Location(id="url", refresh=False),
    dcc.Store(id="shared-dataset", storage_type="session"),
    dcc.Store(id="shared-visual-config", storage_type="session"),
    sidebar,
    content
])


@app.callback(
    Output("url", "pathname"),
    Input("url", "pathname")
)
def ensure_default_route(pathname):
    if pathname in (None, "", "/"):
        return "/ingestion"
    return no_update

if __name__ == "__main__":
 app.run(debug=True)

