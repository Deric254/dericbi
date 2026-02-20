from dash import html
import dash_bootstrap_components as dbc

def navbar():
    return dbc.Navbar(
        dbc.Container([
            dbc.NavbarBrand("DericBI Analytics Engine", className="ms-2"),
            dbc.Nav(
                [
                    dbc.NavItem(dbc.NavLink("Website", href="https://dericbi.vercel.app", target="_blank")),
                    dbc.NavItem(dbc.NavLink("Email", href="mailto:dericmarangu@gmail.com")),
                    dbc.NavItem(dbc.NavLink("WhatsApp", href="https://wa.me/254791360805", target="_blank")),
                ],
                className="ms-auto",
                navbar=True
            )
        ]),
        color="dark",
        dark=True,
        sticky="top"
    )
