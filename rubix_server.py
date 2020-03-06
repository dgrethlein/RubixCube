
import os
import json

import numpy as np
import pandas as pd

from pathlib import Path
from flask import Flask , jsonify
from flask import render_template
from flask import send_file , request

from flask_login import LoginManager

from rubix_cube.cube import Cube
from rubix_cube.cube_game import Cube_Game

from rubix_cube.plot_cube_2d import plot_cube_2D

import matplotlib.pyplot as plt


# Defines the server's static paths for serving files
app = Flask(__name__, static_folder='public', static_url_path='')
#login = LoginManager(app)

# Handle the index (home) page
@app.route('/')
def index():
    return render_template('index.html')

# Get a JSON-safe version of a default cube game object
@app.route('/api/cube_games/PUBLIC_GAMES/<path:path>')
def send_public_game(path):
    p_game = json.load(open((Path(app.root_path) / 'api/cube_games/PUBLIC_GAMES') / path))
    return p_game

@app.route('/api/updateGameState', methods=['POST'])
def game_state_update():

    #Converts the request to a JSON-style dict
    request_d = request.form.to_dict(flat=False)

    # Extracts the info from the request
    game_update = request_d['game_state_update'][0]
    change_cube = request_d['change_cube_state']
    game_state = json.loads(request_d['game_state'][0]) # Gets the dictionary to construct a game
    game_player = game_state['gamePlayer']
    game_name = game_state['gameName']

    print(f"\nState Update : {game_update}")
    print(f"Change Cube  : {change_cube}")
    print(f"Game Name : {game_name}")
    print(f"Game Player : {game_player}")

    cube_dict = game_state['gameCube']
    for name , face in cube_dict['faces'].items():
        cube_dict['faces'][name] = np.array(face)

    # Constructs a cube game from the current game state
    cg = Cube_Game(cube=Cube(colors=cube_dict['colors'],
                        faces=cube_dict['faces']),
                   player_name=game_player,
                   game_name=game_name,
                   game_log={'events' : game_state['events']},
                   scramble=False,
                   verbose=False)

    # Makes a move
    if game_update in Cube_Game.CUBE_FUNCS:
        cg.manipulate_cube(game_update)


    # Updates the game state
    json_cube = cg.game_cube.to_json_safe_dict()
    game_state['gameCube'] = json_cube
    game_state['events'] = cg.game_log['events']
    game_state['isSolved'] = cg.game_cube.is_solved()
    game_state['numSolvedFaces'] = cg.game_cube.get_num_solved_faces()
    game_state['numMatchingAdjTiles'] = cg.game_cube.get_num_matching_adjacent_tiles()

    # Sends an updated state to the front end
    return game_state

@app.route('/api/getSolutionSequence', methods=['POST'])
def get_solution_sequence():

    #Converts the request to a JSON-style dict
    request_d = request.form.to_dict(flat=False)

    # Extracts the info from the request
    game_state = json.loads(request_d['game_state'][0]) # Gets the dictionary to construct a game
    game_player = game_state['gamePlayer']
    game_name = game_state['gameName']

    #print(f"Game Name : {game_name}")
    #print(f"Game Player : {game_player}")

    print(f"Game Is Solved : {game_state}")

    cube_dict = game_state['gameCube']
    for name , face in cube_dict['faces'].items():
        cube_dict['faces'][name] = np.array(face)

    # Constructs a cube game from the current game state
    cg = Cube_Game(cube=Cube(colors=cube_dict['colors'],
                        faces=cube_dict['faces']),
                   player_name=game_player,
                   game_name=game_name,
                   game_log={'events' : game_state['events']},
                   scramble=False,
                   verbose=False)

    return {'sequence' : cg.compute_inverse_log_sequence(),
            'isSolved' : cg.game_cube.is_solved(),
            'numSolvedFaces' : cg.game_cube.get_num_solved_faces(),
            'numMatchingAdjTiles' : cg.game_cube.get_num_matching_adjacent_tiles()}


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


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)