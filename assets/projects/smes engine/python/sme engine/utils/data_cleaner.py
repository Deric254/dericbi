import pandas as pd

def load_and_clean_data(filepath):
    df = pd.read_csv(filepath)

    # Fill missing override fields with NaN
    df['OverrideRevenue'] = df['OverrideRevenue'].fillna('')
    df['OverrideExpense'] = df['OverrideExpense'].fillna('')
    
    # Apply override logic
    df['FinalRevenue'] = df.apply(
        lambda row: row['OverrideRevenue'] if row['OverrideRevenue'] != '' else row['Revenue'], axis=1)
    df['FinalExpense'] = df.apply(
        lambda row: row['OverrideExpense'] if row['OverrideExpense'] != '' else row['Expense'], axis=1)
    df['OverrideApplied'] = df.apply(
        lambda row: row['OverrideRevenue'] != '' or row['OverrideExpense'] != '', axis=1)

    # Convert to numeric
    df['FinalRevenue'] = pd.to_numeric(df['FinalRevenue'], errors='coerce')
    df['FinalExpense'] = pd.to_numeric(df['FinalExpense'], errors='coerce')

    # Recalculate metrics
    df['NetProfit'] = df['FinalRevenue'] - df['FinalExpense']
    df['GrowthScore'] = (
        (df['NetProfit'] / df['FinalRevenue']) * 0.5 +
        ((1 - df['ChurnRate']) * 0.3) +
        (df['Reinvestment'] / 1000 * 0.2)
    ).round(2)
    df['ROI'] = (df['Reinvestment'] * 1.2).round(2)
    df['ChurnRisk'] = (df['ChurnRate'] * 100).round(1)

    return df
