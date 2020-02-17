

import json

import numpy as np
import pandas as pd

from pathlib import Path
from flask import Flask


app = Flask(__name__, static_folder='public', static_url_path='')


@app.route('/')
def home():
    return "Hello World!"


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)