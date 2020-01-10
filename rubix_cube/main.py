# -*- coding: utf-8 -*-
"""Main :mod:`rubix_cube` module for running ``make`` targets with minimal
effort command-line invokation.

Module Description
==================

Main module that relies on :class:`argparse.Namespace` to relay parameters
for running the application.

.. moduleauthor:: David Grethlein <djg329@drexel.edu>`

Module Contents
===============

"""

import os
import sys
import json
from argparse import ArgumentParser

#==============================================================================
#		ARG-PARSE SET-UP
#==============================================================================

# Argument parser for direct command line interaction
parser = ArgumentParser(description="Rubix Cube Package Argument Parser")
subparsers = parser.add_subparsers(help=' {----- Package Command(s)  -----}')



#==============================================================================
#		PARSE ARGUMENTS
#==============================================================================
# Parse arguments
args = parser.parse_args()
if len(vars(args)) > 0:
	args.func(args)