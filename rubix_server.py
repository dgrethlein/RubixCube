
import os
import json

import numpy as np
import pandas as pd

from pathlib import Path
from flask import Flask , jsonify
from flask import render_template
from flask import send_file , request

from rubix_cube.cube import Cube
from rubix_cube.cube_game import Cube_Game

# Defines the server's static paths for serving files
app = Flask(__name__, static_folder='public', static_url_path='')


# Handle the index (home) page
@app.route('/')
def index():
    return render_template('index.html')

# Get a JSON-safe version of a default cube game object
@app.route('/api/cube_games/PUBLIC_GAMES/<path:path>')
def send_public_game(path):
    p_cube = json.load(open((Path(app.root_path) / 'api/cube_games/PUBLIC_GAMES') / path))
    return p_cube

@app.route('/api/CUBE_GAME_EVENT_TYPES')
def get_cube_game_event_types():
    return {'EVENT_TYPES' : Cube_Game.EVENT_TYPES}

# Handle any files that begin "/lib" by loading from the lib directory
@app.route('/lib/<path:path>')
def send_lib(path):
    return send_file((Path(app.root_path) / 'lib' ) / path)

# Handle any unhandled filename by loading its template
@app.route('/<name>')
def generic(name):
    return render_template(name + '.html')

@app.route('/api/test')
def api_test():
    clicked = request.args.get('clicked', default='no')
    return jsonify({'message': 'User clicked ' + clicked})

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)