.PHONY: install build run clean

install:
	npm install

build:
	ng build --configuration=production

run:
	ng serve & node auth-server.js

clean:
	rm -rf dist/
	rm -rf node_modules/