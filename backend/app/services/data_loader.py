import json
from pathlib import Path

from app.config import Settings


DATA_DIR = Settings.DATA_DIR


def load_json_file(filename: str):
    file_path = DATA_DIR / filename
    with file_path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_dashboard_data():
    return load_json_file("kpis.json")


def load_citizen_signals():
    return load_json_file("citizen_signals.json")


def load_operations_data():
    return load_json_file("operations.json")


def load_historical_cases():
    return load_json_file("historical_cases.json")
