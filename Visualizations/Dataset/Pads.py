import pandas as pd
import json

def gen_dataframe():
    print("Generating Pads dataframe")
    from ..Dataset import get_data
    with get_data("Pads.json") as f:
        data = json.load(f)
        data = pd.json_normalize(data)
        return data

def get_pads_by_year():
    print("Generating Pads by year dataframe")
    df = pad_df
    from ..Dataset import get_data
    with get_data("rels/pad_launches_per_year.json") as f:
        data = json.load(f)

        output = pd.DataFrame()
    
        # This is slow (TODO)
        for pad_id, year_dict in data.items():
            for year, count in year_dict.items():
                pad_row = pd.DataFrame.from_records(df.loc[df['id'] == int(pad_id)])
                pad_row["year"] = year
                pad_row["total_attempts_year"] = count
                output = pd.concat([output,pad_row])
        return output

pad_df = gen_dataframe()