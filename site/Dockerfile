# https://github.com/darinmorrison/docker-haskell/tree/docker-library
FROM haskell:latest

RUN cabal update

# Add Cabal File and deps/ folder
ADD ./site.cabal /opt/site/site.cabal
RUN cd /opt/site && cabal install --only-dependencies
RUN apt-get update && apt-get install -y git

# Add our crontab file
ADD config /config

ADD ./src /opt/site/src

# Init logging directories
RUN mkdir /opt/site/log

# Build the Project
RUN cd /opt/site && cabal build

#start up
ADD ./start-up.sh /opt/site/start-up.sh
RUN chmod a+x /opt/site/start-up.sh

ADD ./static /opt/site/static

# The directory CMD works from
CMD "/opt/site/start-up.sh"