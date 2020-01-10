# -*- coding: utf-8 -*-
"""Rubix :class:`Cube` class data-structure Module

Module Description
==================

Collection of methods that define the main Rubix :class:`Cube` class data
structure and how it is interacted with by other modules.

Note:
	Using `Western Color Scheme 
	<https://ruwix.com/the-rubiks-cube/japanese-western-color-schemes/>`_ as
	default Rubix Cube coloring scheme.

Module Contents
===============

.. moduleauthor:: David Grethlein <djg329@drexel.edu>

"""

import os
import sys
import json

import warnings

from typing import List, Tuple, Dict

import numpy as np
from matplotlib.colors import is_color_like


class Cube:
	"""Data structure for representing a 3x3x3 rubix-cube.
	
	Note:
		All attributes are Python-"private", and are interfaced using
		``@property`` decorators.

	Attributes:
		__up_face (numpy.ndarray): 3x3 array of values representing the colors
			of the tiles on the top face.  
		__up_color (str): HEX encoding of up-face's starting color.
			Default value is ``#ffffff`` "White".
		__down_face (numpy.ndarray): 3x3 array of values representing the
			colors of the tiles on the bottom face.
		__down_color (str): HEX encoding of down-face's starting color.
			Default value is ``#ffd500`` "Cyber Yellow".
		__front_face (numpy.ndarray): 3x3 array of values representing the
			colors of the tiles on the front face.
		__front_color (str): HEX encoding of front-face's starting color.
			Default value is ``#009b48`` "Green (Pigment)".
		__back_face (numpy.ndarray): 3x3 array of values representing the
			colors of the tiles on the rear face.
		__back_color (str): HEX encoding of back-face's starting color.
			Default value is ``#0045as`` "Cobalt Blue".
		__left_face (numpy.ndarray): 3x3 array of values representing the
			colors of the tiles on the left face.
		__left_color (str): HEX encoding of left-face's starting color.
			Default value is ``#ff5900`` "Orange (Pantone)".
		__right_face (numpy.ndarray): 3x3 array of values representing the
			colors of the tiles on the right face.
		__right_color (str): HEX encoding of right-face's starting color.
			Default value is ``#b90000`` "UE Red".

	"""

	def __init__(self ,
				 colors : Dict[str,str] = None,
				 faces : Dict[str,np.array] = None,
				 verbose : bool = False):
		""":class:`Cube` class constructor.

		Args:
			colors (Dict[str,str], optional): Dictionary of color HEX strings.
				Default value is ``None`` which will create a cube with default
				colors.

				Required fields in colors dictionary: 

			faces (Dict[str,np.array], optional): Dictionary of face names to
				3x3 arrays of the the tile face values. Defaul value is 
				``None`` which will create a solved cube with default colors.

		"""

	#==========================================================================
	#		CONSTANTS FOR DEFAULT CUBE-COLORS
	#==========================================================================
	DEFAULT_UP_COLOR = '#ffffff'		# White
	DEFAULT_DOWN_COLOR = '#ffd500'		# Cyber Yellow
	DEFAULT_FRONT_COLOR = '#009b48'		# Green (Pigment)
	DEFAULT_BACK_COLOR = '#0045as'		# Cobalt Blue
	DEFAULT_LEFT_COLOR = '#ff5900'		# Orange (Pantone)
	DEFAULT_RIGHT_COLOR = '#b90000'		# UE Red

	DEFAULT_FACE_COLORS = {
		'UP_COLOR' : DEFAULT_UP_COLOR,
		'DOWN_COLOR' : DEFAULT_DOWN_COLOR,
		'FRONT_COLOR' : DEFAULT_FRONT_COLOR,
		'BACK_COLOR' : DEFAULT_BACK_COLOR,
		'LEFT_COLOR' : DEFAULT_LEFT_COLOR,
		'RIGHT_COLOR' : DEFAULT_RIGHT_COLOR
	}



