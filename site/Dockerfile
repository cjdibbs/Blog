# https://github.com/darinmorrison/docker-haskell/tree/docker-library
FROM cjdibbs/haskell-node

RUN cabal update

# Add Cabal File and deps/ folder
ADD ./site.cabal /opt/site/site.cabal
RUN cd /opt/site && cabal install --only-dependencies

ADD ./src /opt/site/src
ADD ./static /opt/src/static

# Init logging directories
RUN mkdir /opt/site/log

# Build the Project

RUN cd /opt/src/static && \
	npm install && \
	jspm install -y \
	gulp build

RUN cd /opt/site && cabal build

# The directory CMD works from
WORKDIR /opt/site
CMD ["./dist/build/site/site", "-p 80"]
