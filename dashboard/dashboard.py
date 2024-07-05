# dashboard_data.py

import os
import requests
import pandas as pd
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from IPython.display import display

load_dotenv()

API_URL = os.getenv('API_URL')

class DashboardData:
    _instance = None
    _data = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._data is None:
            self._data = self.fetch_data()
            print(self._data)
            self.dau = self._data['DAU']
            self.total_players = self._data['totalPlayers']
            self.day1_retention = self._data['day1retention']
            self.day7_retention = self._data['day7retention']
            self.day30_retention = self._data['day30retention']
            self.yesterday_retention = self._data['yesterdayRetention']
            self.new_players_per_day = self._data['newPlayersPerDay']
            self.games_per_mode_per_day = self._data['gamesPerModePerDay']
            self.median_game_duration = self._data['medianGameDuration']

    @classmethod
    def fetch_data(cls):
        response = requests.get(f"{API_URL}/getDashboardData")
        return response.json()

    def prepare_new_players_data(self):
        return [{'date': date, 'newPlayers': count} for date, count in self.new_players_per_day.items()]

    def prepare_games_per_mode_data(self):
        data = []
        for date, modes in self.games_per_mode_per_day.items():
            for mode, count in modes.items():
                data.append({'date': date, 'mode': mode, 'count': count})
        return data

def plot_dau_and_new_players():
    data = DashboardData()
    
    # Prepare DAU data
    dau_dates = [entry['date'] for entry in data.dau]
    dau_user_counts = [entry['userCount'] for entry in data.dau]
    
    # Prepare new players data
    new_players_data = data.prepare_new_players_data()
    new_players_dates = [entry['date'] for entry in new_players_data]
    new_players_counts = [entry['newPlayers'] for entry in new_players_data]
    
    # Create subplots
    fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(15, 5))
    
    # Plot DAU
    axes[0].plot(dau_dates, dau_user_counts, label='DAU')
    axes[0].set_title('Daily Active Users (DAU)')
    axes[0].set_xlabel('Date')
    axes[0].set_ylabel('User Count')
    axes[0].tick_params(axis='x', rotation=45)
    axes[0].legend()
    
    # Plot New Players Per Day
    axes[1].plot(new_players_dates, new_players_counts, label='New Players Per Day')
    axes[1].set_title('New Players Per Day')
    axes[1].set_xlabel('Date')
    axes[1].set_ylabel('New Players')
    axes[1].tick_params(axis='x', rotation=45)
    axes[1].set_ylim(0, max(new_players_counts) + 1)
    axes[1].set_yticks(range(0, max(new_players_counts) + 2))
    axes[1].legend()
    
    plt.tight_layout()
    plt.show()


def plot_games_per_mode():
    data = DashboardData()
    games_per_mode_data = data.prepare_games_per_mode_data()
    df = pd.DataFrame(games_per_mode_data)
    df['date'] = pd.to_datetime(df['date'])
    
    modes = df['mode'].unique()
    mode_colors = {'0': 'blue', '1': 'green', '2': 'red'}
    
    plt.figure(figsize=(10, 5))
    for mode in modes:
        mode_data = df[df['mode'] == mode]
        plt.plot(mode_data['date'], mode_data['count'], label=f'Mode {mode}', color=mode_colors.get(mode, 'black'))
    
    plt.title('Games Per Mode Per Day')
    plt.xlabel('Date')
    plt.ylabel('Games Count')
    plt.xticks(rotation=45)
    plt.gca().xaxis.set_major_locator(mdates.DayLocator())
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
    plt.legend()
    plt.show()

def display_retention_table():
    data = DashboardData()
    retention_data = {
        "Retention Period": ["Day 1", "Day 7", "Day 30", "Yesterday"],
        "Returning Players": [
            data.day1_retention['returningPlayers'],
            data.day7_retention['returningPlayers'],
            data.day30_retention['returningPlayers'],
            data.yesterday_retention['returningPlayers']
        ],
        "Retention Rate (%)": [
            data.day1_retention['retentionRate'],
            data.day7_retention['retentionRate'],
            data.day30_retention['retentionRate'],
            data.yesterday_retention['retentionRate']
        ]
    }
    retention_df = pd.DataFrame(retention_data)
    display(retention_df)

def print_additional_info():
    data = DashboardData()
    print(f"Median Game Duration: {data.median_game_duration:.2f} min")
    print(f"Total Players: {data.total_players}")
