
import os
import json

import numpy as np
import pandas as pd

from pathlib import Path
from flask import Flask , render_template , send_file

# Defines the server's static paths for serving files
app = Flask(__name__, static_folder='public', static_url_path='')


# Handle the index (home) page
@app.route('/')
def index():
    return render_template('index.html')

# Handle any files that begin "/lib" by loading from the lib directory
@app.route('/lib/<path:path>')
def send_lib(path):
    return send_file(Path(app.root_path) / 'lib' / path)

# Handle any unhandled filename by loading its template
@app.route('/<name>')
def generic(name):
    return render_template(name + '.html')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)