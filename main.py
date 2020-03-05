# -*- coding: utf-8 -*-
"""Main module for running ``make`` targets with minimal
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
import argparse

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

from rubix_cube.cube_game import Cube_Game
from rubix_cube.plot_cube_2d import plot_cube_2D
from rubix_cube.plot_cube_3d import plot_cube_3D

#==============================================================================
#		ARG-PARSE SET-UP
#==============================================================================
TOP_LEVEL_DESCRIPTION = "Rubix Cube Package Argument Parser"

# Argument parser for direct command line interaction
parser = argparse.ArgumentParser(description=TOP_LEVEL_DESCRIPTION)
subparsers = parser.add_subparsers(help=' {----- Package Command(s)  -----}')

#------------------------------------------------
#	TEST RUBIX CUBE PARSER
#------------------------------------------------
test_cube_parser = subparsers.add_parser('test_cube',
	help='Generates a solved 3x3 Rubix Cube object.')


cg = Cube_Game(verbose=True)

while True:
	fig , ax = plt.subplots(figsize=(8,5))
	ax.set_xlim(left=-600,right=900)
	ax.set_ylim(top=500,bottom=-500)

	plot_cube_2D(ax=ax,
	             cube=cg.game_cube)


	plt.show(block=False)

	move = input("Move the Cube <Q to quit>: ")

	if move.lower() == 'q':

		print(json.dumps(cg.game_cube.to_json_safe_dict(), indent=4))

		cg.game_log['events'].append({'type' : '<<__QUIT_GAME__>>'})
		plt.close(fig)
		break

	elif move.lower() == "scramble":

		sequence = Cube_Game.get_scramble_sequence()

		if len(sequence) > 0:
			cg.game_log['events'].append({'type' : '<<__START_SCRAMBLE__>>'})

			plt.close(fig)

			for mv in sequence:
				fig , ax = plt.subplots(figsize=(8,5))
				ax.set_xlim(left=-600,right=900)
				ax.set_ylim(top=500,bottom=-500)

				plot_cube_2D(ax=ax, cube=cg.game_cube)

				plt.show(block=False)

				plt.pause(0.05)

				cg.manipulate_cube(mv)

				plt.close(fig)

			cg.game_log['events'].append({'type' : '<<__END_SCRAMBLE__>>'})

			continue

	elif move.lower() == "solve"\
	and cg.game_cube.get_num_solved_faces() != 6:

		# Computes the solution via reversal through the logs
		inv_log_sequence = cg.compute_inverse_log_sequence()

		if len(inv_log_sequence) > 0:

			plt.close(fig)

			for mv in inv_log_sequence:
				fig , ax = plt.subplots(figsize=(8,5))
				ax.set_xlim(left=-600,right=900)
				ax.set_ylim(top=500,bottom=-500)

				plot_cube_2D(ax=ax, cube=cg.game_cube)

				plt.show(block=False)

				plt.pause(0.05)

				cg.manipulate_cube(mv)

				plt.close(fig)

				if cg.game_cube.get_num_solved_faces() == 6:
					cg.game_log['events'].append({'type' : '<<__SOLVE_CUBE__>>'})
					break

			continue

	else:
		cg.manipulate_cube(move)

	plt.close(fig)

print("\n--------------------------------------------------------------")
print(f"[DEBUG]\tGame log for game : '{cg.game_name}'")
print("--------------------------------------------------------------")
for e_idx , event in enumerate(cg.game_log['events']):
	print(f"\t*\tEvent[{e_idx}] Type : '{event['type']}'")
print("--------------------------------------------------------------")


#fig = plt.figure(figsize=(7,7))
#ax = fig.gca(projection='3d')
#plot_cube_3D(ax , cg.game_cube)
#plt.show()




#==============================================================================
#		PARSE ARGUMENTS
#==============================================================================
# Parse arguments
args = parser.parse_args()
if len(vars(args)) > 0:
	args.func(args)