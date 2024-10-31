from nicegui import ui
import requests
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
API_KEY = os.getenv('API_KEY', '')

LOCAL_API = "http://api:5001/legion-32c6d/us-central1"
PROD_API = "https://us-central1-legion-32c6d.cloudfunctions.net"

current_api = LOCAL_API
last_visit = None

def get_headers():
    if current_api == PROD_API:
        return {'X-API-Key': API_KEY}
    return {}

def get_last_visit() -> Optional[str]:
    global last_visit
    return last_visit

def update_last_visit():
    global last_visit
    last_visit = datetime.utcnow().isoformat()

def toggle_api():
    global current_api
    current_api = PROD_API if current_api == LOCAL_API else LOCAL_API
    api_label.text = f"Current API: {current_api}"
    if current_api == PROD_API and not API_KEY:
        ui.notify('Warning: No API key set for production API', type='warning')
    load_players()

def format_date(date_str):
    if not date_str:
        return 'N/A'
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d')
    except:
        return date_str

def shorten_id(player_id):
    return f"{player_id[:6]}...{player_id[-4:]}"

def is_new_player(join_date: str) -> bool:
    last_visit = get_last_visit()
    if not last_visit or not join_date:
        return False
    try:
        join_dt = datetime.fromisoformat(join_date.replace('Z', '+00:00'))
        last_visit_dt = datetime.fromisoformat(last_visit)
        return join_dt > last_visit_dt
    except:
        return False

async def fetch_action_log(player_id=None):
    if not player_id:
        player_id = player_id_input.value
    if not player_id:
        ui.notify('Please enter or select a Player ID', type='warning')
        return

    try:
        response = requests.get(
            f"{current_api}/getActionLog",
            params={'playerId': player_id},
            headers=get_headers()
        )
        if response.status_code == 200:
            actions.clear()
            data = response.json()
            
            with actions:
                with ui.card().classes('w-full mb-4'):
                    ui.label('Player Summary').classes('text-lg font-bold')
                    summary = data.get('playerSummary', {})
                    ui.label(f"Join Date: {format_date(summary.get('joinDate', 'N/A'))}")
                    ui.label(f"Last Active: {format_date(summary.get('lastActiveDate', 'N/A'))}")
                    ui.label(f"Rank: {summary.get('rank', 'N/A')}")
                    ui.label(f"Gold: {summary.get('gold', 'N/A')}")
                
                ui.label('Action Log').classes('text-lg font-bold mt-4')
                for action in data.get('actionLog', []):
                    with ui.card().classes('w-full mb-2 p-2'):
                        ui.label(f"Action: {action.get('actionType', 'N/A')}").classes('font-bold')
                        ui.label(f"Time: {format_date(action.get('timestamp', {}).get('_seconds', 'N/A'))}")
                        ui.label(f"Details: {action.get('details', 'N/A')}").classes('text-sm font-mono')
        elif response.status_code == 401:
            ui.notify('Unauthorized: Check your API key', type='error')
        else:
            ui.notify(f'Error: {response.status_code}', type='error')
    except Exception as e:
        ui.notify(f'Error: {str(e)}', type='error')

def load_players():
    try:
        response = requests.get(
            f"{current_api}/listPlayers",
            headers=get_headers()
        )
        if response.status_code == 200:
            players_list.clear()
            
            players = sorted(
                response.json(),
                key=lambda x: x.get('joinDate', ''),
                reverse=True
            )
            
            with players_list:
                ui.label('Players').classes('text-xl font-bold mb-2')
                for player in players:
                    player_id = player.get('id')
                    join_date = player.get('joinDate')
                    formatted_date = format_date(join_date)
                    
                    with ui.card().classes('w-full mb-2 p-2 cursor-pointer hover:bg-gray-100').on('click', lambda p=player_id: fetch_action_log(p)):
                        with ui.row().classes('items-center gap-2'):
                            ui.label(f"ID: {shorten_id(player_id)}").classes('font-mono')
                            if is_new_player(join_date):
                                ui.label('NEW').classes('px-2 py-0.5 text-xs bg-green-500 text-white rounded-full')
                        ui.label(f"Joined: {formatted_date}").classes('text-sm text-gray-600')
        elif response.status_code == 401:
            ui.notify('Unauthorized: Check your API key', type='error')
            players_list.clear()
            with players_list:
                ui.label('Unable to load players: Unauthorized').classes('text-red-500')
        else:
            ui.notify(f'Error loading players: {response.status_code}', type='error')
    except Exception as e:
        ui.notify(f'Error loading players: {str(e)}', type='error')

@ui.page('/')
def dashboard():    
    global api_label, player_id_input, actions, players_list
    
    with ui.row().classes('w-full h-full gap-4 p-4'):
        with ui.column().classes('w-1/4 min-w-[250px]'):
            with ui.card().classes('w-full'):
                players_list = ui.column().classes('w-full')
        
        with ui.column().classes('flex-grow'):
            ui.label('Legion Dashboard').classes('text-2xl font-bold mb-4')
            
            with ui.row().classes('items-center gap-4'):
                ui.switch('Use Production API', on_change=toggle_api)
                api_label = ui.label(f"Current API: {current_api}")
            
            with ui.row().classes('items-center gap-4 mt-4'):
                player_id_input = ui.input(label='Player ID').classes('flex-grow')
                ui.button('Fetch Action Log', on_click=lambda: fetch_action_log())
            
            actions = ui.column().classes('mt-4 w-full')
    
    # Update last visit time and load players
    update_last_visit()
    load_players()

ui.run(port=8050, host='0.0.0.0')