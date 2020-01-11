.PHONY : clean_src

html :
	@cd ./docs/; make html; cd ..
	@make clean_src

clean_html : 
	@cd ./docs/; make clean; cd ..

github:
	@make html
	@cp -a ./docs/build/html/. ./docs

release:
	@python3 ./setup.py sdist

to_pipy:
	@twine upload ./dist/*

clean_src : 
	@find __pycache__ rubix_cube/ | grep __pycache__ | xargs rm -fR