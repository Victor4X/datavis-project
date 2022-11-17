import pandas as pd
import json

def get_dataframe():
    print("Generating dataframe")
    from ..Dataset import get_data
    with get_data("Launches.json") as f:
        data = json.load(f)

        # Create a dataframe from the json data
        # Normalizing as much as possible
        output_df = pd.json_normalize(data, max_level=5)
        output_df.drop(['updates', 'vidURLs', 'program', 'mission_patches', 'infoURLs', 'rocket.configuration.program', 'rocket.launcher_stage', 'rocket.spacecraft_stage.launch_crew',
                       'rocket.spacecraft_stage.onboard_crew', 'rocket.spacecraft_stage.landing_crew', 'rocket.spacecraft_stage.docking_events'], axis=1, inplace=True)
        
        updates_df = pd.json_normalize(data, record_path=['updates'], meta=['id'], meta_prefix='launch.')
        
        vidURLs_df = pd.json_normalize(data, record_path=['vidURLs'], meta=['id'], meta_prefix='launch.')
        
        infoURLs_df = pd.json_normalize(data, record_path=['infoURLs'], meta=['id'], meta_prefix='launch.')
        
        program_df = pd.json_normalize(data, record_path=['program'], meta=['id'], meta_prefix='launch.')
        program_df.drop(['agencies', 'mission_patches'], axis=1, inplace=True)

        program_agencies_df = pd.json_normalize(data, record_path=['program', 'agencies'], meta=['id', ['program', 'id']], meta_prefix='launch.')

        mission_patches_df = pd.json_normalize(data, record_path=['mission_patches'], meta=['id'], meta_prefix='launch.')

        rocket_config_df = pd.json_normalize(data, record_path=['rocket', 'configuration', 'program'], meta=['id', ['rocket', 'id']], meta_prefix='launch.')
        rocket_config_df.drop(['agencies', 'mission_patches'], axis=1, inplace=True)
        rocket_config_program_agencies_df = pd.json_normalize(data, record_path=['rocket','configuration', 'program', 'agencies'], meta=['id', ['program', 'id']], meta_prefix='launch.')
        rocket_config_program_mission_patches_df = pd.json_normalize(data, record_path=['rocket','configuration', 'program', 'mission_patches'], meta=['id', ['program', 'id']], meta_prefix='launch.')

        rocket_launcher_stage_df = pd.json_normalize(data, record_path=['rocket', 'launcher_stage'], meta=['id'], meta_prefix='launch.')

        """ 
            rocket.spacecraft_stage.launch_crew
            rocket.spacecraft_stace.landing_crew
            rocket.spacecraft_stage.docking_events

            All of these currently throw an iteration error because of NoneType values. 
        """

        output_df.merge(updates_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(vidURLs_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(infoURLs_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(program_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(program_agencies_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(mission_patches_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(rocket_config_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(rocket_config_program_agencies_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(rocket_config_program_mission_patches_df, left_on='id', right_on='launch.id', how='outer')
        output_df.merge(rocket_launcher_stage_df, left_on='id', right_on='launch.id', how='outer')

        return output_df

launch_df = get_dataframe()