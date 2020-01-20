.PHONY : clean_src

html :
	@cd ./docs/; make html; cd ..
	@make clean_src

clean_html : 
	@cd ./docs/; make clean; cd ..

github:
	@make html
	@cp -a ./docs/build/html/. ./docs

run_tests:
	@python3 -m unittest ./rubix_cube/tests/test_cube_game.py
	
release:
	@python3 ./setup.py sdist

to_pypi:
	@twine upload ./dist/*

doc_sphinx:
	@sphinx-apidoc -o ./docs/source/ ./rubix_cube/ --separate

clean_src : 
	@find __pycache__ rubix_cube/ | grep __pycache__ | xargs rm -fR