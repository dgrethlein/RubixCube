# -*- coding: utf-8 -*-
"""Rubix :class:`Cube_Solution` class Module

Module Description
==================

Collection of methods that define the main Rubix :class:`Cube_Solution` class
data structure and how it manipulates a :class:`Cube <rubix_cube.cube.Cube>`
object, prints to console, logs a history of both moves and re-orientations, 
scrambles the state of the cube, and loads


Module Contents
===============

    *   :class:`Cube_Solution` details code for manipulating :class:`Rubix 
        Cube(s) <rubix_cube.cube.Cube>`.

.. moduleauthor:: David Grethlein <djg329@drexel.edu>

"""

from pathlib import Path 

import os
import sys
import json

import warnings

from typing import List, Tuple, Dict

import numpy as np

from .cube import Cube


class Cube_Game(object):
    """

    """

    #==========================================================================
    #       CONSTANTS FOR CUBE GAME(s)
    #==========================================================================
    EVENT_TYPES = ['<<__NEW_GAME__>>',
                   'F',
                   'Fi',
                   'B',
                   'Bi',
                   'L',
                   'Li',
                   'R',
                   'Ri',
                   'U',
                   'Ui',
                   'D',
                   'Di',
                   '<<__START_SCRAMBLE__>>',
                   '<<__END_SCRAMBLE__>>',
                   '<<__COLOR_CHANGE__>>',
                   '<<__SAVE_GAME__>>',
                   '<<__LOAD_GAME__>>',
                   '<<__PAUSE_GAME__>>',
                   '<<__SOLVE_CUBE__>>',
                   '<<__QUIT_GAME__>>']

    #==========================================================================
    #       CLASS CONSTRUCTOR
    #==========================================================================
    def __init__(self,
                 cube : Cube = None,
                 game_name : str = 'Untitled_Cube_Game',
                 game_log : Dict = None,
                 scramble : bool = False,
                 verbose : bool = False):
        """
        
        Args:

        """

        # Sets Up Game
        self.verbose = verbose
        self.game_name = game_name
        

        # Initializes a default cube
        if cube is None:
            self.game_cube = Cube()
            self.game_log = {'events' : [{'type' : '<<__NEW_GAME__>>'}]}

            if self.verbose:
                print(f"\n[DEBUG]\tNew DEFAULT Cube Created for Game : '{self.game_name}'\n")

        else:
            self.game_cube = cube
            self.game_log = game_log

        


    #==========================================================================
    #       PROPERTY INTERFACE(s)
    #==========================================================================
    @property
    def game_cube(self) -> Cube:
        """

        """
        return self.__game_cube


    @game_cube.setter
    def game_cube(self , cube : Cube):
        if isinstance(cube, Cube)\
        and cube.is_well_formed():

            self.__game_cube = cube


    @property
    def game_name(self) -> str:
        """

        """
        return self.__game_name
    

    @game_name.setter
    def game_name(self, name : str):
        if isinstance(name, str)\
        and len(name) > 0:

            self.__game_name = name


    @property
    def game_log(self) -> Dict:
        """

        """
        return self.__game_log


    @game_log.setter
    def game_log(self, game_log : Dict):
        if isinstance(game_log, dict)\
        and 'events' in game_log\
        and isinstance(game_log['events'], list)\
        and len(game_log['events']) > 0\
        and all([isinstance(event, dict) for event in game_log['events']]):

            # Has to ensure that all event types are valid
            valid_log = all(['type' in event\
                             and event['type'] in Cube_Game.EVENT_TYPES\
                                for event in game_log['events']])

            if valid_log:
                self.__game_log = game_log


    @property
    def verbose(self) -> bool:
        """

        """
        return self.__verbose


    @verbose.setter
    def verbose(self, verbose : bool):
        if isinstance(verbose, bool):
            self.__verbose = verbose
        else:
            self.__verbose = False 
    
    
    


