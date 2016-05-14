# https://github.com/darinmorrison/docker-haskell/tree/docker-library
FROM haskell:7.8

RUN cabal update

# Add Cabal File and deps/ folder
ADD ./site.cabal /opt/site/site.cabal
# ADD ./deps /opt/site/deps

# Create Sandbox and Add Source Deps
# RUN cd /opt/site && \
#        cabal sandbox init && \
#        cabal sandbox add-source deps/io-streams-haproxy && \
#        cabal sandbox add-source deps/snap && \
#        cabal sandbox add-source deps/snap-core && \
#        cabal sandbox add-source deps/snap-server && \
#        cabal sandbox add-source deps/snap-loader-static && \
#        cabal sandbox add-source deps/heist

RUN cd /opt/site && cabal install --only-dependencies

# Explicitly add relevant folders
ADD ./src /opt/site/src
#ADD ./snaplets /opt/src/snaplets
#ADD ./static /opt/src/static

# Init logging directories
RUN mkdir /opt/site/log

# Build the Project
RUN cd /opt/site && cabal build

# The directory CMD works from
WORKDIR /opt/site
CMD ["./dist/build/site/site", "-p 80"]
