def generate_summary(df):
    summary = {
        'Total SMEs': df['Persona'].nunique(),
        'Average Growth Score': round(df['GrowthScore'].mean(), 2),
        'Highest ROI': df['ROI'].max(),
        'Most Common Flag': df['StrategicFlag'].mode()[0] if not df['StrategicFlag'].mode().empty else 'N/A'
    }
    return summary
