#!/bin/bash

# make sure we have the node environment properly set
export NODE_ENV=production

echo "Starting $NODE_ENV build"
DIR="dist"

# remove the destination directory if it exists
if [ -d "$DIR" ]; then
  echo "Removing $DIR"
  rm -r  $DIR
fi

mkdir $DIR

echo "Running the build scripts ..."

# build the application
gulp build

# move the .env file into the correct folder
cp .env $DIR

# enter the destination folder
cd $DIR

echo "Starting up the server ..."

## boot up the server
node server/index.js
