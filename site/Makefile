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

build: $(CONFIGURE) static/src/* static/styles/*
	cabal build
	cd static && \
	npm install && \
	jspm install && \
	gulp build

test: $(CONFIGURE)
	cabal test --show-details=streaming

run: $(CONFIGURE) build
	cd static && \
	gulp watch &
	./dist/build/site/site

doc: $(CONFIGURE)
	cabal haddock --hyperlink-source

clean:
	rm -rf dist
	rm -rf static/dist

depclean:
	rm -rf .cabal-sandbox cabal.sandbox.config dist
