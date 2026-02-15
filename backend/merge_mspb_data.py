#!/usr/bin/env python3
"""
Merge MSPB (Medicare Spending Per Beneficiary) data with Hospital General Information.
"""

import pandas as pd
import sys

def merge_mspb_data():
    """Merge MSPB data with hospital general information."""

    print("Loading hospital general information...")
    hospital_df = pd.read_csv('../data/Hospital_General_Information.csv')
    print(f"Loaded {len(hospital_df)} hospitals")

    print("\nLoading MSPB data...")
    mspb_df = pd.read_csv('../data/Medicare_Hospital_Spending_Per_Patient.csv')
    print(f"Loaded {len(mspb_df)} MSPB records")

    # Filter for just MSPB-1 measure (main spending metric)
    mspb_df = mspb_df[mspb_df['Measure ID'] == 'MSPB-1'].copy()
    print(f"Filtered to {len(mspb_df)} MSPB-1 records")

    # Select relevant columns and rename for clarity
    mspb_df = mspb_df[['Facility ID', 'Score']].rename(columns={'Score': 'MSPB_Score'})

    # Convert Facility ID to string to match hospital data
    mspb_df['Facility ID'] = mspb_df['Facility ID'].astype(str)
    hospital_df['Facility ID'] = hospital_df['Facility ID'].astype(str)

    # Convert MSPB_Score to numeric, handling any errors
    mspb_df['MSPB_Score'] = pd.to_numeric(mspb_df['MSPB_Score'], errors='coerce')

    # Remove duplicates, keeping first occurrence
    mspb_df = mspb_df.drop_duplicates(subset=['Facility ID'], keep='first')
    print(f"After deduplication: {len(mspb_df)} unique facilities with MSPB data")

    # Merge with hospital data
    print("\nMerging data...")
    merged_df = hospital_df.merge(mspb_df, on='Facility ID', how='left')

    # Count successful merges
    matched = merged_df['MSPB_Score'].notna().sum()
    print(f"Successfully matched {matched} out of {len(hospital_df)} hospitals ({matched/len(hospital_df)*100:.1f}%)")

    # Save merged data
    output_file = '../data/Hospital_General_Information_with_MSPB.csv'
    merged_df.to_csv(output_file, index=False)
    print(f"\nMerged data saved to: {output_file}")

    # Show some statistics
    print("\nMSPB Score Statistics:")
    print(merged_df['MSPB_Score'].describe())

    # Show sample of merged data
    print("\nSample of merged data:")
    sample_cols = ['Facility Name', 'City/Town', 'State', 'Hospital overall rating', 'MSPB_Score']
    available_cols = [col for col in sample_cols if col in merged_df.columns]
    print(merged_df[available_cols].head(10))

    return merged_df

if __name__ == '__main__':
    try:
        merge_mspb_data()
        print("\n✅ MSPB data successfully merged!")
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
