ll: test

ci: depclean test doc

PKG_DESCRIPTION = site.cabal
DEP = .cabal-sandbox
CONFIGURE = dist/setup-config

ifndef PREFIX
	PREFIX = /usr/local
endif

.PHONY: ci install dep configure build test run doc clean depclean

$(DEP): $(PKG_DESCRIPTION)
	[ -e $(DEP) ] || ( cabal sandbox init )
	cabal install \
	  --dependencies-only \
	  --enable-documentation \
	  --enable-tests \
	  --haddock-hyperlink-source \
	  --reorder-goals

dep: $(DEP)

$(CONFIGURE): $(DEP)
	cabal configure --enable-tests

configure: $(CONFIGURE)

build-haskell:$(CONFIGURE)
	cabal build

js-dep: static/package.json static/config.js 
	cd static && \
	npm install && \
	jspm install -y
	
build: build-haskell js-dep static/src/* static/styles/* dist
	cd static && gulp build

bundle: build-haskell js-dep static/src/* static/styles/* dist
	cd static && gulp bundle
	
test: $(CONFIGURE)
	cabal test --show-details=streaming

run: $(CONFIGURE) js-dep build-haskell
	cd static && \
	gulp watch &
	./dist/build/site/site

doc: $(CONFIGURE)
	cabal haddock --hyperlink-source

clean:
	rm -rf dist
	rm -rf static/dist
	rm -rf static/node_modules

depclean:
	rm -rf .cabal-sandbox cabal.sandbox.config dist

docker: bundle
	eval `docker-machine env machine` && \
	docker build -t blog . && \
	docker run --name blag -t -p 80:80 blog &

clean-docker: 
	eval `docker-machine env machine` && \
	docker stop blag && \
        docker rm blag

update-aurelia:
	cd static && \
	npm install aurelia-animator-css aurelia-binding aurelia-bootstrapper aurelia-fetch-client aurelia-framework aurelia-history-browser aurelia-loader-default aurelia-logging-console aurelia-pal-browser aurelia-polyfills aurelia-router aurelia-templating aurelia-templating-binding aurelia-templating-resources aurelia-templating-router aurelia-event-aggregator