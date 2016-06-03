# https://github.com/darinmorrison/docker-haskell/tree/docker-library
FROM haskell:latest

RUN cabal update

# Add Cabal File and deps/ folder
ADD ./site.cabal /opt/site/site.cabal
RUN cd /opt/site && cabal install --only-dependencies

ADD ./src /opt/site/src
ADD ./static /opt/site/static

# Init logging directories
RUN mkdir /opt/site/log

# Build the Project
RUN cd /opt/site && cabal build

RUN apt-get update && apt-get install -y git cron

# Add our crontab file
ADD config /config

#start up
ADD ./start-up.sh /opt/site/start-up.sh
RUN chmod a+x /opt/site/start-up.sh

# The directory CMD works from
CMD "/opt/site/start-up.sh"