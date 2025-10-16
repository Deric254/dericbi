import dash
from dash import dcc, html, Input, Output
import plotly.express as px
import pandas as pd


# Robustly load SME data
import os
DATA_PATH = 'data/sme_data.csv'
df = None
data_error = None
if os.path.exists(DATA_PATH):
    try:
        # Only load needed columns for speed
        preview = pd.read_csv(DATA_PATH, nrows=5)
        needed_cols = [c for c in ["Persona","GrowthScore","NetProfit","ROI","ChurnRisk","Month","Revenue","Expense","Reinvestment"] if c in preview.columns]
        df = pd.read_csv(DATA_PATH, usecols=needed_cols)
        if df.empty:
            data_error = "Data file is empty. Please upload valid SME data."
    except Exception as e:
        data_error = f"Error loading data: {e}"
else:
    data_error = "Data file not found. Please ensure 'data/sme_data.csv' exists."

# Dash app setup
app = dash.Dash(__name__, external_stylesheets=['https://codepen.io/chriddyp/pen/bWLwgP.css'])
app.title = "DericBI SME Dashboard"

app.layout = html.Div(style={'backgroundColor': '#1F2A40', 'color': 'white', 'padding': '20px'}, children=[
    html.Div([
        html.Img(src='assets/dericbi_logo.png', style={'height': '60px'}),
        html.H1("DericBI SME Growth Dashboard", style={'textAlign': 'center', 'color': '#FFD700'}),
    ], style={'textAlign': 'center'}),

    html.Div([
        html.Label("Filter by Persona", style={'color': 'white'}),
        dcc.Dropdown(
            options=[{'label': p, 'value': p} for p in df['Persona'].unique()] if (df is not None and 'Persona' in df.columns) else [],
            value=df['Persona'].unique()[0] if (df is not None and 'Persona' in df.columns and len(df['Persona'].unique()) > 0) else None,
            id='persona-filter',
            style={'color': 'black'},
            disabled=(df is None or 'Persona' not in df.columns or len(df['Persona'].unique()) == 0)
        )
    ], style={'width': '30%', 'marginBottom': '20px'}),

    html.Div(id='kpi-cards', style={'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '30px'}),

    html.Div([
        html.Div([
            dcc.Graph(id='line-chart', config={'displayModeBar': False})
        ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top', 'backgroundColor': '#22304A', 'borderRadius': '10px', 'padding': '10px', 'marginBottom': '20px'}),
        html.Div([
            dcc.Graph(id='bar-chart', config={'displayModeBar': False})
        ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top', 'backgroundColor': '#22304A', 'borderRadius': '10px', 'padding': '10px', 'marginLeft': '4%', 'marginBottom': '20px'}),
    ], style={'display': 'flex', 'justifyContent': 'space-between'}),

    html.Div([
        html.Div([
            dcc.Graph(id='scatter-plot', config={'displayModeBar': False})
        ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top', 'backgroundColor': '#22304A', 'borderRadius': '10px', 'padding': '10px'}),
        html.Div([
            html.Div([
                html.H3("Summary / Notes", style={'color': '#FFD700', 'marginBottom': '10px'}),
                html.P(data_error if data_error else "This panel can be used for additional insights, tables, or custom content.", style={'color': 'white'})
            ], style={'padding': '20px'})
        ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top', 'backgroundColor': '#22304A', 'borderRadius': '10px', 'padding': '10px', 'marginLeft': '4%'})
    ], style={'display': 'flex', 'justifyContent': 'space-between'})
])

@app.callback(
    Output('kpi-cards', 'children'),
    Output('line-chart', 'figure'),
    Output('bar-chart', 'figure'),
    Output('scatter-plot', 'figure'),
    Input('persona-filter', 'value')
)
def update_dashboard(persona):
    # If data is missing or invalid, show friendly messages and empty charts
    if df is None or data_error or 'Persona' not in (df.columns if df is not None else []):
        kpi_cards = [
            html.Div([
                html.H4(metric, style={'color': '#FFD700'}),
                html.H2("N/A", style={'color': 'white'})
            ], style={
                'backgroundColor': '#2E3B55',
                'padding': '20px',
                'borderRadius': '10px',
                'width': '22%',
                'textAlign': 'center'
            }) for metric in ["Growth Score", "Net Profit", "ROI", "Churn Risk"]
        ]
        empty_fig = {
            "layout": {
                "xaxis": {"visible": False},
                "yaxis": {"visible": False},
                "annotations": [{
                    "text": data_error if data_error else "No data available.",
                    "xref": "paper", "yref": "paper",
                    "showarrow": False,
                    "font": {"color": "#FFD700", "size": 18}
                }],
                "plot_bgcolor": "#1F2A40",
                "paper_bgcolor": "#1F2A40",
                "font": {"color": "white"}
            }
        }
        return kpi_cards, empty_fig, empty_fig, empty_fig


    try:
        filtered = df[df['Persona'] == persona].copy()

        if filtered.empty:
            kpi_cards = [
                html.Div([
                    html.H4(metric, style={'color': '#FFD700'}),
                    html.H2("N/A", style={'color': 'white'})
                ], style={
                    'backgroundColor': '#2E3B55',
                    'padding': '20px',
                    'borderRadius': '10px',
                    'width': '22%',
                    'textAlign': 'center'
                }) for metric in ["Growth Score", "Net Profit", "ROI", "Churn Risk"]
            ]
            empty_fig = {
                "layout": {
                    "xaxis": {"visible": False},
                    "yaxis": {"visible": False},
                    "annotations": [{
                        "text": "No data for selected persona.",
                        "xref": "paper", "yref": "paper",
                        "showarrow": False,
                        "font": {"color": "#FFD700", "size": 18}
                    }],
                    "plot_bgcolor": "#1F2A40",
                    "paper_bgcolor": "#1F2A40",
                    "font": {"color": "white"}
                }
            }
            return kpi_cards, empty_fig, empty_fig, empty_fig

        # Check required columns
        required_cols = ["GrowthScore", "NetProfit", "ROI", "ChurnRisk", "Month", "Revenue", "Expense", "Reinvestment"]
        for col in required_cols:
            if col not in filtered.columns:
                raise ValueError(f"Missing column: {col}")

        # Limit to last 12 months for clarity
        if 'Month' in filtered.columns:
            try:
                filtered['Month'] = pd.to_datetime(filtered['Month'], errors='coerce')
                filtered = filtered.sort_values('Month')
                filtered = filtered.tail(12)
                filtered['Month'] = filtered['Month'].dt.strftime('%b %Y')
            except Exception:
                filtered = filtered.tail(12)

        # KPI Cards
        kpis = {
            "Growth Score": round(filtered['GrowthScore'].mean(), 2),
            "Net Profit": f"${round(filtered['NetProfit'].mean(), 2):,}",
            "ROI": f"{round(filtered['ROI'].mean(), 2)}%",
            "Churn Risk": f"{round(filtered['ChurnRisk'].mean(), 2)}%"
        }

        kpi_cards = [
            html.Div([
                html.H4(metric, style={'color': '#FFD700'}),
                html.H2(value, style={'color': 'white'})
            ], style={
                'backgroundColor': '#2E3B55',
                'padding': '20px',
                'borderRadius': '10px',
                'width': '22%',
                'textAlign': 'center'
            }) for metric, value in kpis.items()
        ]

        # Line Chart (clean, clear)
        line_fig = px.line(filtered, x='Month', y=['Revenue', 'Expense'], title='Revenue vs Expense (Last 12 Months)')
        line_fig.update_traces(mode='lines+markers', marker=dict(size=8), line=dict(width=3))
        line_fig.update_layout(
            hovermode='x unified',
            plot_bgcolor='#1F2A40',
            paper_bgcolor='#1F2A40',
            font_color='white',
            xaxis_title='Month',
            yaxis_title='Amount (USD)',
            legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )

        # Bar Chart (clean, clear)
        bar_fig = px.bar(filtered, x='Month', y=['Reinvestment', 'ROI'], barmode='group', title='Reinvestment vs ROI (Last 12 Months)')
        bar_fig.update_layout(
            plot_bgcolor='#1F2A40',
            paper_bgcolor='#1F2A40',
            font_color='white',
            xaxis_title='Month',
            yaxis_title='Value',
            legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )

        # Scatter Plot (clean, clear)
        scatter_fig = px.scatter(
            filtered,
            x='GrowthScore',
            y='ChurnRisk',
            color='Month',
            title='Churn Risk vs Growth Score (Last 12 Months)',
            hover_data=['NetProfit']
        )
        scatter_fig.update_traces(marker=dict(size=12, opacity=0.7, line=dict(width=1, color='white')))
        scatter_fig.update_layout(
            plot_bgcolor='#1F2A40',
            paper_bgcolor='#1F2A40',
            font_color='white',
            xaxis_title='Growth Score',
            yaxis_title='Churn Risk (%)',
            legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
        )

        return kpi_cards, line_fig, bar_fig, scatter_fig

    except Exception as e:
        kpi_cards = [
            html.Div([
                html.H4(metric, style={'color': '#FFD700'}),
                html.H2("N/A", style={'color': 'white'})
            ], style={
                'backgroundColor': '#2E3B55',
                'padding': '20px',
                'borderRadius': '10px',
                'width': '22%',
                'textAlign': 'center'
            }) for metric in ["Growth Score", "Net Profit", "ROI", "Churn Risk"]
        ]
        empty_fig = {
            "layout": {
                "xaxis": {"visible": False},
                "yaxis": {"visible": False},
                "annotations": [{
                    "text": f"Error: {e}",
                    "xref": "paper", "yref": "paper",
                    "showarrow": False,
                    "font": {"color": "#FFD700", "size": 18}
                }],
                "plot_bgcolor": "#1F2A40",
                "paper_bgcolor": "#1F2A40",
                "font": {"color": "white"}
            }
        }
        return kpi_cards, empty_fig, empty_fig, empty_fig

if __name__ == '__main__':
    app.run(debug=True)
