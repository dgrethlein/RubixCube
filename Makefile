.PHONY : clean_src

html :
	@cd ./docs/; make html; cd ..
	@make clean_src

clean_html : 
	@cd ./docs/; make clean; cd ..

clean_src : 
	@find __pycache__ rubix_cube/ | grep __pycache__ | xargs rm -fR