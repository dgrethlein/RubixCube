# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys
sys.path.insert(0, os.path.abspath('../../'))
sys.path.insert(0, os.path.abspath('..'))

# -- Project information -----------------------------------------------------

project = 'Rubix Cube'
copyright = '2020, David Grethlein'
author = 'David Grethlein'

# The full version, including alpha/beta/rc tags
release = '0.1.6'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = ['sphinx.ext.napoleon',
      'sphinx.ext.viewcode',
      'sphinx.ext.autodoc',
      'sphinx.ext.intersphinx',
      'sphinxcontrib.programoutput',
      'sphinxarg.ext',
      'sphinxcontrib.srclinks',
      'sphinx.ext.githubpages',
      'sphinx.ext.todo'
      ]

# Napoleon settings
napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = True
napoleon_include_special_with_doc = True

#Todo settings
todo_include_todos = True

#intersphinx settings
intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'pandas': ('http://pandas-docs.github.io/pandas-docs-travis/', None),
    'numpy': ('http://docs.scipy.org/doc/numpy/', None),
    'matplotlib': ('http://matplotlib.sourceforge.net/', None)
}

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#

html_theme = 'sphinx_rtd_theme'

html_theme_options = {
    'navigation_depth': -1,
    'style_external_links': False,
    'collapse_navigation' : False,
    'canonical_url' : 'https://dgrethlein.github.io/RubixCube/'
}

html_logo = '../../misc/twisty_cube.png' 
# Taken from: 
# https://www.todayifoundout.com/index.php/2011/10/
# every-possible-state-of-a-standard-rubiks-cube-ca
# n-be-solved-in-20-moves-or-less/

srclink_project = 'https://github.com/dgrethlein/RubixCube'
srclink_branch = 'master'
srclink_src_path = 'docs/'

# Custom sidebar templates, maps document names to template names.
html_sidebars = {
    '**': [
        'localtoc.html',
        'relations.html',
        'searchbox.html',
        'srclinks.html',
        ],
    'index': [
        'globaltoc.html',
        'relations.html',
        'searchbox.html',
        'srclinks.html',
        ],
}

html_show_sourcelink = True
github_url = 'https://github.com/dgrethlein/RubixCube'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# CSS customization
def setup(app):
    app.add_css_file('custom.css')